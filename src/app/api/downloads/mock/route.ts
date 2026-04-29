import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  return NextResponse.json({
    message: "Mock download endpoint. Replace this with R2 signed URL generation.",
    beat: url.searchParams.get("beat"),
    path: url.searchParams.get("path")
  });
}
