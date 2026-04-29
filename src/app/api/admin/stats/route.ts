import { NextResponse } from "next/server";
import { mockBeats } from "@/lib/data/mock-beats";

export async function GET() {
  return NextResponse.json({
    beats: mockBeats.length,
    published: mockBeats.filter((beat) => beat.status === "published").length,
    sales: mockBeats.reduce((total, beat) => total + beat.saleCount, 0)
  });
}
