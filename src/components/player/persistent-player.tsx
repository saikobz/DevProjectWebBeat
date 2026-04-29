"use client";

import { useEffect, useRef } from "react";
import { SkipForward } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { usePlayerStore } from "@/stores/player-store";

export function PersistentPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentBeat = usePlayerStore((state) => state.currentBeat);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);
  const pause = usePlayerStore((state) => state.pause);
  const next = usePlayerStore((state) => state.next);
  const setVolume = usePlayerStore((state) => state.setVolume);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !currentBeat) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => pause());
    } else {
      audioRef.current.pause();
    }
  }, [currentBeat, isPlaying, pause]);

  if (!currentBeat) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
        <audio ref={audioRef} src={currentBeat.previewUrl} onEnded={next} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">{currentBeat.title}</p>
          <p className="text-xs text-zinc-400">
            {currentBeat.bpm} BPM - {currentBeat.key} - {formatDuration(currentBeat.durationSec)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-800 px-4 py-2 text-sm text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            onClick={pause}
            type="button"
          >
            Pause
          </button>
          <button
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-zinc-800 p-2 text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            onClick={next}
            type="button"
            aria-label="Next beat"
          >
            <SkipForward size={16} />
          </button>
        </div>
        <label className="flex w-full items-center gap-3 sm:w-auto" aria-label="Volume control">
          <span className="text-xs text-zinc-400">Volume</span>
          <input
            className="w-full accent-lime-300 sm:w-28"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label="Volume"
          />
        </label>
      </div>
    </div>
  );
}
