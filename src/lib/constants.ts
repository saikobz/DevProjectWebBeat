import type { LicenseTier } from "@/types";
import { LICENSE_TIER_CONFIG } from "@/lib/license/terms";

export const GENRES = ["hiphop", "trap", "rnb", "drill"] as const;

export const LICENSE_ORDER: LicenseTier[] = ["basic", "premium", "trackout", "exclusive"];

export const LICENSE_COPY: Record<LicenseTier, { name: string; summary: string }> = LICENSE_ORDER.reduce(
  (copy, tier) => ({
    ...copy,
    [tier]: {
      name: LICENSE_TIER_CONFIG[tier].name,
      summary: LICENSE_TIER_CONFIG[tier].summary
    }
  }),
  {} as Record<LicenseTier, { name: string; summary: string }>
);
