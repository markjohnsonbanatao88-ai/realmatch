import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  getAuthenticatedSupabaseUser
} from "@/lib/supabase/server";

export const STAFF_COOKIE = "rm-staff-access-token";

export type StaffRole =
  | "administrator"
  | "reviewer"
  | "matchmaker"
  | "safety_officer"
  | "auditor";

export type StaffSession = {
  id: string;
  userId: string;
  displayName: string;
  role: StaffRole;
  accessToken: string;
};

type StaffProfile = {
  id: string;
  user_id: string;
  display_name: string;
  role: StaffRole;
  is_active: boolean;
};

function profileToSession(profile: StaffProfile, accessToken: string): StaffSession {
  return {
    id: profile.id,
    userId: profile.user_id,
    displayName: profile.display_name,
    role: profile.role,
    accessToken
  };
}

export async function getActiveStaffByUserId(userId: string) {
  const profiles = await createSupabaseAdminClient().select<StaffProfile>(
    "staff_profiles",
    `select=id,user_id,display_name,role,is_active&user_id=eq.${encodeURIComponent(userId)}&is_active=is.true&limit=1`
  );
  return profiles[0] ?? null;
}

export async function getCurrentStaff(): Promise<StaffSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(STAFF_COOKIE)?.value;
  if (!accessToken) return null;

  try {
    const user = await getAuthenticatedSupabaseUser(accessToken);
    const profiles = await createSupabaseServerClient(accessToken).select<StaffProfile>(
      "staff_profiles",
      `select=id,user_id,display_name,role,is_active&user_id=eq.${encodeURIComponent(user.id)}&is_active=is.true&limit=1`
    );
    const profile = profiles[0];
    return profile ? profileToSession(profile, accessToken) : null;
  } catch {
    return null;
  }
}

export async function requireStaffPage(roles?: StaffRole[]) {
  const staff = await getCurrentStaff();
  if (!staff || (roles && !roles.includes(staff.role))) {
    redirect("/staff/sign-in");
  }
  return staff;
}

export function canAccess(staff: StaffSession, roles: StaffRole[]) {
  return roles.includes(staff.role);
}
