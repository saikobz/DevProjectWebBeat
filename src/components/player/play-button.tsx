"use client";

import { Pause, Play } from "lucide-react";
import type { Beat } from "@/types";
import { usePlayerStore } from "@/stores/player-store";

type PlayButtonProps = {
  beat: Beat;
  queue?: Beat[];
};

export function PlayButton({ beat, queue }: PlayButtonProps) {
  const currentBeat = usePlayerStore((state) => state.currentBeat);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);
  const active = currentBeat?.id === beat.id && isPlaying;

  return (
    <button
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-lime-300 text-zinc-950 transition hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      onClick={() => (active ? pause() : play(beat, queue))}
      aria-label={active ? "Pause beat preview" : "Play beat preview"}
      type="button"
    >
      {active ? <Pause size={18} /> : <Play size={18} />}
    </button>
  );
}
