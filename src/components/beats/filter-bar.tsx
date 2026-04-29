import Link from "next/link";
import { GENRES } from "@/lib/constants";

type FilterBarProps = {
  activeGenre?: string;
  query?: string;
};

export function FilterBar({ activeGenre, query }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 md:flex-row md:items-center md:justify-between">
      <form className="flex flex-1 gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="ค้นหาชื่อบีท mood หรือ tag"
          className="w-full rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-white outline-none focus:border-lime-300"
        />
        {activeGenre ? <input type="hidden" name="genre" value={activeGenre} /> : null}
        <button className="rounded-full bg-lime-300 px-5 py-2 text-sm font-semibold text-zinc-950" type="submit">
          Search
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        <Link className="rounded-full bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200" href="/beats">
          All
        </Link>
        {GENRES.map((genre) => (
          <Link
            key={genre}
            className={activeGenre === genre ? "rounded-full bg-lime-300 px-3 py-1.5 text-sm font-semibold text-zinc-950" : "rounded-full bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200"}
            href={`/beats?genre=${genre}`}
          >
            {genre}
          </Link>
        ))}
      </div>
    </div>
  );
}
