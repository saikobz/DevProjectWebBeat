import { getPublishedBeats } from "@/lib/data/mock-beats";
import { BeatGrid } from "@/components/beats/beat-grid";
import { FilterBar } from "@/components/beats/filter-bar";

type BeatsPageProps = {
  searchParams: Promise<{
    genre?: string;
    q?: string;
  }>;
};

export default async function BeatsPage({ searchParams }: BeatsPageProps) {
  const params = await searchParams;
  const query = params.q?.toLowerCase().trim();
  const beats = getPublishedBeats().filter((beat) => {
    const matchesGenre = params.genre ? beat.genre === params.genre : true;
    const searchable = [beat.title, beat.description, beat.genre, ...beat.mood, ...beat.tags].join(" ").toLowerCase();
    const matchesQuery = query ? searchable.includes(query) : true;
    return matchesGenre && matchesQuery;
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">Browse</p>
        <h1 className="mt-3 text-4xl font-black text-white">Beats ทั้งหมด</h1>
        <p className="mt-2 text-zinc-400">Filter พื้นฐานสำหรับ MVP ก่อนเพิ่ม BPM slider, price และ mood filter แบบละเอียด</p>
      </div>
      <FilterBar activeGenre={params.genre} query={params.q} />
      {beats.length > 0 ? <BeatGrid beats={beats} /> : <p className="rounded-3xl border border-zinc-800 p-8 text-zinc-400">ไม่พบบีทตาม filter นี้</p>}
    </div>
  );
}
