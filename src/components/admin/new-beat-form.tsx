"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Beat } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const genres: Beat["genre"][] = ["hiphop", "trap", "rnb", "drill"];

type UploadScope = "preview" | "wav" | "stems";

function fallbackContentType(scope: UploadScope, file: File): string {
  if (file.type) return file.type;
  if (scope === "preview") return "audio/mpeg";
  if (scope === "wav") return "audio/wav";
  return "application/zip";
}

export function NewBeatForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [previewUrl, setPreviewUrl] = useState("");
  const [wavPath, setWavPath] = useState("");
  const [stemsPath, setStemsPath] = useState("");
  const [uploading, setUploading] = useState<UploadScope | null>(null);

  const previewInputRef = useRef<HTMLInputElement>(null);
  const wavInputRef = useRef<HTMLInputElement>(null);
  const stemsInputRef = useRef<HTMLInputElement>(null);

  async function uploadViaPresign(scope: UploadScope, file: File) {
    setError(null);
    setStatus(null);
    setUploading(scope);

    const contentType = fallbackContentType(scope, file);

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
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "");
    const slug = String(formData.get("slug") ?? "");
    const genre = String(formData.get("genre") ?? "trap") as Beat["genre"];
    const bpm = Number(formData.get("bpm") ?? 0);
    const key = String(formData.get("key") ?? "");
    const previewUrlField = String(formData.get("previewUrl") ?? "").trim() || previewUrl;
    const wavPathField = String(formData.get("wavPath") ?? "").trim() || wavPath;
    const stemsPathField = String(formData.get("stemsPath") ?? "").trim() || stemsPath;
    const coverUrl = String(formData.get("coverUrl") ?? "");
    const description = String(formData.get("description") ?? "");

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
        previewUrl: previewUrlField,
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
        status: formData.get("publish") ? "published" : "draft"
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
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-black text-white">Upload New Beat</h1>
      <p className="mt-2 text-zinc-400">
        อัปโหลดไฟล์ไป R2 ผ่าน presigned URL (ไฟล์ไม่ผ่านเซิร์ฟเวอร์แอป) หรือกรอก URL/path ด้วยมือหากอัปโหลดแล้ว
      </p>
      <p className="mt-2 text-xs text-zinc-500">
        FFmpeg / voice tag ยังไม่รันในแอป — ประมวลผล preview ภายนอกแล้วค่อยอัปโหลด หรือใช้ไฟล์ที่มี voice tag อยู่แล้ว โฟลเดอร์เตรียม tag:{" "}
        <code className="text-zinc-400">public/voice-tags/</code>
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

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="title" required placeholder="Title" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
          <input name="slug" required placeholder="slug เช่น dark-trap-140-cmin" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
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
          required
          placeholder="Preview audio URL"
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
        {error ? <p className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
        <Button disabled={isSubmitting}>{isSubmitting ? "กำลังบันทึก..." : "Create beat"}</Button>
      </form>
    </Card>
  );
}
