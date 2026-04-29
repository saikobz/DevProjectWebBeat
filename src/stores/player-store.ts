"use client";

import { create } from "zustand";
import type { Beat } from "@/types";

type PlayerState = {
  currentBeat: Beat | null;
  queue: Beat[];
  isPlaying: boolean;
  volume: number;
  currentTimeSec: number;
  durationSec: number;
  play: (beat: Beat, queue?: Beat[]) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  setPlaybackProgress: (currentTimeSec: number, durationSec: number) => void;
  next: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentBeat: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  currentTimeSec: 0,
  durationSec: 0,
  play: (beat, queue = []) =>
    set((state) => {
      const sameBeat = state.currentBeat?.id === beat.id;
      if (sameBeat) {
        return {
          queue: queue.length > 0 ? queue : state.queue,
          isPlaying: true
        };
      }
      return { currentBeat: beat, queue, isPlaying: true, currentTimeSec: 0, durationSec: 0 };
    }),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume }),
  setPlaybackProgress: (currentTimeSec, durationSec) => set({ currentTimeSec, durationSec }),
  next: () => {
    const { currentBeat, queue } = get();
    if (!currentBeat || queue.length === 0) return;
    const currentIndex = queue.findIndex((beat) => beat.id === currentBeat.id);
    const nextBeat = queue[(currentIndex + 1) % queue.length];
    set({ currentBeat: nextBeat, isPlaying: true });
  }
}));
