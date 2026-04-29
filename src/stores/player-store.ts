"use client";

import { create } from "zustand";
import type { Beat } from "@/types";

type PlayerState = {
  currentBeat: Beat | null;
  queue: Beat[];
  isPlaying: boolean;
  volume: number;
  play: (beat: Beat, queue?: Beat[]) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  next: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentBeat: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  play: (beat, queue = []) => set({ currentBeat: beat, queue, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume }),
  next: () => {
    const { currentBeat, queue } = get();
    if (!currentBeat || queue.length === 0) return;
    const currentIndex = queue.findIndex((beat) => beat.id === currentBeat.id);
    const nextBeat = queue[(currentIndex + 1) % queue.length];
    set({ currentBeat: nextBeat, isPlaying: true });
  }
}));
