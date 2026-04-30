export type VoiceTagMode = "ready-preview" | "mix-from-wav" | "no-voice-tag";
export type AudioProcessingMode = "manual" | "external-worker";

export type AudioPipelineDefaults = {
  workerUrlConfigured: boolean;
  publicBaseUrl?: string;
  voiceTagSourcePath?: string;
};

export type AudioPipelinePlanInput = AudioPipelineDefaults & {
  slug?: string;
  previewUrl?: string;
  wavPath?: string;
  stemsPath?: string;
  voiceTagMode: VoiceTagMode;
};

export type AudioPipelineStep = {
  title: string;
  detail: string;
  status: "done" | "pending" | "warning";
};

export type AudioPipelinePlan = {
  mode: AudioProcessingMode;
  expectedPreviewKey?: string;
  expectedPreviewUrl?: string;
  warnings: string[];
  steps: AudioPipelineStep[];
};

function buildExpectedPreviewKey(slug?: string) {
  if (!slug) return undefined;
  return `public/previews/generated/${slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}.mp3`;
}

export function buildAudioProcessingPlan(input: AudioPipelinePlanInput): AudioPipelinePlan {
  const warnings: string[] = [];
  const expectedPreviewKey = input.voiceTagMode === "mix-from-wav" ? buildExpectedPreviewKey(input.slug) : undefined;
  const expectedPreviewUrl =
    expectedPreviewKey && input.publicBaseUrl
      ? `${input.publicBaseUrl.replace(/\/$/, "")}/${expectedPreviewKey}`
      : undefined;

  if (input.voiceTagMode === "no-voice-tag") {
    warnings.push("โหมดนี้เหมาะกับ dev/internal review เท่านั้น ก่อนขายจริงควรมี preview ที่ใส่ voice tag แล้ว");
  }

  if (input.voiceTagMode === "mix-from-wav" && !input.workerUrlConfigured) {
    warnings.push("ยังไม่ได้ตั้งค่า FFMPEG worker — ตอนนี้แอปช่วยวางแผนได้ แต่ยังไม่ประมวลผลไฟล์ให้อัตโนมัติ");
  }

  if (input.voiceTagMode === "mix-from-wav" && !input.voiceTagSourcePath) {
    warnings.push("ยังไม่ได้ตั้งค่าไฟล์ voice tag กลาง (`VOICE_TAG_SOURCE_PATH`) สำหรับ worker");
  }

  if (input.voiceTagMode === "mix-from-wav" && !expectedPreviewUrl) {
    warnings.push("ยังไม่มี `R2_PUBLIC_BASE_URL` จึงยังคำนวณ public preview URL ล่วงหน้าไม่ได้");
  }

  if (input.previewUrl && input.voiceTagMode === "mix-from-wav") {
    warnings.push("มี Preview URL อยู่แล้ว — ถ้าจะให้ worker สร้างไฟล์ใหม่ โปรดตรวจว่า URL นี้ชี้ไปยัง output ที่ worker จะอัปเดตจริง");
  }

  const steps: AudioPipelineStep[] = [];

  if (input.voiceTagMode === "ready-preview") {
    steps.push(
      {
        title: "เตรียม preview ที่ใส่ voice tag แล้ว",
        detail: input.previewUrl ? `Preview URL พร้อมแล้ว: ${input.previewUrl}` : "อัปโหลด/กรอก Preview URL ที่ผ่านการมิกซ์ voice tag มาแล้ว",
        status: input.previewUrl ? "done" : "pending"
      },
      {
        title: "อัปโหลด WAV master",
        detail: input.wavPath ? `WAV path พร้อมแล้ว: ${input.wavPath}` : "อัปโหลดไฟล์ WAV เต็มสำหรับส่งมอบหลังชำระเงิน",
        status: input.wavPath ? "done" : "pending"
      },
      {
        title: "อัปโหลด stems (ถ้ามี)",
        detail: input.stemsPath ? `Stems path พร้อมแล้ว: ${input.stemsPath}` : "ถ้ามี stems ให้แนบ ZIP เพิ่มภายหลังได้",
        status: input.stemsPath ? "done" : "pending"
      }
    );

    return {
      mode: "manual",
      warnings,
      steps
    };
  }

  if (input.voiceTagMode === "no-voice-tag") {
    steps.push(
      {
        title: "อัปโหลด preview ปัจจุบัน",
        detail: input.previewUrl ? `Preview URL ปัจจุบัน: ${input.previewUrl}` : "ใส่ Preview URL สำหรับใช้ภายในหรือเดโมชั่วคราว",
        status: input.previewUrl ? "done" : "pending"
      },
      {
        title: "ยืนยันการใช้งานเฉพาะภายใน",
        detail: "อย่า publish เป็น storefront จริงจนกว่าจะมี preview ที่ใส่ voice tag ตามนโยบาย",
        status: "warning"
      }
    );

    return {
      mode: "manual",
      warnings,
      steps
    };
  }

  steps.push(
    {
      title: "อัปโหลด dry WAV / master เข้า private bucket",
      detail: input.wavPath ? `WAV path พร้อมแล้ว: ${input.wavPath}` : "ต้องมี WAV path เพื่อให้ worker ใช้เป็น source หลัก",
      status: input.wavPath ? "done" : "pending"
    },
    {
      title: "ให้ worker ผสม voice tag แล้ว encode preview",
      detail: input.workerUrlConfigured
        ? `Worker พร้อมใช้งาน และจะใช้ voice tag จาก ${input.voiceTagSourcePath ?? "ค่า env ของ worker"}`
        : "ตั้งค่า FFMPEG worker ก่อน ถ้าต้องการให้ระบบสร้าง preview อัตโนมัติ",
      status: input.workerUrlConfigured ? "pending" : "warning"
    },
    {
      title: "บันทึก expected preview output",
      detail: expectedPreviewUrl
        ? `ใช้ URL นี้เป็น preview ชั่วคราวสำหรับ draft ได้: ${expectedPreviewUrl}`
        : "ตั้งค่า public base URL หรือกรอก preview URL เองหลัง worker สร้างไฟล์เสร็จ",
      status: expectedPreviewUrl ? "pending" : "warning"
    },
    {
      title: "publish เมื่อไฟล์ preview จริงพร้อมแล้ว",
      detail: "แนะนำให้สร้าง beat เป็น draft ก่อน แล้วค่อย publish หลัง worker อัปโหลด preview สำเร็จ",
      status: "warning"
    }
  );

  return {
    mode: input.workerUrlConfigured ? "external-worker" : "manual",
    expectedPreviewKey,
    expectedPreviewUrl,
    warnings,
    steps
  };
}
