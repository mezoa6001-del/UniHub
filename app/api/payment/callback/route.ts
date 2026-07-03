import { NextRequest, NextResponse } from "next/server";

// This route forwards the Paymob webhook to the Cloud Function
// `paymobCallback`, which performs HMAC verification and activates
// the subscription. Configure this URL in your Paymob dashboard,
// OR point Paymob directly at the Cloud Function URL and skip this proxy:
//
//   https://{region}-{project}.cloudfunctions.net/paymobCallback

const FUNCTIONS_REGION = process.env.FIREBASE_FUNCTIONS_REGION ?? "europe-west1";
const PROJECT_ID       = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fnUrl = `https://${FUNCTIONS_REGION}-${PROJECT_ID}.cloudfunctions.net/paymobCallback`;

    const res = await fetch(fnUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
