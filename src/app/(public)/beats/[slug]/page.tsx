import { notFound } from "next/navigation";
import { getBeatBySlug, getPublishedBeats } from "@/lib/data/beats";
import { formatDuration } from "@/lib/format";
import { BeatGrid } from "@/components/beats/beat-grid";
import { PlayButton } from "@/components/player/play-button";
import { LicenseSelector } from "@/components/license/license-selector";
import { Card } from "@/components/ui/card";

type BeatDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const beats = await getPublishedBeats();
  return beats.map((beat) => ({ slug: beat.slug }));
}

export async function generateMetadata({ params }: BeatDetailPageProps) {
  const { slug } = await params;
  const beat = await getBeatBySlug(slug);
  return {
    title: beat ? `${beat.title} - WebBeatTH` : "Beat not found"
  };
}

export default async function BeatDetailPage({ params }: BeatDetailPageProps) {
  const { slug } = await params;
  const beat = await getBeatBySlug(slug);

  if (!beat) notFound();

  const publishedBeats = await getPublishedBeats();
  const related = publishedBeats
    .filter((item) => item.id !== beat.id && item.genre === beat.genre)
    .slice(0, 3);

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">{beat.genre}</p>
            <h1 className="mt-3 text-5xl font-black text-white">{beat.title}</h1>
            <p className="mt-4 max-w-2xl text-zinc-300">{beat.description}</p>
          </div>
          <Card>
            <div className="flex items-center gap-4">
              <PlayButton beat={beat} queue={publishedBeats} />
              <div>
                <p className="font-semibold text-white">Preview Player</p>
                <p className="text-sm text-zinc-400">Waveform placeholder ก่อนต่อ wavesurfer peaks จริง</p>
              </div>
            </div>
            <div className="mt-6 h-24 rounded-2xl bg-[linear-gradient(90deg,#bef264_10%,#3f3f46_10%,#3f3f46_20%,#bef264_20%,#bef264_35%,#3f3f46_35%,#3f3f46_50%,#bef264_50%,#bef264_65%,#3f3f46_65%,#3f3f46_80%,#bef264_80%)] opacity-70" />
          </Card>
          <div className="grid gap-3 sm:grid-cols-4">
            <Card><p className="text-sm text-zinc-500">BPM</p><p className="mt-1 font-bold text-white">{beat.bpm}</p></Card>
            <Card><p className="text-sm text-zinc-500">Key</p><p className="mt-1 font-bold text-white">{beat.key}</p></Card>
            <Card><p className="text-sm text-zinc-500">Length</p><p className="mt-1 font-bold text-white">{formatDuration(beat.durationSec)}</p></Card>
            <Card><p className="text-sm text-zinc-500">Sales</p><p className="mt-1 font-bold text-white">{beat.saleCount}</p></Card>
          </div>
        </div>
        <Card className="h-fit">
          <h2 className="text-2xl font-black text-white">เลือก License</h2>
          <p className="mt-2 text-sm text-zinc-400">ราคาตาม tier จาก PRD พร้อม terms snapshot ใน order ภายหลัง</p>
          <div className="mt-6">
            <LicenseSelector beat={beat} />
          </div>
        </Card>
      </section>
      {related.length > 0 ? (
        <section className="space-y-5">
          <h2 className="text-3xl font-black text-white">Related Beats</h2>
          <BeatGrid beats={related} />
        </section>
      ) : null}
    </div>
  );
}
