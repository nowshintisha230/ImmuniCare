import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/ai-assistant", "/children"];

export function proxy(req: NextRequest) {
  const hasSession = req.cookies.has("session");
  const { pathname } = req.nextUrl;

  if (PROTECTED.some((p) => pathname.startsWith(p)) && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if ((pathname === "/login" || pathname === "/register") && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ai-assistant/:path*",
    "/children/:path*",
    "/login",
    "/register",
  ],
};