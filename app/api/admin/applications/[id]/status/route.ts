import { NextResponse } from "next/server";
import { canAccess, getCurrentStaff } from "@/lib/auth/staff";
import { hasSameOrigin } from "@/lib/security/request";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses = new Set([
  "received",
  "under_review",
  "consultation_scheduled",
  "accepted",
  "declined",
  "withdrawn"
]);

export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) return NextResponse.json({ error: "Invalid application." }, { status: 400 });
  const staff = await getCurrentStaff();
  if (!staff || !canAccess(staff, ["administrator", "reviewer"])) {
    return NextResponse.json({ error: "Reviewer authorization is required." }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const status = typeof body?.status === "string" ? body.status : "";
  if (!statuses.has(status)) return NextResponse.json({ error: "Invalid application status." }, { status: 400 });

  try {
    const db = createSupabaseServerClient(staff.accessToken);
    const updated = await db.update<{ id: string }>("applications", `id=eq.${params.id}`, { status });
    if (!updated[0]) return NextResponse.json({ error: "Application not found." }, { status: 404 });

    if (status === "accepted") {
      const existing = await db.select<{ id: string }>(
        "member_profiles",
        `select=id&application_id=eq.${params.id}&limit=1`
      );
      if (!existing[0]) {
        await db.insert("member_profiles", {
          application_id: params.id,
          membership_status: "pending_verification"
        });
      }
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not update this application." }, { status: 503 });
  }
}
