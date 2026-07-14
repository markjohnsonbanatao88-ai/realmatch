import { NextResponse, type NextRequest } from "next/server";

const STAFF_COOKIE = "rm-staff-access-token";

/**
 * Fast outer gate only. Every admin page and mutation also validates the
 * Supabase user and staff role server-side; this must never be the sole gate.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin") &&
      !request.cookies.has(STAFF_COOKIE)) {
    const signIn = new URL("/staff/sign-in", request.url);
    return NextResponse.redirect(signIn);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
