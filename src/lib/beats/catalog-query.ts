import type { Beat } from "@/types";

export function getBasicPriceThb(beat: Beat): number {
  const lic = beat.licenses.find((l) => l.tier === "basic");
  return lic?.priceThb ?? Number.MAX_SAFE_INTEGER;
}

export type BeatCatalogParams = {
  genre?: string;
  q?: string;
  bpmMin?: number;
  bpmMax?: number;
  key?: string;
  sort?: string;
};

/** เปรียบเทียบ key แบบยืดหยุ่น — รองรับช่องว่าง / พิมพ์ติดกัน และ `+` ใน query (เช่น C+minor → C minor) */
function compactKeySignature(key: string): string {
  return key
    .trim()
    .replace(/\+/g, " ")
    .toLowerCase()
    .replace(/\s+/g, "");
}

export function filterAndSortBeats(beats: Beat[], params: BeatCatalogParams): Beat[] {
  const query = params.q?.toLowerCase().trim();
  const keyFilter = params.key?.toLowerCase().trim();
  const keyCompact = keyFilter ? compactKeySignature(keyFilter) : "";

  let list = beats.filter((beat) => {
    const matchesGenre = params.genre ? beat.genre === params.genre : true;

    const searchable = [beat.title, beat.description, beat.genre, beat.key, ...beat.mood, ...beat.tags].join(" ").toLowerCase();
    const matchesQuery = query ? searchable.includes(query) : true;

    const matchesBpmMin = params.bpmMin !== undefined && Number.isFinite(params.bpmMin) ? beat.bpm >= params.bpmMin : true;
    const matchesBpmMax = params.bpmMax !== undefined && Number.isFinite(params.bpmMax) ? beat.bpm <= params.bpmMax : true;

    const matchesKey =
      keyCompact.length > 0 ? compactKeySignature(beat.key).includes(keyCompact) : true;

    return matchesGenre && matchesQuery && matchesBpmMin && matchesBpmMax && matchesKey;
  });

  const sort = params.sort ?? "newest";

  list = [...list].sort((a, b) => {
    if (sort === "price-low") {
      return getBasicPriceThb(a) - getBasicPriceThb(b);
    }
    if (sort === "price-high") {
      return getBasicPriceThb(b) - getBasicPriceThb(a);
    }
    if (sort === "sales") {
      return b.saleCount - a.saleCount;
    }
    const dateA = Date.parse(a.publishedAt) || 0;
    const dateB = Date.parse(b.publishedAt) || 0;
    return dateB - dateA;
  });

  return list;
}
