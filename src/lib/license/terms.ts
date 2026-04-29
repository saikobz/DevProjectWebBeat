import type { LicenseTerms, LicenseTier } from "@/types";

export type LicenseTierConfig = {
  tier: LicenseTier;
  name: string;
  priceThb: number;
  summary: string;
  terms: LicenseTerms;
};

export const LICENSE_TIER_CONFIG: Record<LicenseTier, LicenseTierConfig> = {
  basic: {
    tier: "basic",
    name: "Basic Lease",
    priceThb: 399,
    summary: "MP3 untagged สำหรับเริ่มปล่อยเพลง งบเบา ต้องให้เครดิต",
    terms: {
      streamLimit: 5000,
      monetization: false,
      musicVideo: false,
      livePerformance: true,
      stemsIncluded: false,
      creditRequired: true,
      exclusive: false,
      publishingSplit: { licensee: 50, producer: 50 },
      masterRights: {
        beatMasterOwner: "producer",
        finalSongMasterOwner: "licensee",
        transferBeatMaster: false
      },
      files: ["MP3 untagged"]
    }
  },
  premium: {
    tier: "premium",
    name: "Premium Lease",
    priceThb: 999,
    summary: "WAV + MP3 ใช้ monetize และทำ MV ได้ เหมาะกับซิงเกิลจริงจัง",
    terms: {
      streamLimit: 50000,
      monetization: true,
      musicVideo: true,
      livePerformance: true,
      stemsIncluded: false,
      creditRequired: true,
      exclusive: false,
      publishingSplit: { licensee: 50, producer: 50 },
      masterRights: {
        beatMasterOwner: "producer",
        finalSongMasterOwner: "licensee",
        transferBeatMaster: false
      },
      files: ["WAV", "MP3 untagged"]
    }
  },
  trackout: {
    tier: "trackout",
    name: "Trackout / Stems",
    priceThb: 2499,
    summary: "ได้ stems สำหรับมิกซ์เอง เหมาะกับงานคุณภาพสูง",
    terms: {
      streamLimit: 100000,
      monetization: true,
      musicVideo: true,
      livePerformance: true,
      stemsIncluded: true,
      creditRequired: true,
      exclusive: false,
      publishingSplit: { licensee: 50, producer: 50 },
      masterRights: {
        beatMasterOwner: "producer",
        finalSongMasterOwner: "licensee",
        transferBeatMaster: false
      },
      files: ["WAV", "MP3 untagged", "Stems"]
    }
  },
  exclusive: {
    tier: "exclusive",
    name: "Exclusive",
    priceThb: 12000,
    summary: "ซื้อขาด ลบจากหน้าเว็บหลังขาย และได้ไฟล์ครบ",
    terms: {
      streamLimit: null,
      monetization: true,
      musicVideo: true,
      livePerformance: true,
      stemsIncluded: true,
      creditRequired: true,
      exclusive: true,
      publishingSplit: { licensee: 50, producer: 50 },
      masterRights: {
        beatMasterOwner: "producer",
        finalSongMasterOwner: "licensee",
        transferBeatMaster: false
      },
      files: ["WAV", "MP3 untagged", "Stems"]
    }
  }
};

export function getLicenseTierConfig(tier: LicenseTier) {
  return LICENSE_TIER_CONFIG[tier];
}

export function getLicenseTerms(tier: LicenseTier) {
  return LICENSE_TIER_CONFIG[tier].terms;
}
