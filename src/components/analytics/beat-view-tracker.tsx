"use client";

import { useEffect } from "react";
import type { Beat } from "@/types";
import { trackBeatView } from "@/lib/analytics/gtag";

type BeatViewTrackerProps = {
  beat: Beat;
};

export function BeatViewTracker({ beat }: BeatViewTrackerProps) {
  useEffect(() => {
    trackBeatView(beat);
  }, [beat]);

  return null;
}
