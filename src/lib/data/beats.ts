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
    coverUrl: row.cover_url ?? undefined,
    isFeatured: row.is_featured,
    saleCount: row.sale_count,
    publishedAt: row.published_at ?? "",
    licenses
  };
}

async function getLicensesByBeatIds(beatIds: string[]) {
  const supabase = createPublicClient();
  if (!supabase || beatIds.length === 0) return new Map<string, BeatLicense[]>();

  const { data, error } = await supabase
    .from("beat_licenses")
    .select("id, beat_id, tier, price_thb, terms, is_available")
    .in("beat_id", beatIds)
    .eq("is_available", true);

  if (error || !data) return new Map<string, BeatLicense[]>();

  return (data as BeatLicenseRow[]).reduce((map, row) => {
    const current = map.get(row.beat_id) ?? [];
    map.set(row.beat_id, [...current, mapLicense(row)]);
    return map;
  }, new Map<string, BeatLicense[]>());
}

export async function getPublishedBeats() {
  const supabase = createPublicClient();
  if (!supabase) {
    return mockBeats.filter((beat) => beat.status === "published");
  }

  const { data, error } = await supabase
    .from("beats")
    .select(
      "id, slug, title, description, bpm, key, genre, mood, tags, duration_sec, preview_url, wav_path, stems_path, waveform_data, status, cover_url, is_featured, sale_count, published_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) {
    return mockBeats.filter((beat) => beat.status === "published");
  }

  const rows = data as BeatRow[];
  const licensesByBeatId = await getLicensesByBeatIds(rows.map((row) => row.id));
  return rows.map((row) => mapBeat(row, licensesByBeatId.get(row.id) ?? []));
}

export async function getBeatBySlug(slug: string) {
  const supabase = createPublicClient();
  if (!supabase) return mockBeats.find((beat) => beat.slug === slug);

  const { data, error } = await supabase
    .from("beats")
    .select(
      "id, slug, title, description, bpm, key, genre, mood, tags, duration_sec, preview_url, wav_path, stems_path, waveform_data, status, cover_url, is_featured, sale_count, published_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return mockBeats.find((beat) => beat.slug === slug);

  const row = data as BeatRow;
  const licensesByBeatId = await getLicensesByBeatIds([row.id]);
  return mapBeat(row, licensesByBeatId.get(row.id) ?? []);
}

export async function getBeatById(id: string) {
  const beats = await getPublishedBeats();
  return beats.find((beat) => beat.id === id);
}
