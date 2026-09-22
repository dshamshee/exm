import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require admin auth
const PUBLIC_PATHS = ["/verify", "/login", "/api"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to /verify
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/verify", request.url));
  }

  // Allow public routes
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow static assets and Next.js internals
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const session = request.cookies.get("admin_session")?.value;

  if (session !== "authenticated") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
