"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FreeBeatForm() {
  const [email, setEmail] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    if (!privacyConsent) {
      setError("กรุณายอมรับนโยบายความเป็นส่วนตัวก่อนบันทึกอีเมล");
      setIsSubmitting(false);
      return;
    }

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, source: "free-beat" })
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(result.error ?? "บันทึกอีเมลไม่สำเร็จ");
      setIsSubmitting(false);
      return;
    }

    setMessage("บันทึกอีเมลแล้ว ลิงก์ดาวน์โหลดจะถูกส่งเมื่อเปิด delivery จริง");
    setIsSubmitting(false);
  }

  return (
    <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-lime-300"
        />
        <Button disabled={isSubmitting}>{isSubmitting ? "กำลังส่ง..." : "Send download link"}</Button>
      </div>
      <label className="flex cursor-pointer gap-3 text-sm leading-snug text-zinc-400">
        <input
          checked={privacyConsent}
          className="mt-1 size-4 shrink-0 rounded border-zinc-600 bg-zinc-950 text-lime-300 focus-visible:ring-2 focus-visible:ring-lime-300"
          onChange={(event) => setPrivacyConsent(event.target.checked)}
          type="checkbox"
        />
        <span>
          ยอมรับการเก็บอีเมลเพื่อส่งลิงก์และข่าวสารตาม{" "}
          <Link className="font-semibold text-lime-300 underline-offset-4 hover:underline" href="/privacy">
            นโยบายความเป็นส่วนตัว
          </Link>
        </span>
      </label>
      {message ? <p className="text-sm text-lime-300">{message}</p> : null}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </form>
  );
}
