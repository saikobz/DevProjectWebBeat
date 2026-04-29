import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FreeBeatPage() {
  return (
    <Card className="mx-auto max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Free Beat Funnel</p>
      <h1 className="mt-4 text-4xl font-black text-white">รับ Free Beat</h1>
      <p className="mt-3 text-zinc-400">MVP placeholder สำหรับเก็บ email ก่อนต่อ newsletter + Resend จริง</p>
      <form className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-lime-300"
        />
        <Button>Send download link</Button>
      </form>
    </Card>
  );
}
