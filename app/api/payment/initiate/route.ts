import { NextRequest, NextResponse } from "next/server";

// This route proxies to the Firebase Cloud Function `initiatePayment`.
// In production, prefer calling the callable function directly from the
// client with the Firebase SDK. This REST proxy exists for environments
// where you want a same-origin API route instead.

const FUNCTIONS_REGION = process.env.FIREBASE_FUNCTIONS_REGION ?? "europe-west1";
const PROJECT_ID       = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export async function POST(req: NextRequest) {
  try {
    const { planId, paymentMethod } = await req.json();
    const sessionCookie = req.cookies.get("__session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!planId || !paymentMethod) {
      return NextResponse.json({ error: "Missing planId or paymentMethod" }, { status: 400 });
    }

    const fnUrl = `https://${FUNCTIONS_REGION}-${PROJECT_ID}.cloudfunctions.net/initiatePayment`;

    const res = await fetch(fnUrl, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${sessionCookie}`,
      },
      body: JSON.stringify({ data: { planId, paymentMethod } }),
    });

    const data = await res.json();
    return NextResponse.json(data.result ?? data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Payment initiation failed" }, { status: 500 });
  }
}
