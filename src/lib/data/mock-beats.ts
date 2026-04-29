import { getLicenseTierConfig } from "@/lib/license/terms";
import type { Beat, BeatLicense, LicenseTier } from "@/types";

const previewUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

function makeLicense(beatId: string, tier: LicenseTier): BeatLicense {
  const config = getLicenseTierConfig(tier);

  return {
    id: `${beatId}-${tier}`,
    beatId,
    tier,
    name: config.name,
    priceThb: config.priceThb,
    files: config.terms.files,
    terms: config.terms,
    isAvailable: true
  };
}

function makeBeat(input: Omit<Beat, "licenses" | "previewUrl" | "wavPath" | "status" | "publishedAt">): Beat {
  return {
    ...input,
    previewUrl,
    wavPath: `private/wav/${input.slug}.wav`,
    status: "published",
    publishedAt: "2026-04-29T10:00:00.000Z",
    licenses: (["basic", "premium", "trackout", "exclusive"] as LicenseTier[]).map((tier) => makeLicense(input.id, tier))
  };
}

export const mockBeats: Beat[] = [
  makeBeat({
    id: "beat-001",
    slug: "dark-trap-140-cmin",
    title: "Midnight Trap",
    description: "บีท Trap โทนมืด 808 หนัก เหมาะกับ hook ดุดันและ verse เร็ว",
    bpm: 140,
    key: "C minor",
    genre: "trap",
    mood: ["dark", "aggressive"],
    tags: ["808", "thai rap", "club"],
    durationSec: 168,
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&auto=format&fit=crop",
    isFeatured: true,
    saleCount: 12
  }),
  makeBeat({
    id: "beat-002",
    slug: "rnb-late-night-92-amin",
    title: "Late Night Calls",
    description: "R&B นุ่ม ๆ มี electric piano และ bass อุ่นสำหรับเพลงรักกลางคืน",
    bpm: 92,
    key: "A minor",
    genre: "rnb",
    mood: ["smooth", "romantic"],
    tags: ["rnb", "slow jam", "vocal"],
    durationSec: 191,
    coverUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900&auto=format&fit=crop",
    isFeatured: true,
    saleCount: 7
  }),
  makeBeat({
    id: "beat-003",
    slug: "drill-bangkok-144-dmin",
    title: "Bangkok Drill",
    description: "Drill pattern แน่น ๆ พร้อม slide bass สำหรับแร็ปไทยสาย street",
    bpm: 144,
    key: "D minor",
    genre: "drill",
    mood: ["street", "cold"],
    tags: ["drill", "slide bass", "thai"],
    durationSec: 156,
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop",
    isFeatured: false,
    saleCount: 19
  }),
  makeBeat({
    id: "beat-004",
    slug: "boom-bap-sunset-86-fmin",
    title: "Sunset Cypher",
    description: "Boom bap / hip-hop คลาสสิก sample feel สำหรับ cypher และ storytelling",
    bpm: 86,
    key: "F minor",
    genre: "hiphop",
    mood: ["nostalgic", "warm"],
    tags: ["boom bap", "sample", "cypher"],
    durationSec: 174,
    coverUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop",
    isFeatured: false,
    saleCount: 5
  })
];

export function getPublishedBeats() {
  return mockBeats.filter((beat) => beat.status === "published");
}

export function getBeatBySlug(slug: string) {
  return mockBeats.find((beat) => beat.slug === slug);
}

export function getBeatById(id: string) {
  return mockBeats.find((beat) => beat.id === id);
}
