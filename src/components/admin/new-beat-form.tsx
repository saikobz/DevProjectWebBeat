"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Beat } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const genres: Beat["genre"][] = ["hiphop", "trap", "rnb", "drill"];

export function NewBeatForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const previewUrl = String(formData.get("previewUrl") ?? "");
    const wavPath = String(formData.get("wavPath") ?? "");
    const stemsPath = String(formData.get("stemsPath") ?? "");
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
        previewUrl,
        wavPath,
        stemsPath: stemsPath || undefined,
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
      <p className="mt-2 text-zinc-400">เพิ่ม metadata และ path ของไฟล์ที่อัปโหลดไว้ใน R2 แล้ว</p>
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
        <input name="previewUrl" required placeholder="Preview audio URL" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        <input name="wavPath" required placeholder="R2 WAV path เช่น private/wav/beat.wav" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
        <input name="stemsPath" placeholder="R2 stems path เช่น private/stems/beat.zip" className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white" />
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
