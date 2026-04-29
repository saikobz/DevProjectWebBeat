import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CurrentProfile = {
  id: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
};

export async function getCurrentUser() {
  const supabase = await createClient();
  if (!supabase) {
    return { id: "mock-user", email: "dev@example.com" };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  if (!supabase) {
    return {
      id: "mock-user",
      email: "dev@example.com",
      displayName: "Development User",
      isAdmin: true
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, display_name, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: data?.email ?? user.email ?? "",
    displayName: data?.display_name ?? undefined,
    isAdmin: Boolean(data?.is_admin)
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!profile.isAdmin) redirect("/account");
  return profile;
}
