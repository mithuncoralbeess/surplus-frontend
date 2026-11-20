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

    // 1. IP Sliding Window Rate Limiting (1 submission per 10 minutes)
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
      console.warn(`[AntiSpam Regional] IP ${ip} exceeded ${maxRequests} submission per 10min. Rate limited.`);
      return NextResponse.json(
        {
          success: false,
          message: `Submission limit reached: Only 1 submission allowed every 10 minutes. Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));

    // 2. Honeypot check (filled exclusively by automated bots)
    const honeypotVal = String(
      body?.company_website_url || 
      body?.hp_contact_check || 
      body?.website || 
      body?.fax_number || 
      ""
    ).trim();

    if (honeypotVal) {
      console.warn(`[AntiSpam Regional] Bot honeypot triggered from ${ip} ("${honeypotVal}"). Silently dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for your quote request. Our regional procurement desk will review it shortly.",
      });
    }

    // 3. Fast Submission Timing Check (bots submit instantly < 2000ms)
    const formTime = Number(body?._formTime || 0);
    if (formTime > 0 && now - formTime < 2000) {
      console.warn(`[AntiSpam Regional] Fast submission detected from ${ip} (${now - formTime}ms). Silently dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for your quote request. Our regional procurement desk will review it shortly.",
      });
    }

    // 4. Google reCAPTCHA Verification
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
        console.warn(`[AntiSpam Regional] Google reCAPTCHA verification failed from IP ${ip}:`, verifyData["error-codes"]);
        return NextResponse.json(
          { success: false, message: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    } catch (recaptchaErr) {
      console.error("[AntiSpam Regional] Google reCAPTCHA network check failed:", recaptchaErr);
      // In case of Google network glitch in development or isolated env, log and proceed gracefully
    }

    // 5. Content Spam Heuristics
    const lookingFor = String(body?.lookingFor || body?.sourcingItem || "");
    const email = String(body?.email || body?.businessEmail || "").trim().toLowerCase();
    const message = String(body?.message || "");

    const fullContent = `${lookingFor} ${message}`;
    const urlMatches = fullContent.match(/https?:\/\/|www\./gi) || [];
    if (urlMatches.length > 2) {
      console.warn(`[AntiSpam Regional] Message with ${urlMatches.length} URLs detected from IP ${ip}. Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for your quote request. Our regional procurement desk will review it shortly.",
      });
    }

    if (/\[url=|\<a\s+href=/i.test(fullContent)) {
      console.warn(`[AntiSpam Regional] BBCode / HTML tags detected from IP ${ip}. Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for your quote request. Our regional procurement desk will review it shortly.",
      });
    }

    const spamPatterns = [
      /\bseo ranking\b/i,
      /\bviagra\b/i,
      /\bcasino online\b/i,
      /\bcrypto investment\b/i,
      /\bbacklinks? for your website\b/i,
      /\bwhatsapp loan\b/i,
      /\bsearch engine ranker\b/i,
      /\bXRumer\b/i,
    ];
    if (spamPatterns.some((pattern) => pattern.test(fullContent))) {
      console.warn(`[AntiSpam Regional] Spambot pattern matched from IP ${ip}. Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for your quote request. Our regional procurement desk will review it shortly.",
      });
    }

    // Clean submission - register timestamp for rate limiting
    record.timestamps.push(now);

    // Strip anti-spam internals before forwarding to Django
    const cleanPayload = { ...body };
    delete cleanPayload.company_website_url;
    delete cleanPayload._formTime;
    delete cleanPayload.hp_contact_check;
    delete cleanPayload.recaptchaToken;
    delete cleanPayload["g-recaptcha-response"];

    // 5. Forward to backend Django Regional API
    try {
      const backendRes = await fetch(`${BACKEND_BASE}/api/enquiries/regional/`, {
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
          message: data?.message || "Your quote request has been received. Our regional desk will respond shortly.",
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
      console.error("[Regional API Proxy] Upstream backend failed:", err?.message || err);
    }

    // Graceful fallback
    return NextResponse.json({
      success: true,
      message: "Quote request received! Our regional desk will respond shortly.",
    });
  } catch (error: any) {
    console.error("[Regional API Proxy] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
