import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/auth/admin-api";
import { getLicenseTierConfig } from "@/lib/license/terms";
import { mockBeats } from "@/lib/data/mock-beats";
import type { Beat, LicenseTier } from "@/types";

type CreateBeatBody = {
  slug?: string;
  title?: string;
  description?: string;
  bpm?: number;
  key?: string;
  genre?: Beat["genre"];
  mood?: string[];
  tags?: string[];
  durationSec?: number;
  previewUrl?: string;
  wavPath?: string;
  stemsPath?: string;
  coverUrl?: string;
  isFeatured?: boolean;
  status?: Beat["status"];
};

const licenseTiers: LicenseTier[] = ["basic", "premium", "trackout", "exclusive"];

export async function GET() {
  const { serviceRole, error } = await getAdminApiContext();
  if (error) return error;

  if (!serviceRole) {
    return NextResponse.json({ beats: mockBeats });
  }

  const { data, error: dbError } = await serviceRole
    .from("beats")
    .select("id, slug, title, description, bpm, key, genre, mood, tags, duration_sec, preview_url, wav_path, stems_path, status, cover_url, is_featured, sale_count, published_at")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ beats: data ?? [] });
}

export async function POST(request: Request) {
  const { serviceRole, error } = await getAdminApiContext();
  if (error) return error;

  if (!serviceRole) {
    return NextResponse.json({ error: "Supabase service role is not configured" }, { status: 503 });
  }

  const body = (await request.json()) as CreateBeatBody;

  if (!body.slug || !body.title || !body.bpm || !body.key || !body.genre || !body.previewUrl || !body.wavPath) {
    return NextResponse.json({ error: "slug, title, bpm, key, genre, previewUrl and wavPath are required" }, { status: 400 });
  }

  const { data: beat, error: beatError } = await serviceRole
    .from("beats")
    .insert({
      slug: body.slug,
      title: body.title,
      description: body.description ?? "",
      bpm: body.bpm,
      key: body.key,
      genre: body.genre,
      mood: body.mood ?? [],
      tags: body.tags ?? [],
      duration_sec: body.durationSec ?? 0,
      preview_url: body.previewUrl,
      wav_path: body.wavPath,
      stems_path: body.stemsPath ?? null,
      status: body.status ?? "draft",
      cover_url: body.coverUrl ?? null,
      is_featured: body.isFeatured ?? false,
      published_at: body.status === "published" ? new Date().toISOString() : null
    })
    .select("id")
    .single();

  if (beatError || !beat) {
    return NextResponse.json({ error: beatError?.message ?? "Could not create beat" }, { status: 500 });
  }

  await serviceRole.from("beat_licenses").insert(
    licenseTiers.map((tier) => {
      const config = getLicenseTierConfig(tier);
      return {
        beat_id: beat.id,
        tier,
        price_thb: config.priceThb,
        terms: config.terms,
        is_available: true
      };
    })
  );

  return NextResponse.json({ ok: true, beat });
}
