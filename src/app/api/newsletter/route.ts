import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; source?: string };

  if (!body.email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, subscriber: { email: body.email, source: body.source ?? "newsletter" }, mode: "mock" });
  }

  const { data, error } = await supabase
    .from("email_subscribers")
    .upsert(
      {
        email: body.email,
        source: body.source ?? "newsletter",
        unsubscribed_at: null
      },
      { onConflict: "email" }
    )
    .select("email, source")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, subscriber: data });
}
