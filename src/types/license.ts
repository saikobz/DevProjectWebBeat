export type LicenseTier = "basic" | "premium" | "trackout" | "exclusive";

export type LicenseTerms = {
  streamLimit: number | null;
  monetization: boolean;
  musicVideo: boolean;
  livePerformance: boolean;
  stemsIncluded: boolean;
  creditRequired: boolean;
  exclusive: boolean;
  publishingSplit: {
    licensee: number;
    producer: number;
  };
  masterRights: {
    beatMasterOwner: "producer";
    finalSongMasterOwner: "licensee";
    transferBeatMaster: boolean;
  };
  files: string[];
};

export type BeatLicense = {
  id: string;
  beatId: string;
  tier: LicenseTier;
  name: string;
  priceThb: number;
  files: string[];
  terms: LicenseTerms;
  isAvailable: boolean;
};
