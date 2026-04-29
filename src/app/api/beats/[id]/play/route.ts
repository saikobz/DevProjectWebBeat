import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type PlayRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: PlayRouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { sessionId?: string };
  const sessionId = body.sessionId ?? "anonymous";
  const supabase = createServiceRoleClient();

  if (supabase) {
    await supabase.from("beat_plays").insert({
      beat_id: id,
      session_id: sessionId
    });
  }

  return NextResponse.json({
    ok: true,
    beatId: id,
    sessionId,
    mode: supabase ? "database" : "mock"
  });
}
