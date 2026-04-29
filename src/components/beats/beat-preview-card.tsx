"use client";

import { PlayButton } from "@/components/player/play-button";
import { Card } from "@/components/ui/card";
import { usePlayerStore } from "@/stores/player-store";
import { formatDuration } from "@/lib/format";
import type { Beat } from "@/types";

type BeatPreviewCardProps = {
  beat: Beat;
  queue: Beat[];
};

export function BeatPreviewCard({ beat, queue }: BeatPreviewCardProps) {
  const currentBeat = usePlayerStore((state) => state.currentBeat);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const currentTimeSec = usePlayerStore((state) => state.currentTimeSec);
  const durationSec = usePlayerStore((state) => state.durationSec);
  const isThisTrack = currentBeat?.id === beat.id;
  const hasProgress = isThisTrack && isPlaying && durationSec > 0;
  const progressPct = hasProgress ? Math.min(100, (currentTimeSec / durationSec) * 100) : 0;

  return (
    <Card>
      <div className="flex items-center gap-4">
        <PlayButton beat={beat} queue={queue} />
        <div>
          <p className="font-semibold text-white">ฟังตัวอย่าง</p>
          <p className="text-sm text-zinc-400">กดเล่นเพื่อฟัง preview ความยาว {formatDuration(beat.durationSec)}</p>
        </div>
      </div>
      {hasProgress ? (
        <div
          className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPct)}
          aria-label="ความคืบหน้าการฟังตัวอย่าง"
        >
          <div className="h-full rounded-full bg-lime-300 transition-[width] duration-150 ease-out" style={{ width: `${progressPct}%` }} />
        </div>
      ) : (
        <div className="mt-6 h-2 rounded-full bg-zinc-800/80" aria-hidden />
      )}
    </Card>
  );
}
