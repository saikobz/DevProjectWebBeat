import { unstable_cache } from "next/cache";
import { resolveBeatCoverUrl } from "@/lib/data/beat-cover";
import { mockBeats } from "@/lib/data/mock-beats";
import { getLicenseTierConfig } from "@/lib/license/terms";
import { createPublicClient } from "@/lib/supabase/public";
import type { Beat, BeatLicense, BeatStatus, LicenseTerms, LicenseTier } from "@/types";

type BeatRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  bpm: number;
  key: string;
  genre: Beat["genre"];
  mood: string[] | null;
  tags: string[] | null;
  duration_sec: number;
  preview_url: string;
  wav_path: string;
  stems_path: string | null;
  waveform_data: number[] | null;
  status: BeatStatus;
  cover_url: string | null;
  is_featured: boolean;
  sale_count: number;
  published_at: string | null;
};

type BeatLicenseRow = {
  id: string;
  beat_id: string;
  tier: LicenseTier;
  price_thb: number;
  terms: LicenseTerms | null;
  is_available: boolean;
};

type BeatRowWithLicenses = BeatRow & {
  beat_licenses: BeatLicenseRow[] | null;
};

function mapLicense(row: BeatLicenseRow): BeatLicense {
  const config = getLicenseTierConfig(row.tier);
  const terms = row.terms ?? config.terms;

  return {
    id: row.id,
    beatId: row.beat_id,
    tier: row.tier,
    name: config.name,
    priceThb: row.price_thb,
    files: terms.files ?? config.terms.files,
    terms,
    isAvailable: row.is_available
  };
}

function mapBeatRowWithLicenses(row: BeatRowWithLicenses): Beat {
  const { beat_licenses: licRows, ...beatRow } = row;
  const licenses = (licRows ?? []).map(mapLicense);
  return mapBeat(beatRow as BeatRow, licenses);
}

function mapBeat(row: BeatRow, licenses: BeatLicense[]): Beat {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    bpm: row.bpm,
    key: row.key,
    genre: row.genre,
    mood: row.mood ?? [],
    tags: row.tags ?? [],
    durationSec: row.duration_sec,
    previewUrl: row.preview_url,
    wavPath: row.wav_path,
    stemsPath: row.stems_path ?? undefined,
    waveformData: row.waveform_data ?? undefined,
    status: row.status,
    coverUrl: resolveBeatCoverUrl(row.cover_url, row.slug),
    isFeatured: row.is_featured,
    saleCount: row.sale_count,
    publishedAt: row.published_at ?? "",
    licenses
  };
}

const publishedBeatsSelect = [
  "id, slug, title, description, bpm, key, genre, mood, tags, duration_sec, preview_url, wav_path, stems_path, waveform_data, status, cover_url, is_featured, sale_count, published_at",
  "beat_licenses(id, beat_id, tier, price_thb, terms, is_available)"
].join(",");

function publishedMockBeats(): Beat[] {
  return mockBeats.filter((beat) => beat.status === "published");
}

/** PostgREST / Supabase: โปรเจกต์ยังไม่รัน schema หรือตารางยังไม่อยู่ใน schema cache — ไม่ควร throw ผ่าน unstable_cache (จะทำให้ Next log stack ซ้ำ) */
function isMissingBeatsRelationError(error: { message?: string; code?: string } | null | undefined): boolean {
  if (!error?.message && !error?.code) return false;
  const msg = error.message ?? "";
  if (error.code === "PGRST205") return true;
  return msg.includes("Could not find the table") && msg.includes("beats");
}

async function fetchPublishedBeatsDbCachedPayload(): Promise<Beat[]> {
  const supabase = createPublicClient();
  if (!supabase) throw new Error("missing supabase");

  const { data, error } = await supabase
    .from("beats")
    .select(publishedBeatsSelect)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) {
    if (isMissingBeatsRelationError(error)) {
      return publishedMockBeats();
    }
    throw new Error(error?.message ?? "beats fetch failed");
  }

  const rows = data as unknown as BeatRowWithLicenses[];
  return rows.map(mapBeatRowWithLicenses);
}

const getCachedPublishedBeatsDb = unstable_cache(fetchPublishedBeatsDbCachedPayload, ["published-beats-with-licenses"], {
  revalidate: 60
});

export async function getPublishedBeats() {
  const supabase = createPublicClient();
  if (!supabase) {
    return publishedMockBeats();
  }

  try {
    return await getCachedPublishedBeatsDb();
  } catch {
    return publishedMockBeats();
  }
}

export async function getBeatBySlug(slug: string) {
  const supabase = createPublicClient();
  if (!supabase) return mockBeats.find((beat) => beat.slug === slug);

  const { data, error } = await supabase
    .from("beats")
    .select(publishedBeatsSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return mockBeats.find((beat) => beat.slug === slug);

  return mapBeatRowWithLicenses(data as unknown as BeatRowWithLicenses);
}

export async function getBeatById(id: string) {
  const beats = await getPublishedBeats();
  return beats.find((beat) => beat.id === id);
}
