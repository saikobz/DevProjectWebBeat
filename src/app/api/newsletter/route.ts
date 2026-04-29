import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; source?: string };

  if (!body.email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    subscriber: {
      email: body.email,
      source: body.source ?? "newsletter"
    }
  });
}
