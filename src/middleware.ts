export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/user/:path*", "/manager/:path*", "/admin/:path*", "/api/:path*"],
};

// matcher symbols
// * 0 or more
// + 1 or more
// ? 0 or 1

// import { NextRequest, NextResponse } from "next/server";
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(
//     new URL("/auth/login", "http://localhost:3000"),
//   );
// }
