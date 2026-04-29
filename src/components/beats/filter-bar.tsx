"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { GENRES } from "@/lib/constants";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const genreFromUrl = searchParams.get("genre") ?? undefined;
  const qFromUrl = searchParams.get("q") ?? "";
  const [qInput, setQInput] = useState(qFromUrl);

  function buildFilterHref(genre?: string) {
    const params = new URLSearchParams();
    const trimmed = qInput.trim();
    if (trimmed) params.set("q", trimmed);
    if (genre) params.set("genre", genre);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmed = qInput.trim();
    if (trimmed) params.set("q", trimmed);
    if (genreFromUrl) params.set("genre", genreFromUrl);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form className="flex flex-1 flex-col gap-2 sm:flex-row" role="search" aria-label="ค้นหาบีท" onSubmit={applySearch}>
          <label className="sr-only" htmlFor="beat-search">
            ค้นหาชื่อบีท แนวเพลง mood หรือ tag
          </label>
          <input
            id="beat-search"
            name="q"
            value={qInput}
            onChange={(event) => setQInput(event.target.value)}
            placeholder="ค้นหาชื่อบีท mood หรือ tag"
            className="min-h-11 w-full rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-white outline-none transition focus:border-lime-300 focus-visible:ring-2 focus-visible:ring-lime-300/60"
          />
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime-300 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            type="submit"
          >
            ค้นหา
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          <Link
            className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
              !genreFromUrl ? "bg-lime-300 font-semibold text-zinc-950" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
            }`}
            href={buildFilterHref()}
          >
            ทั้งหมด
          </Link>
          {GENRES.map((genre) => (
            <Link
              key={genre}
              className={
                genreFromUrl === genre
                  ? "inline-flex min-h-11 items-center rounded-full bg-lime-300 px-4 py-2 text-sm font-semibold text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  : "inline-flex min-h-11 items-center rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              }
              href={buildFilterHref(genre)}
            >
              {genre}
            </Link>
          ))}
        </div>
      </div>
      <p className="text-xs text-zinc-500">
        คำค้นที่พิมพ์จะถูกใช้ร่วมกับแนวเพลงที่เลือกโดยอัตโนมัติ ไม่ต้องกดค้นหาซ้ำหลังเปลี่ยนแท็บ
      </p>
    </div>
  );
}
