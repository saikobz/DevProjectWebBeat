import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="mx-auto max-w-md">
      <h1 className="text-3xl font-black text-white">Login</h1>
      <p className="mt-2 text-zinc-400">MVP placeholder ก่อนต่อ Supabase Auth email และ Google OAuth</p>
      <form className="mt-6 space-y-3">
        <input className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" placeholder="Email" type="email" />
        <input className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" placeholder="Password" type="password" />
        <button className="w-full rounded-full bg-lime-300 px-5 py-3 font-semibold text-zinc-950" type="button">
          Login placeholder
        </button>
      </form>
    </Card>
  );
}
