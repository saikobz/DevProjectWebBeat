import Link from "next/link";
import { GENRES } from "@/lib/constants";

type FilterBarProps = {
  activeGenre?: string;
  query?: string;
};

export function FilterBar({ activeGenre, query }: FilterBarProps) {
  function buildFilterHref(genre?: string) {
    const params = new URLSearchParams();
    const normalizedQuery = query?.trim();

    if (normalizedQuery) params.set("q", normalizedQuery);
    if (genre) params.set("genre", genre);

    const nextQuery = params.toString();
    return nextQuery ? `/beats?${nextQuery}` : "/beats";
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 md:flex-row md:items-center md:justify-between">
      <form className="flex flex-1 flex-col gap-2 sm:flex-row" role="search" aria-label="ค้นหาบีท">
        <label className="sr-only" htmlFor="beat-search">
          ค้นหาชื่อบีท แนวเพลง mood หรือ tag
        </label>
        <input
          id="beat-search"
          name="q"
          defaultValue={query}
          placeholder="ค้นหาชื่อบีท mood หรือ tag"
          className="min-h-11 w-full rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-white outline-none transition focus:border-lime-300 focus-visible:ring-2 focus-visible:ring-lime-300/60"
        />
        {activeGenre ? <input type="hidden" name="genre" value={activeGenre} /> : null}
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime-300 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          type="submit"
        >
          Search
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        <Link
          className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
            !activeGenre ? "bg-lime-300 font-semibold text-zinc-950" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          }`}
          href={buildFilterHref()}
        >
          All
        </Link>
        {GENRES.map((genre) => (
          <Link
            key={genre}
            className={
              activeGenre === genre
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
  );
}
