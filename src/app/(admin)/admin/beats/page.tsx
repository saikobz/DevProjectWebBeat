import { AdminBeatManager } from "@/components/admin/admin-beat-manager";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminBeatsPage() {
  await requireAdmin();
  return <AdminBeatManager />;
}
