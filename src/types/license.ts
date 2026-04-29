export type LicenseTier = "basic" | "premium" | "trackout" | "exclusive";

export type BeatLicense = {
  id: string;
  beatId: string;
  tier: LicenseTier;
  name: string;
  priceThb: number;
  files: string[];
  terms: {
    streamLimit: number | null;
    monetization: boolean;
    musicVideo: boolean;
    stemsIncluded: boolean;
    creditRequired: boolean;
  };
  isAvailable: boolean;
};
