import { NextResponse } from "next/server";
import { STAFF_COOKIE, getActiveStaffByUserId } from "@/lib/auth/staff";
import { siteUrl } from "@/lib/config/site";
import { getAuthenticatedSupabaseUser, verifyStaffMagicLink } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const failure = new URL("/staff/sign-in?error=invalid-link", siteUrl);
  if (!tokenHash || type !== "email") return NextResponse.redirect(failure);

  try {
    const session = await verifyStaffMagicLink(tokenHash);
    const user = await getAuthenticatedSupabaseUser(session.access_token);
    const staff = await getActiveStaffByUserId(user.id);
    if (!staff) return NextResponse.redirect(failure);

    const response = NextResponse.redirect(new URL("/admin", siteUrl));
    response.cookies.set(STAFF_COOKIE, session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/"
    });
    return response;
  } catch {
    return NextResponse.redirect(failure);
  }
}
