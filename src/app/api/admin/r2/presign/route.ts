import { NextResponse } from "next/server";
import { z } from "zod";
import { createPresignedPutForBeatUpload, isAllowedBeatUploadContentType } from "@/lib/r2/signed-url";
import type { BeatUploadScope } from "@/lib/r2/signed-url";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  scope: z.enum(["preview", "wav", "stems"]),
  fileName: z.string().min(1).max(220),
  contentType: z.string().min(3).max(120)
});

export async function POST(request: Request) {
  const serverClient = await createClient();
  if (!serverClient) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const {
    data: { user }
  } = await serverClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await serverClient.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const { scope, fileName, contentType } = parsed.data;

  if (!isAllowedBeatUploadContentType(scope as BeatUploadScope, contentType)) {
    return NextResponse.json({ error: `Content type not allowed for scope ${scope}` }, { status: 400 });
  }

  const result = await createPresignedPutForBeatUpload(scope as BeatUploadScope, fileName, contentType);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  return NextResponse.json({
    putUrl: result.putUrl,
    key: result.key,
    publicUrl: result.publicUrl ?? null
  });
}
