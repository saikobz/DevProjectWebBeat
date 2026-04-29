import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/auth/admin-api";
import type { Beat } from "@/types";

type UpdateBeatBody = Partial<{
  title: string;
  description: string;
  bpm: number;
  key: string;
  genre: Beat["genre"];
  mood: string[];
  tags: string[];
  durationSec: number;
  previewUrl: string;
  wavPath: string;
  stemsPath: string | null;
  coverUrl: string | null;
  isFeatured: boolean;
  status: Beat["status"];
}>;

type UpdateContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: UpdateContext) {
  const { serviceRole, error } = await getAdminApiContext();
  if (error) return error;

  if (!serviceRole) {
    return NextResponse.json({ error: "Supabase service role is not configured" }, { status: 503 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as UpdateBeatBody;
  const update: Record<string, unknown> = {};

  if (body.title !== undefined) update.title = body.title;
  if (body.description !== undefined) update.description = body.description;
  if (body.bpm !== undefined) update.bpm = body.bpm;
  if (body.key !== undefined) update.key = body.key;
  if (body.genre !== undefined) update.genre = body.genre;
  if (body.mood !== undefined) update.mood = body.mood;
  if (body.tags !== undefined) update.tags = body.tags;
  if (body.durationSec !== undefined) update.duration_sec = body.durationSec;
  if (body.previewUrl !== undefined) update.preview_url = body.previewUrl;
  if (body.wavPath !== undefined) update.wav_path = body.wavPath;
  if (body.stemsPath !== undefined) update.stems_path = body.stemsPath;
  if (body.coverUrl !== undefined) update.cover_url = body.coverUrl;
  if (body.isFeatured !== undefined) update.is_featured = body.isFeatured;
  if (body.status !== undefined) {
    update.status = body.status;
    update.published_at = body.status === "published" ? new Date().toISOString() : null;
  }

  const { data, error: dbError } = await serviceRole.from("beats").update(update).eq("id", id).select("id").single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, beat: data });
}
