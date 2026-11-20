import { NextRequest, NextResponse } from "next/server";

// Upstream Backend API target
const BACKEND_BASE = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dev.surplusmarket.com"
).replace(/\/$/, "");

// In-memory sliding window rate-limiter: max 1 request per IP per 10 minutes
interface RateLimitRecord {
  timestamps: number[];
}
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    for (const [ip, record] of rateLimitMap.entries()) {
      const recent = record.timestamps.filter((t) => now - t < windowMs);
      if (recent.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        record.timestamps = recent;
      }
    }
  }, 15 * 60 * 1000);
  
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "127.0.0.1";

    const now = Date.now();
    const windowMs = 10 * 60 * 1000;
    const maxRequests = 1;

    let record = rateLimitMap.get(ip);
    if (!record) {
      record = { timestamps: [] };
      rateLimitMap.set(ip, record);
    }
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

    if (record.timestamps.length >= maxRequests) {
      const oldest = record.timestamps[0];
      const remainingMs = windowMs - (now - oldest);
      const remainingMinutes = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
      console.warn(`[AntiSpam Sourcing] IP ${ip} exceeded ${maxRequests} submission per 10min. Rate limited.`);
      return NextResponse.json(
        {
          success: false,
          message: `Submission limit reached: Only 1 submission allowed every 10 minutes. Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));

    // Honeypot check
    const honeypotVal = String(
      body?.company_website_url || 
      body?.hp_contact_check || 
      body?.website || 
      body?.fax_number || 
      ""
    ).trim();

    if (honeypotVal) {
      console.warn(`[AntiSpam Sourcing] Bot honeypot triggered from ${ip}. Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for your sourcing request. Our procurement team will review it shortly.",
      });
    }

    // Google reCAPTCHA Verification
    const recaptchaToken = body?.recaptchaToken || body?.["g-recaptcha-response"];
    const recaptchaSecret =
      process.env.RECAPTCHA_SECRET_KEY ||
      "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; // Official Google test secret

    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, message: "Please complete the reCAPTCHA verification." },
        { status: 400 }
      );
    }

    try {
      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: recaptchaSecret,
          response: recaptchaToken,
          remoteip: ip,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        console.warn(`[AntiSpam Sourcing] Google reCAPTCHA verification failed from IP ${ip}:`, verifyData["error-codes"]);
        return NextResponse.json(
          { success: false, message: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    } catch (recaptchaErr) {
      console.error("[AntiSpam Sourcing] Google reCAPTCHA check failed:", recaptchaErr);
    }

    record.timestamps.push(now);

    // Strip anti-spam internals before forwarding to Django
    const cleanPayload = { ...body };
    delete cleanPayload.company_website_url;
    delete cleanPayload.hp_contact_check;
    delete cleanPayload.recaptchaToken;
    delete cleanPayload["g-recaptcha-response"];

    // Forward to backend Django Sourcing API
    try {
      const backendRes = await fetch(`${BACKEND_BASE}/api/enquiries/sourcing/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Forwarded-For": ip,
        },
        body: JSON.stringify(cleanPayload),
      });

      if (backendRes.ok) {
        const data = await backendRes.json().catch(() => ({}));
        return NextResponse.json({
          success: true,
          message: data?.message || "Sourcing request submitted successfully! Our procurement desk will contact you with availability.",
          data,
        });
      }

      const errData = await backendRes.json().catch(() => null);
      if (backendRes.status >= 400 && backendRes.status < 500 && errData?.message) {
        return NextResponse.json(
          { success: false, message: errData.message },
          { status: backendRes.status }
        );
      }
    } catch (err: any) {
      console.error("[Sourcing API Proxy] Upstream backend failed:", err?.message || err);
    }

    // Graceful fallback
    return NextResponse.json({
      success: true,
      message: "Sourcing request received! Our procurement desk will contact you soon.",
    });
  } catch (error: any) {
    console.error("[Sourcing API Proxy] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
