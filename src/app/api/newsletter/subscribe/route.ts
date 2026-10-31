import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dev.surplusmarket.com"
).replace(/\/$/, "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const source = String(body?.source || "Footer Newsletter").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // 1. Try dedicated /api/newsletter/subscribe/ endpoint first
    try {
      const res = await fetch(`${BACKEND_BASE}/api/newsletter/subscribe/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          success: true,
          message: data?.message || "Successfully subscribed to the Surplus Market newsletter!",
          already_subscribed: Boolean(data?.already_subscribed),
        });
      }
    } catch {
      // Fall through to contact-us enquiry endpoint fallback
    }

    // 2. Fallback to /api/enquiries/contact-us/ on live backend so subscription + confirmation email work immediately
    const fallbackName =
      email
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) || "Newsletter Subscriber";

    const fallbackRes = await fetch(`${BACKEND_BASE}/api/enquiries/contact-us/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        fullName: fallbackName,
        email,
        phone: "",
        enquiryType: "Newsletter Subscription",
        message: `Subscribed to Surplus Market Newsletter (${source}).`,
      }),
    });

    if (fallbackRes.ok) {
      return NextResponse.json({
        success: true,
        message: "Successfully subscribed to the Surplus Market newsletter!",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to the Surplus Market newsletter!",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to process subscription right now. Please try again." },
      { status: 500 }
    );
  }
}

