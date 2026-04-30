import { Suspense } from "react";
import { getPublishedBeats } from "@/lib/data/beats";
import { filterAndSortBeats } from "@/lib/beats/catalog-query";
import { BeatGrid } from "@/components/beats/beat-grid";
import { FilterBar } from "@/components/beats/filter-bar";

type BeatsPageProps = {
  searchParams: Promise<{
    genre?: string;
    q?: string;
    sort?: string;
    bpmMin?: string;
    bpmMax?: string;
    key?: string;
  }>;
};

export default async function BeatsPage({ searchParams }: BeatsPageProps) {
  const params = await searchParams;
  const publishedBeats = await getPublishedBeats();

  const bpmMinParsed = params.bpmMin !== undefined && params.bpmMin !== "" ? Number(params.bpmMin) : undefined;
  const bpmMaxParsed = params.bpmMax !== undefined && params.bpmMax !== "" ? Number(params.bpmMax) : undefined;
  const bpmMin = bpmMinParsed !== undefined && Number.isFinite(bpmMinParsed) ? bpmMinParsed : undefined;
  const bpmMax = bpmMaxParsed !== undefined && Number.isFinite(bpmMaxParsed) ? bpmMaxParsed : undefined;

  const beats = filterAndSortBeats(publishedBeats, {
    genre: params.genre,
    q: params.q,
    sort: params.sort,
    bpmMin,
    bpmMax,
    key: params.key
  });

  const filterKey = `${params.q ?? ""}|${params.genre ?? ""}|${params.sort ?? ""}|${params.bpmMin ?? ""}|${params.bpmMax ?? ""}|${params.key ?? ""}`;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">ค้นบีท</p>
        <h1 className="mt-3 text-4xl font-black text-white">Beats ทั้งหมด</h1>
        <p className="mt-2 text-zinc-400">กรอง BPM, Key, แนวเพลง, เรียงตามราคา Basic tier / ยอดขาย / ใหม่สุด</p>
      </div>
      <Suspense fallback={<div className="h-32 animate-pulse rounded-3xl bg-zinc-900/60" aria-hidden />}>
        <FilterBar key={filterKey} />
      </Suspense>
      {beats.length > 0 ? <BeatGrid beats={beats} /> : <p className="rounded-3xl border border-zinc-800 p-8 text-zinc-400">ไม่พบบีทตาม filter นี้</p>}
    </div>
  );
}
