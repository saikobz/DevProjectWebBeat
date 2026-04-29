import { Card } from "@/components/ui/card";
import { FreeBeatForm } from "@/components/newsletter/free-beat-form";

export default function FreeBeatPage() {
  return (
    <Card className="mx-auto max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Free Beat Funnel</p>
      <h1 className="mt-4 text-4xl font-black text-white">รับ Free Beat</h1>
      <p className="mt-3 text-zinc-400">เก็บ email เข้า Supabase newsletter เพื่อใช้ส่ง free beat และ launch updates</p>
      <FreeBeatForm />
    </Card>
  );
}
