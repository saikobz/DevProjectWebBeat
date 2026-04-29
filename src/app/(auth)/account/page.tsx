import { Card } from "@/components/ui/card";

export default function AccountPage() {
  return (
    <Card>
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Account</p>
      <h1 className="mt-3 text-4xl font-black text-white">Account Settings</h1>
      <p className="mt-3 text-zinc-400">Supabase Auth profile settings จะต่อในรอบ integration หลัง MVP flow ใช้งานได้</p>
    </Card>
  );
}
