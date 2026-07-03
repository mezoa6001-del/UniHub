import { NextRequest, NextResponse } from "next/server";

const FUNCTIONS_REGION = process.env.FIREBASE_FUNCTIONS_REGION ?? "europe-west1";
const PROJECT_ID       = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    const sessionCookie = req.cookies.get("__session")?.value;
    if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const fnUrl = `https://${FUNCTIONS_REGION}-${PROJECT_ID}.cloudfunctions.net/verifyPayment`;
    const res = await fetch(fnUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${sessionCookie}` },
      body:    JSON.stringify({ data: { orderId } }),
    });
    const data = await res.json();
    return NextResponse.json(data.result ?? data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
