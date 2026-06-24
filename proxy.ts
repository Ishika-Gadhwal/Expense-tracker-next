// ============================================================
// proxy.ts - Route protection + request logging
// Applies to: /expenses, /add, /budget routes.
// Checks for a "user_session" cookie.
// Redirects to /?error=session_required if cookie is missing.
// Logs each matched request's path and timestamp.
// ============================================================

// import { NextRequest, NextResponse } from "next/server";

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   console.log(`[Proxy] ${new Date().toISOString()} - ${pathname}`);

//   const sessionCookie = request.cookies.get("user_session");

//   if (!sessionCookie) {
//     const redirectUrl = new URL("/?error=session_required", request.url);
//     return NextResponse.redirect(redirectUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/expenses/:path*", "/add/:path*", "/budget/:path*"],
// };

 
import { NextRequest, NextResponse } from "next/server";
 
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
 
  console.log(`[Proxy] ${new Date().toISOString()} - ${pathname}`);
 
  // Pure frontend — no real auth, allow all routes through
  return NextResponse.next();
}
 
export const config = {
  matcher: ["/expenses/:path*", "/add/:path*", "/budget/:path*"],
};