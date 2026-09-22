import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require admin authentication
const ADMIN_PATHS = ["/candidate", "/exam", "/hall-ticket", "/admin-testing"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to /verify
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/verify", request.url));
  }

  // Allow static assets, images, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if route requires admin auth
  const isAdminRoute = ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (isAdminRoute) {
    const session = request.cookies.get("admin_session")?.value;
    if (session !== "authenticated") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
