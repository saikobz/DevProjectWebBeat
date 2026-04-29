import Image from "next/image";
import Link from "next/link";
import { formatDuration, formatTHB } from "@/lib/format";
import type { Beat } from "@/types";
import { Card } from "@/components/ui/card";
import { PlayButton } from "@/components/player/play-button";

type BeatCardProps = {
  beat: Beat;
  queue: Beat[];
};

export function BeatCard({ beat, queue }: BeatCardProps) {
  const minPrice = Math.min(...beat.licenses.map((license) => license.priceThb));

  return (
    <Card className="group overflow-hidden p-0">
      <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-zinc-800">
        {beat.coverUrl ? (
          <Image
            src={beat.coverUrl}
            alt={`Cover artwork for ${beat.title}`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute bottom-4 left-4">
          <PlayButton beat={beat} queue={queue} />
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <Link
            href={`/beats/${beat.slug}`}
            className="rounded-sm text-lg font-bold text-white transition hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
          >
            {beat.title}
          </Link>
          <p className="mt-1 text-sm text-zinc-400">
            {beat.bpm} BPM - {beat.key} - {formatDuration(beat.durationSec)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[beat.genre, ...beat.mood].map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">เริ่มที่</span>
          <span className="font-bold text-lime-300">{formatTHB(minPrice)}</span>
        </div>
      </div>
    </Card>
  );
}
