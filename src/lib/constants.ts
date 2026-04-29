import type { LicenseTier } from "@/types";

export const GENRES = ["hiphop", "trap", "rnb", "drill"] as const;

export const LICENSE_ORDER: LicenseTier[] = ["basic", "premium", "trackout", "exclusive"];

export const LICENSE_COPY: Record<LicenseTier, { name: string; summary: string }> = {
  basic: {
    name: "Basic Lease",
    summary: "MP3 untagged สำหรับเริ่มปล่อยเพลง งบเบา ต้องให้เครดิต"
  },
  premium: {
    name: "Premium Lease",
    summary: "WAV + MP3 ใช้ monetize และทำ MV ได้ เหมาะกับซิงเกิลจริงจัง"
  },
  trackout: {
    name: "Trackout / Stems",
    summary: "ได้ stems สำหรับมิกซ์เอง เหมาะกับงานคุณภาพสูง"
  },
  exclusive: {
    name: "Exclusive",
    summary: "ซื้อขาด ลบจากหน้าเว็บหลังขาย และได้ไฟล์ครบ"
  }
};
