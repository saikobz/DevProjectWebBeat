"use client";

import WaveSurfer from "wavesurfer.js";
import { useEffect, useRef, useState } from "react";
import type { Beat } from "@/types";
import { usePlayerStore } from "@/stores/player-store";

type BeatWaveformProps = {
  beat: Beat;
  queue?: Beat[];
};

/** WaveSurfer visualization synced to global persistent player (audio จริงยังเล่นจาก player bar ด้านล่าง). */
export function BeatWaveform({ beat, queue }: BeatWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [wsReady, setWsReady] = useState(false);

  const currentBeatId = usePlayerStore((s) => s.currentBeat?.id);
  const currentTimeSec = usePlayerStore((s) => s.currentTimeSec);
  const durationSec = usePlayerStore((s) => s.durationSec);
  const play = usePlayerStore((s) => s.play);
  const seekTo = usePlayerStore((s) => s.seekTo);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setWsReady(false);
    const ws = WaveSurfer.create({
      container: el,
      height: 96,
      waveColor: "#3f3f46",
      progressColor: "#bef264",
      cursorColor: "#d4d4d8",
      cursorWidth: 2,
      url: beat.previewUrl,
      interact: true,
      dragToSeek: true
    });

    ws.setVolume(0);
    ws.setMuted(true);

    const unsubReady = ws.on("ready", () => setWsReady(true));
    const unsubInteraction = ws.on("interaction", (newTime) => {
      if (usePlayerStore.getState().currentBeat?.id !== beat.id) {
        play(beat, queue);
      }
      seekTo(newTime);
    });
    wsRef.current = ws;

    return () => {
      unsubReady();
      unsubInteraction();
      ws.destroy();
      wsRef.current = null;
      setWsReady(false);
    };
  }, [beat, play, queue, seekTo]);

  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || !wsReady || currentBeatId !== beat.id) return;
    const dur = durationSec > 0 ? durationSec : ws.getDuration();
    if (!Number.isFinite(dur) || dur <= 0) return;
    ws.setTime(Math.min(Math.max(currentTimeSec, 0), dur));
  }, [beat.id, currentBeatId, currentTimeSec, durationSec, wsReady]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4" data-testid="beat-waveform">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Waveform</p>
      <div
        ref={containerRef}
        className="min-h-[96px] w-full overflow-hidden rounded-xl bg-zinc-950/50"
        aria-label="Waveform preview"
        aria-busy={!wsReady}
      />
      <p className="mt-2 text-xs text-zinc-500">
        {wsReady ? "คลิกหรือ drag ที่ waveform เพื่อ seek ได้ — แถบเล่นด้านล่างยังเป็นตัวขับเสียงจริง" : "กำลังโหลด waveform..."}
      </p>
    </div>
  );
}
