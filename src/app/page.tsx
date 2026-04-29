import { getPublishedBeats } from "@/lib/data/beats";
import { BeatGrid } from "@/components/beats/beat-grid";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function HomePage() {
  const beats = await getPublishedBeats();
  const featured = beats.filter((beat) => beat.isFeatured).slice(0, 3);

  return (
    <div className="space-y-14">
      <section className="grid gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Thai Beat Marketplace</p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-white md:text-7xl">
            ซื้อบีทไทย พร้อม license ชัด จ่ายง่าย
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-300">
            MVP สำหรับ single-producer store: preview บีท เลือก license ใส่ cart และ checkout mock ก่อนต่อ PromptPay จริง
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/beats">Browse Beats</LinkButton>
            <LinkButton href="/free" variant="secondary">Free Beat Funnel</LinkButton>
          </div>
        </div>
        <Card className="bg-gradient-to-br from-lime-300/20 to-fuchsia-500/10">
          <p className="text-sm text-zinc-400">License เริ่มต้น</p>
          <p className="mt-2 text-5xl font-black text-lime-300">299-499฿</p>
          <p className="mt-4 text-zinc-300">Basic, Premium, Trackout และ Exclusive พร้อม snapshot terms สำหรับ order</p>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Featured Beats</h2>
            <p className="mt-2 text-zinc-400">อ่านจาก Supabase เมื่อมี env และ fallback เป็น demo data ระหว่างพัฒนา</p>
          </div>
          <LinkButton href="/beats" variant="ghost">View all</LinkButton>
        </div>
        <BeatGrid beats={featured} />
      </section>
    </div>
  );
}
