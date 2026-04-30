import { requireAdmin } from "@/lib/auth/session";
import { NewBeatForm } from "@/components/admin/new-beat-form";

export default async function NewBeatPage() {
  await requireAdmin();
  return (
    <NewBeatForm
      pipelineDefaults={{
        workerUrlConfigured: Boolean(process.env.FFMPEG_WORKER_URL),
        publicBaseUrl: process.env.R2_PUBLIC_BASE_URL,
        voiceTagSourcePath: process.env.VOICE_TAG_SOURCE_PATH
      }}
    />
  );
}
