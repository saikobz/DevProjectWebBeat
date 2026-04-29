import { Card } from "@/components/ui/card";
import { getCurrentProfile, requireUser } from "@/lib/auth/session";

export default async function AccountPage() {
  await requireUser();
  const profile = await getCurrentProfile();

  return (
    <Card>
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Account</p>
      <h1 className="mt-3 text-4xl font-black text-white">Account Settings</h1>
      <div className="mt-5 space-y-2 text-zinc-300">
        <p>Email: {profile?.email ?? "-"}</p>
        <p>Display name: {profile?.displayName ?? "-"}</p>
        <p>Role: {profile?.isAdmin ? "Admin" : "Customer"}</p>
      </div>
    </Card>
  );
}
