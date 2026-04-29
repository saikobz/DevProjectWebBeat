import { AdminBeatManager } from "@/components/admin/admin-beat-manager";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Admin</p>
        <h1 className="mt-3 text-4xl font-black text-white">Dashboard</h1>
        <p className="mt-2 text-zinc-400">Dashboard สำหรับจัดการ catalog และยอดขายจาก Supabase</p>
      </div>
      <AdminBeatManager />
    </div>
  );
}
