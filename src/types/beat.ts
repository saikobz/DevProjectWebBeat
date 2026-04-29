import type { BeatLicense } from "./license";

export type BeatStatus = "draft" | "published" | "sold_exclusive";

export type Beat = {
  id: string;
  slug: string;
  title: string;
  description: string;
  bpm: number;
  key: string;
  genre: "hiphop" | "trap" | "rnb" | "drill";
  mood: string[];
  tags: string[];
  durationSec: number;
  previewUrl: string;
  wavPath: string;
  stemsPath?: string;
  waveformData?: number[];
  status: BeatStatus;
  coverUrl?: string;
  isFeatured: boolean;
  saleCount: number;
  publishedAt: string;
  licenses: BeatLicense[];
};
