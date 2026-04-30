"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildAudioProcessingPlan, type AudioPipelineDefaults, type VoiceTagMode } from "@/lib/audio/processing-plan";
import { reportError } from "@/lib/monitoring/report-error";
import type { Beat } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const genres: Beat["genre"][] = ["hiphop", "trap", "rnb", "drill"];

type UploadScope = "preview" | "wav" | "stems";

type NewBeatFormProps = {
  pipelineDefaults: AudioPipelineDefaults;
};

function fallbackContentType(scope: UploadScope, file: File): string {
  if (file.type) return file.type;
  if (scope === "preview") return "audio/mpeg";
  if (scope === "wav") return "audio/wav";
  return "application/zip";
}

export function NewBeatForm({ pipelineDefaults }: NewBeatFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [slugInput, setSlugInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [wavPath, setWavPath] = useState("");
  const [stemsPath, setStemsPath] = useState("");
  const [uploading, setUploading] = useState<UploadScope | null>(null);
  const [voiceTagMode, setVoiceTagMode] = useState<VoiceTagMode>("ready-preview");

  const previewInputRef = useRef<HTMLInputElement>(null);
  const wavInputRef = useRef<HTMLInputElement>(null);
  const stemsInputRef = useRef<HTMLInputElement>(null);
  const pipelinePlan = useMemo(
    () =>
      buildAudioProcessingPlan({
        ...pipelineDefaults,
        slug: slugInput.trim(),
        previewUrl: previewUrl.trim(),
        wavPath: wavPath.trim(),
        stemsPath: stemsPath.trim(),
        voiceTagMode
      }),
    [pipelineDefaults, previewUrl, slugInput, stemsPath, voiceTagMode, wavPath]
  );

  async function uploadViaPresign(scope: UploadScope, file: File) {
    setError(null);
    setStatus(null);
    setUploading(scope);

    const contentType = fallbackContentType(scope, file);

    try {
      const presignResponse = await fetch("/api/admin/r2/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          scope,
          fileName: file.name,
          contentType
        })
      });

      const presignJson = (await presignResponse.json()) as {
        error?: string;
        putUrl?: string;
        key?: string;
        publicUrl?: string | null;
      };

      if (!presignResponse.ok || !presignJson.putUrl || !presignJson.key) {
        setError(presignJson.error ?? "ขอ presigned URL ไม่สำเร็จ");
        setUploading(null);
        return;
      }

      const putResponse = await fetch(presignJson.putUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType
        }
      });

      if (!putResponse.ok) {
        setError(`อัปโหลดไฟล์ไม่สำเร็จ (${putResponse.status})`);
        setUploading(null);
        return;
      }

      if (scope === "preview") {
        const url = presignJson.publicUrl ?? "";
        if (url) {
          setPreviewUrl(url);
        }
        setStatus(
          url
            ? "อัปโหลด preview แล้ว — ใส่ Preview URL ในฟอร์มแล้ว"
            : "อัปโหลดแล้ว — ตั้งค่า R2_PUBLIC_BASE_URL เพื่อได้ URL สาธารณะอัตโนมัติ หรือกรอก preview URL ด้วยมือ"
        );
      } else if (scope === "wav") {
        setWavPath(presignJson.key);
        setStatus(`อัปโหลด WAV เป็น path: ${presignJson.key}`);
      } else {
        setStemsPath(presignJson.key);
        setStatus(`อัปโหลด stems เป็น path: ${presignJson.key}`);
      }

      setUploading(null);
    } catch (caughtError) {
      reportError(caughtError, "admin-upload-presign", { scope, fileName: file.name });
      setError("อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setUploading(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const genre = String(formData.get("genre") ?? "trap") as Beat["genre"];
    const bpm = Number(formData.get("bpm") ?? 0);
    const key = String(formData.get("key") ?? "").trim();
    const publishNow = Boolean(formData.get("publish"));
    const previewUrlField = String(formData.get("previewUrl") ?? "").trim() || previewUrl;
    const wavPathField = String(formData.get("wavPath") ?? "").trim() || wavPath;
    const stemsPathField = String(formData.get("stemsPath") ?? "").trim() || stemsPath;
    const coverUrl = String(formData.get("coverUrl") ?? "");
    const description = String(formData.get("description") ?? "");
    const resolvedPreviewUrl = previewUrlField || (voiceTagMode === "mix-from-wav" ? pipelinePlan.expectedPreviewUrl ?? "" : "");

    if (voiceTagMode === "mix-from-wav" && publishNow) {
      setError("โหมด worker voice tag ควรสร้างเป็น draft ก่อน แล้วค่อย publish หลัง preview จริงถูกประมวลผลเสร็จ");
      setIsSubmitting(false);
      return;
    }

    if (!resolvedPreviewUrl) {
      setError("กรุณาใส่ Preview URL หรือเลือกแผน pipeline ที่มี expected preview URL พร้อมใช้งาน");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/beats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          slug,
          genre,
          bpm,
          key,
          previewUrl: resolvedPreviewUrl,
          wavPath: wavPathField,
          stemsPath: stemsPathField || undefined,
          coverUrl: coverUrl || undefined,
          description,
          mood: String(formData.get("mood") ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          tags: String(formData.get("tags") ?? "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          status: publishNow ? "published" : "draft"
        })
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "สร้างบีทไม่สำเร็จ");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/beats");
      router.refresh();
    } catch (caughtError) {
      reportError(caughtError, "admin-create-beat", {
        slug,
        voiceTagMode
      });
      setError("สร้างบีทไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-black text-white">Upload New Beat</h1>
      <p className="mt-2 text-zinc-400">
        อัปโหลดไฟล์ไป R2 ผ่าน presigned URL (ไฟล์ไม่ผ่านเซิร์ฟเวอร์แอป) หรือกรอก URL/path ด้วยมือหากอัปโหลดแล้ว
      </p>
      <p className="mt-2 text-xs text-zinc-500">
        ฟอร์มนี้มี audio pipeline preflight แล้ว: ถ้าใช้ worker mode ระบบจะช่วยคำนวณ expected preview URL และขั้นตอนก่อน publish ให้
      </p>

      <div className="mt-6 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-sm font-semibold text-white">อัปโหลดจากเครื่อง</p>
        <div className="flex flex-wrap gap-3">
          <input ref={previewInputRef} accept=".mp3,audio/mpeg,audio/mp3" className="hidden" type="file" onChange={(e) => e.target.files?.[0] && void uploadViaPresign("preview", e.target.files[0])} />
          <Button disabled={uploading !== null} type="button" variant="secondary" onClick={() => previewInputRef.current?.click()}>
            {uploading === "preview" ? "กำลังอัปโหลด preview..." : "เลือก Preview (MP3)"}
          </Button>
          <input ref={wavInputRef} accept=".wav,audio/wav" className="hidden" type="file" onChange={(e) => e.target.files?.[0] && void uploadViaPresign("wav", e.target.files[0])} />
          <Button disabled={uploading !== null} type="button" variant="secondary" onClick={() => wavInputRef.current?.click()}>
            {uploading === "wav" ? "กำลังอัปโหลด WAV..." : "เลือก WAV"}
          </Button>
          <input ref={stemsInputRef} accept=".zip,application/zip" className="hidden" type="file" onChange={(e) => e.target.files?.[0] && void uploadViaPresign("stems", e.target.files[0])} />
          <Button disabled={uploading !== null} type="button" variant="secondary" onClick={() => stemsInputRef.current?.click()}>
            {uploading === "stems" ? "กำลังอัปโหลด stems..." : "เลือก Stems (zip)"}
          </Button>
        </div>
        {status ? <p className="text-sm text-lime-300">{status}</p> : null}
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">Audio pipeline</p>
            <p className="text-xs text-zinc-500">
              เลือกวิธีเตรียม preview เพื่อให้ทีมรู้ว่าจะใช้ไฟล์ที่ใส่ voice tag มาแล้ว หรือให้ worker สร้างภายหลัง
            </p>
          </div>
          <label className="grid gap-1 text-sm text-zinc-300">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Voice tag mode</span>
            <select
              className="min-h-11 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-white"
              value={voiceTagMode}
              onChange={(event) => setVoiceTagMode(event.target.value as VoiceTagMode)}
            >
              <option value="ready-preview">มี preview ที่ใส่ voice tag มาแล้ว</option>
              <option value="mix-from-wav">ให้ worker สร้าง preview จาก WAV + voice tag</option>
              <option value="no-voice-tag">ยังไม่ใส่ voice tag (dev/internal only)</option>
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
          <p className="text-sm font-semibold text-white">
            โหมดปัจจุบัน: {pipelinePlan.mode === "external-worker" ? "External worker" : "Manual"}
          </p>
          {pipelinePlan.expectedPreviewUrl ? (
            <div className="mt-3 space-y-2 rounded-2xl border border-lime-300/20 bg-lime-300/5 p-3 text-sm text-zinc-200">
              <p className="font-medium text-lime-300">Expected preview URL</p>
              <code className="block break-all text-xs text-zinc-300">{pipelinePlan.expectedPreviewUrl}</code>
              <Button type="button" variant="secondary" onClick={() => setPreviewUrl(pipelinePlan.expectedPreviewUrl ?? "")}>
                ใช้ URL นี้กับ draft
              </Button>
            </div>
          ) : null}

          {pipelinePlan.warnings.length > 0 ? (
            <div className="mt-3 space-y-2 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-100">
              <p className="font-medium">ข้อควรระวัง</p>
              <ul className="list-inside list-disc space-y-1">
                {pipelinePlan.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3">
            {pipelinePlan.steps.map((step) => (
              <div
                key={step.title}
                className={`rounded-2xl border p-3 text-sm ${
                  step.status === "done"
                    ? "border-lime-300/30 bg-lime-300/5 text-lime-100"
                    : step.status === "warning"
                      ? "border-amber-400/30 bg-amber-400/5 text-amber-100"
                      : "border-zinc-800 bg-zinc-900 text-zinc-300"
                }`}
              >
                <p className="font-medium">{step.title}</p>
                <p className="mt-1 text-xs opacity-90">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="title" required placeholder="Title" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
          <input
            name="slug"
            required
            placeholder="slug เช่น dark-trap-140-cmin"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
          />
          <input name="bpm" required type="number" min={40} max={240} placeholder="BPM" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
          <input name="key" required placeholder="Key เช่น C minor" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
          <select name="genre" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white">
            {genres.map((genre) => (
              <option value={genre} key={genre}>
                {genre}
              </option>
            ))}
          </select>
          <input name="coverUrl" placeholder="Cover URL" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        </div>
        <textarea name="description" placeholder="Description" className="min-h-28 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        <input
          name="previewUrl"
          required={voiceTagMode !== "mix-from-wav"}
          placeholder={voiceTagMode === "mix-from-wav" ? "Preview URL ที่ worker จะอัปเดต หรือกรอกเองภายหลัง" : "Preview audio URL"}
          value={previewUrl}
          onChange={(e) => setPreviewUrl(e.target.value)}
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />
        <input
          name="wavPath"
          required
          placeholder="R2 WAV path เช่น private/wav/beat.wav"
          value={wavPath}
          onChange={(e) => setWavPath(e.target.value)}
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />
        <input
          name="stemsPath"
          placeholder="R2 stems path เช่น private/stems/beat.zip"
          value={stemsPath}
          onChange={(e) => setStemsPath(e.target.value)}
          className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />
        <input name="mood" placeholder="Mood คั่นด้วย comma เช่น dark, aggressive" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        <input name="tags" placeholder="Tags คั่นด้วย comma เช่น 808, thai rap" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input name="publish" type="checkbox" />
          Publish ทันที
        </label>
        {voiceTagMode === "mix-from-wav" ? (
          <p className="text-xs text-amber-200">
            Worker mode จะบังคับให้สร้างเป็น draft ก่อน เพื่อรอ preview จริงจาก pipeline ภายนอก
          </p>
        ) : null}
        {error ? <p className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
        <Button disabled={isSubmitting}>{isSubmitting ? "กำลังบันทึก..." : "Create beat"}</Button>
      </form>
    </Card>
  );
}
