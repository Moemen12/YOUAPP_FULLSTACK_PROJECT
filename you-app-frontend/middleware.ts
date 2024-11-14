import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isMobile(userAgent: string) {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );
}

export function middleware(request: NextRequest) {
  // const userAgent = request.headers.get("user-agent") || "";
  // const mobile = isMobile(userAgent);
  // // Get the current path
  // const path = request.nextUrl.pathname;
  // // Define paths that should bypass mobile check
  // const bypassMobileCheck = [
  //   "/desktop",
  //   "/auth/login",
  //   "/auth/register",
  //   "/api",
  //   "/_next",
  //   "/favicon.ico",
  // ];
  // // Check if current path should bypass mobile check
  // const shouldBypassMobileCheck = bypassMobileCheck.some((route) =>
  //   path.startsWith(route)
  // );
  // // Only redirect to desktop message if:
  // // 1. It's not a mobile device
  // // 2. The path doesn't need to bypass mobile check
  // if (!mobile && !shouldBypassMobileCheck) {
  //   return NextResponse.redirect(new URL("/desktop", request.url));
  // }
  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
