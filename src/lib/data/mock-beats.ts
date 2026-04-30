import { placeholderCoverForSlug } from "@/lib/data/beat-cover";
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
    coverUrl: placeholderCoverForSlug("dark-trap-140-cmin"),
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
    coverUrl: placeholderCoverForSlug("rnb-late-night-92-amin"),
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
    coverUrl: placeholderCoverForSlug("drill-bangkok-144-dmin"),
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
    coverUrl: placeholderCoverForSlug("boom-bap-sunset-86-fmin"),
    isFeatured: false,
    saleCount: 5
  }),
  makeBeat({
    id: "beat-005",
    slug: "phonk-afterhours-138-gmin",
    title: "Afterhours Phonk",
    description: "Phonk bell พร้อม cowbell และ Memphis vibe เหมาะทำซ้อตไทยสายเมาโซตโครติก",
    bpm: 138,
    key: "G minor",
    genre: "trap",
    mood: ["phonk", "noir"],
    tags: ["cowbell", "memphis", "phonk"],
    durationSec: 162,
    coverUrl: placeholderCoverForSlug("phonk-afterhours-138-gmin"),
    isFeatured: true,
    saleCount: 21
  }),
  makeBeat({
    id: "beat-006",
    slug: "pluggnb-clouds-150-emaj",
    title: "Skyline Pluggnb",
    description: "Pluggnb airy chords พื้นที่สำหรับเมโลดี้สายโคโยตี้และโฟลว์ลอย",
    bpm: 150,
    key: "E major",
    genre: "rnb",
    mood: ["dreamy", "sparkly"],
    tags: ["pluggnb", "melodic"],
    durationSec: 178,
    coverUrl: placeholderCoverForSlug("pluggnb-clouds-150-emaj"),
    isFeatured: false,
    saleCount: 9
  }),
  makeBeat({
    id: "beat-007",
    slug: "club-thai-pop-126-amaj",
    title: "Bangkok Flood Lights",
    description: "โปรดักชันโทนป็อปไทยผสมแทรป เบสชัดและพื้นที่ร้อง chorus",
    bpm: 126,
    key: "A major",
    genre: "hiphop",
    mood: ["bright", "club"],
    tags: ["thai pop", "club", "hook"],
    durationSec: 200,
    coverUrl: placeholderCoverForSlug("club-thai-pop-126-amaj"),
    isFeatured: false,
    saleCount: 14
  }),
  makeBeat({
    id: "beat-008",
    slug: "ghost-drill-148-fsharpmin",
    title: "Ghost Alley",
    description: "Drill เหมือนหลุดจากถนนตีบมุดใต้ไฟถนนขาวนวล",
    bpm: 148,
    key: "F# minor",
    genre: "drill",
    mood: ["sinister", "fast"],
    tags: ["ghost", "slide"],
    durationSec: 151,
    coverUrl: placeholderCoverForSlug("ghost-drill-148-fsharpmin"),
    isFeatured: false,
    saleCount: 16
  }),
  makeBeat({
    id: "beat-009",
    slug: "smoke-trap-134-bmin",
    title: "Smoke Signals",
    description: "Trap hi-hat สามชั้นพร้อม sub low ที่พุ่งชัดในลำโพงรถยนต์",
    bpm: 134,
    key: "B minor",
    genre: "trap",
    mood: ["heavy", "carti-ish"],
    tags: ["trap", "bounce"],
    durationSec: 169,
    coverUrl: placeholderCoverForSlug("smoke-trap-134-bmin"),
    isFeatured: false,
    saleCount: 28
  }),
  makeBeat({
    id: "beat-010",
    slug: "lofi-story-78-dmaj",
    title: "Notebook Tape",
    description: "Lo-fi boom bap เบา ๆ สำหรับ storytelling และโฟลว์เปิดใจ",
    bpm: 78,
    key: "D major",
    genre: "hiphop",
    mood: ["lofi", "warm"],
    tags: ["lofi", "talkbox"],
    durationSec: 205,
    coverUrl: placeholderCoverForSlug("lofi-story-78-dmaj"),
    isFeatured: false,
    saleCount: 4
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
