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
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        <audio ref={audioRef} src={currentBeat.previewUrl} onEnded={next} />
        <button className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-white" onClick={pause} type="button">
          Pause
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">{currentBeat.title}</p>
          <p className="text-xs text-zinc-400">
            {currentBeat.bpm} BPM - {currentBeat.key} - {formatDuration(currentBeat.durationSec)}
          </p>
        </div>
        <input
          className="w-24 accent-lime-300"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="Volume"
        />
        <button className="rounded-full bg-zinc-800 p-2 text-white" onClick={next} type="button" aria-label="Next beat">
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
}
