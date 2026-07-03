import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/health|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|images).*)"],
};