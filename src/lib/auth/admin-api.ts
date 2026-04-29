import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";

export async function getAdminApiContext() {
  const serviceRole = createServiceRoleClient();
  const serverClient = await createClient();

  if (!serviceRole || !serverClient) {
    return { serviceRole: null, error: null };
  }

  const {
    data: { user }
  } = await serverClient.auth.getUser();

  if (!user) {
    return { serviceRole: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile } = await serverClient.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();

  if (!profile?.is_admin) {
    return { serviceRole: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { serviceRole, error: null };
}
