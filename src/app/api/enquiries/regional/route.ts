import { NextRequest, NextResponse } from "next/server";

// Upstream Backend API target
const BACKEND_BASE = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dev.surplusmarket.com"
).replace(/\/$/, "");

// In-memory sliding window rate-limiter: max 10 requests per IP per 10 minutes
interface RateLimitRecord {
  timestamps: number[];
}
const rateLimitMap = new Map<string, RateLimitRecord>();

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
    const maxRequests = 10;

    let record = rateLimitMap.get(ip);
    if (!record) {
      record = { timestamps: [] };
      rateLimitMap.set(ip, record);
    }
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

    if (record.timestamps.length >= maxRequests) {
      console.warn(`[AntiSpam Regional] IP ${ip} exceeded rate limit. Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for your quote request. Our regional procurement desk will review it shortly.",
      });
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
      console.warn(`[AntiSpam Regional] Bot honeypot triggered from ${ip}. Dropping.`);
      return NextResponse.json({
        success: true,
        message: "Thank you for your quote request. Our regional procurement desk will review it shortly.",
      });
    }

    record.timestamps.push(now);

    // Forward to backend Django Regional API
    try {
      const backendRes = await fetch(`${BACKEND_BASE}/api/enquiries/regional/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Forwarded-For": ip,
        },
        body: JSON.stringify(body),
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
