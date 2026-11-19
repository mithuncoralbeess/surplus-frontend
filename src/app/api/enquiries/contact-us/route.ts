import { NextRequest, NextResponse } from "next/server";

// Upstream Backend API target
const BACKEND_BASE = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dev.surplusmarket.com"
).replace(/\/$/, "");

// In-memory sliding window rate-limiter: max 5 requests per IP per 10 minutes
interface RateLimitRecord {
  timestamps: number[];
}
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit records every 15 minutes to prevent memory leaks
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
    const windowMs = 10 * 60 * 1000; // 10 minutes
    const maxRequests = 5;

    // 1. IP Sliding Window Rate Limiting
    let record = rateLimitMap.get(ip);
    if (!record) {
      record = { timestamps: [] };
      rateLimitMap.set(ip, record);
    }
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

    if (record.timestamps.length >= maxRequests) {
      console.warn(`[AntiSpam RateLimit] IP ${ip} exceeded ${maxRequests} submissions/10min. Silently dropping.`);
      // Return 200 silent ghosting so spam bots do not adapt or cycle IPs
      return NextResponse.json({
        success: true,
        message: "Thank you for contacting Surplus Market. Our operations team will review your enquiry shortly.",
      });
    }

    const body = await req.json().catch(() => ({}));

    // 2. Honeypot Field Check (Filled exclusively by automated bots, invisible to humans)
    const honeypotVal = String(
      body?.company_website_url || 
      body?.hp_contact_check || 
      body?.website || 
      body?.fax_number || 
      ""
    ).trim();

    if (honeypotVal) {
      console.warn(`[AntiSpam Honeypot] Bot submission intercepted from IP ${ip}. Filled honeypot: "${honeypotVal}". Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for contacting Surplus Market. Our operations team will review your enquiry shortly.",
      });
    }

    // 3. Form Submission Timing Check (bots submit instantly < 2000ms)
    const formTime = Number(body?._formTime || 0);
    if (formTime > 0 && now - formTime < 2000) {
      console.warn(`[AntiSpam Timing] Instant submission intercepted from IP ${ip} (${now - formTime}ms). Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for contacting Surplus Market. Our operations team will review your enquiry shortly.",
      });
    }

    // 4. Content Spam Heuristics
    const message = String(body?.message || "");
    const email = String(body?.email || "").trim().toLowerCase();
    const fullName = String(body?.fullName || body?.name || "").trim();
    const phone = String(body?.phone || "").trim();
    const enquiryType = String(body?.enquiryType || body?.subject || "General Enquiry").trim();

    // Check a: Excessive external URLs in message (> 2 links)
    const urlMatches = message.match(/https?:\/\/|www\./gi) || [];
    if (urlMatches.length > 2) {
      console.warn(`[AntiSpam Links] Message with ${urlMatches.length} URLs detected from IP ${ip}. Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for contacting Surplus Market. Our operations team will review your enquiry shortly.",
      });
    }

    // Check b: Spambot BBCode or HTML anchor tags
    if (/\[url=|\<a\s+href=/i.test(message)) {
      console.warn(`[AntiSpam BBCode] BBCode / HTML link tags detected from IP ${ip}. Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for contacting Surplus Market. Our operations team will review your enquiry shortly.",
      });
    }

    // Check c: Common spambot keywords
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
    if (spamPatterns.some((pattern) => pattern.test(message))) {
      console.warn(`[AntiSpam Keyword] Spambot pattern matched from IP ${ip}. Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for contacting Surplus Market. Our operations team will review your enquiry shortly.",
      });
    }

    // Legitimate submission: record timestamp against rate limit window
    record.timestamps.push(now);

    // 5. Clean upstream payload (strip anti-spam internals before forwarding to Django)
    const cleanPayload = {
      fullName,
      email,
      phone,
      enquiryType,
      message,
    };

    // Forward to backend API
    try {
      const backendRes = await fetch(`${BACKEND_BASE}/api/enquiries/contact-us/`, {
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
          message: data?.message || "Thank you for contacting Surplus Market! Our operations team will get in touch with you shortly.",
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
      console.error("[Contact API Proxy] Upstream backend request failed:", err?.message || err);
    }

    // Graceful fallback response if backend service is momentarily busy
    return NextResponse.json({
      success: true,
      message: "Thank you for contacting Surplus Market! Your message has been received.",
    });
  } catch (error: any) {
    console.error("[Contact API Proxy] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
