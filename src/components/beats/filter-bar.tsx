"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { GENRES } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "newest", label: "ใหม่สุด" },
  { value: "price-low", label: "ราคา Basic ↑" },
  { value: "price-high", label: "ราคา Basic ↓" },
  { value: "sales", label: "ขายดี" }
] as const;

const COMMON_KEYS = ["A minor", "A major", "B minor", "C minor", "D minor", "D major", "E major", "F minor", "F# minor", "G minor"] as const;

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const genreFromUrl = searchParams.get("genre") ?? undefined;
  const qFromUrl = searchParams.get("q") ?? "";
  const sortFromUrl = searchParams.get("sort") ?? "newest";
  const bpmMinFromUrl = searchParams.get("bpmMin") ?? "";
  const bpmMaxFromUrl = searchParams.get("bpmMax") ?? "";
  const keyFromUrl = searchParams.get("key") ?? "";

  const [qInput, setQInput] = useState(qFromUrl);
  const [bpmMinInput, setBpmMinInput] = useState(bpmMinFromUrl);
  const [bpmMaxInput, setBpmMaxInput] = useState(bpmMaxFromUrl);
  const [keyInput, setKeyInput] = useState(keyFromUrl);
  const hasActiveFilters = Boolean(genreFromUrl || qFromUrl || bpmMinFromUrl || bpmMaxFromUrl || keyFromUrl || sortFromUrl !== "newest");

  function mergeParams(overrides: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v === undefined || v === "") {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function commonFilters() {
    return {
      q: qInput.trim() || undefined,
      bpmMin: bpmMinInput.trim() || undefined,
      bpmMax: bpmMaxInput.trim() || undefined,
      key: keyInput.trim() || undefined,
      sort: sortFromUrl === "newest" ? undefined : sortFromUrl
    };
  }

  function buildGenreHref(genre?: string) {
    return mergeParams({
      ...commonFilters(),
      genre
    });
  }

  function sortHref(sort: string) {
    return mergeParams({
      ...commonFilters(),
      genre: genreFromUrl,
      sort: sort === "newest" ? undefined : sort
    });
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(
      mergeParams({
        genre: genreFromUrl,
        q: qInput.trim() || undefined,
        sort: sortFromUrl === "newest" ? undefined : sortFromUrl,
        bpmMin: bpmMinInput.trim() || undefined,
        bpmMax: bpmMaxInput.trim() || undefined,
        key: keyInput.trim() || undefined
      })
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4">
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
        <div className="flex flex-wrap gap-2" role="group" aria-label="เรียงลำดับ">
          {SORT_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                sortFromUrl === opt.value ? "bg-lime-300 font-semibold text-zinc-950" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
              }`}
              href={sortHref(opt.value)}
            >
              {opt.label}
            </Link>
          ))}
          {hasActiveFilters ? (
            <Link
              className="inline-flex min-h-11 items-center rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              href={pathname}
            >
              ล้างตัวกรอง
            </Link>
          ) : null}
        </div>
      </div>

      <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={applySearch}>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="bpm-min">
            BPM ต่ำสุด
          </label>
          <input
            id="bpm-min"
            inputMode="numeric"
            placeholder="เช่น 90"
            value={bpmMinInput}
            onChange={(e) => setBpmMinInput(e.target.value)}
            className="min-h-11 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-white outline-none focus:border-lime-300"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="bpm-max">
            BPM สูงสุด
          </label>
          <input
            id="bpm-max"
            inputMode="numeric"
            placeholder="เช่น 150"
            value={bpmMaxInput}
            onChange={(e) => setBpmMaxInput(e.target.value)}
            className="min-h-11 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-white outline-none focus:border-lime-300"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="key-filter">
            Key (ค้นหาบางส่วน)
          </label>
          <input
            id="key-filter"
            list="beat-key-suggestions"
            placeholder="เช่น minor, D"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="min-h-11 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-white outline-none focus:border-lime-300"
          />
          <datalist id="beat-key-suggestions">
            {COMMON_KEYS.map((key) => (
              <option key={key} value={key} />
            ))}
          </datalist>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 sm:w-auto"
          >
            ใช้ตัวกรอง BPM / Key
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
            !genreFromUrl ? "bg-lime-300 font-semibold text-zinc-950" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          }`}
          href={buildGenreHref(undefined)}
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
            href={buildGenreHref(genre)}
          >
            {genre}
          </Link>
        ))}
      </div>
      <p className="text-xs text-zinc-500">
        แท็บแนวเพลงและเรียงลำดับจะเก็บค่าค้นหา BPM และ Key จากช่องด้านบน — กด &quot;ใช้ตัวกรอง&quot; เพื่ออัปเดต BPM/Key
      </p>
    </div>
  );
}
