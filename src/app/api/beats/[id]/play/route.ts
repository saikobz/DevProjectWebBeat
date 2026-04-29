import { NextResponse } from "next/server";

type PlayRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: PlayRouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { sessionId?: string };

  return NextResponse.json({
    ok: true,
    beatId: id,
    sessionId: body.sessionId ?? "anonymous",
    message: "Mock play log accepted. Replace with Supabase insert into beat_plays."
  });
}
