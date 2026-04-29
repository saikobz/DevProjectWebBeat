import { AdminBeatManager } from "@/components/admin/admin-beat-manager";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Admin</p>
        <h1 className="mt-3 text-4xl font-black text-white">Dashboard</h1>
        <p className="mt-2 text-zinc-400">Mock admin dashboard ก่อนต่อ RLS + `profiles.is_admin` จริง</p>
      </div>
      <AdminBeatManager />
    </div>
  );
}
