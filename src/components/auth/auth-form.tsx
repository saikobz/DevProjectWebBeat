"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { reportError } from "@/lib/monitoring/report-error";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AuthFormProps = {
  mode: "login" | "register";
};

function sanitizeNextPath(next: string | null | undefined, fallback: string) {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  return next;
}

function buildAuthHref(pathname: string, nextPath: string) {
  if (!nextPath || nextPath === "/library") return pathname;
  return `${pathname}?next=${encodeURIComponent(nextPath)}`;
}

function getQueryFeedback(errorCode: string | null, reason: string | null) {
  if (reason === "supabase-not-configured") {
    return {
      type: "error" as const,
      text: "โปรเจกต์นี้ยังไม่ได้ตั้งค่า Supabase/Auth ใน environment ของหน้านี้"
    };
  }

  if (errorCode === "oauth") {
    return {
      type: "error" as const,
      text: "Google sign-in ไม่สำเร็จ กรุณาตรวจ Supabase provider และ redirect URL แล้วลองอีกครั้ง"
    };
  }

  return null;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const isRegister = mode === "register";
  const defaultNextPath = isRegister ? "/account" : "/library";
  const nextPath = sanitizeNextPath(searchParams.get("next"), defaultNextPath);
  const queryFeedback = useMemo(
    () => getQueryFeedback(searchParams.get("error"), searchParams.get("reason")),
    [searchParams]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    if (isRegister && !privacyConsent) {
      setError("กรุณายอมรับนโยบายความเป็นส่วนตัวและข้อกำหนดการใช้บริการก่อนสมัครสมาชิก");
      setIsSubmitting(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError("ยังไม่ได้ตั้งค่า Supabase env ใน .env.local");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = isRegister
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: displayName
              }
            }
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setError(result.error.message);
        setIsSubmitting(false);
        return;
      }

      if (isRegister && !result.data.session) {
        setMessage("สมัครสำเร็จแล้ว กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ");
        setIsSubmitting(false);
        return;
      }

      router.refresh();
      router.push(nextPath);
    } catch (caughtError) {
      reportError(caughtError, "auth-submit", { mode, nextPath });
      setError("เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setMessage(null);

    if (isRegister && !privacyConsent) {
      setError("กรุณายอมรับข้อกำหนดและนโยบายความเป็นส่วนตัวก่อนเข้าด้วย Google");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError("ยังไม่ได้ตั้งค่า Supabase env ใน .env.local");
      return;
    }

    setIsOAuthLoading(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || origin;

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${siteBase}/auth/callback?next=${encodeURIComponent(nextPath)}`
        }
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsOAuthLoading(false);
      }
    } catch (caughtError) {
      reportError(caughtError, "auth-google-oauth", { mode, nextPath });
      setError("ไม่สามารถเริ่ม Google sign-in ได้ กรุณาลองใหม่อีกครั้ง");
      setIsOAuthLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="text-3xl font-black text-white">{isRegister ? "Register" : "Login"}</h1>
      <p className="mt-2 text-zinc-400">
        {isRegister ? "สมัครสมาชิกด้วย Supabase Auth เพื่อเก็บ library และ orders" : "เข้าสู่ระบบเพื่อดู library, orders และ account"}
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {isRegister ? (
          <input
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
            placeholder="ชื่อที่ใช้ใน license"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        ) : null}
        <input
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
          placeholder="Email"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
          placeholder="Password"
          required
          minLength={6}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {isRegister ? (
          <label className="flex cursor-pointer gap-3 text-sm leading-snug text-zinc-400">
            <input
              checked={privacyConsent}
              className="mt-1 size-4 shrink-0 rounded border-zinc-600 bg-zinc-950 text-lime-300 focus-visible:ring-2 focus-visible:ring-lime-300"
              onChange={(event) => setPrivacyConsent(event.target.checked)}
              type="checkbox"
            />
            <span>
              ข้าพเจ้ายอมรับ{" "}
              <Link className="font-semibold text-lime-300 underline-offset-4 hover:underline" href="/terms">
                ข้อกำหนดการใช้บริการ
              </Link>{" "}
              และ{" "}
              <Link className="font-semibold text-lime-300 underline-offset-4 hover:underline" href="/privacy">
                นโยบายความเป็นส่วนตัว
              </Link>
            </span>
          </label>
        ) : null}
        {error ? <p className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
        {!error && queryFeedback?.type === "error" ? (
          <p className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">{queryFeedback.text}</p>
        ) : null}
        {message ? <p className="rounded-2xl border border-lime-300/40 bg-lime-300/10 p-3 text-sm text-lime-100">{message}</p> : null}
        <Button className="w-full" disabled={isSubmitting || isOAuthLoading}>
          {isSubmitting ? "กำลังดำเนินการ..." : isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </Button>
      </form>

      <div className="relative my-7">
        <div aria-hidden className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-800" />
        </div>
        <p className="relative mx-auto w-fit bg-zinc-950 px-3 text-center text-xs uppercase tracking-wider text-zinc-500">หรือ</p>
      </div>

      <Button
        className="w-full border border-zinc-600"
        disabled={isSubmitting || isOAuthLoading}
        onClick={() => void handleGoogleSignIn()}
        type="button"
        variant="secondary"
      >
        {isOAuthLoading ? "กำลังเปิด Google..." : "ดำเนินการต่อด้วย Google"}
      </Button>
      <p className="mt-3 text-xs text-zinc-500">
        ใช้งาน Google sign-in ได้เมื่อเปิด Google provider ใน Supabase และตั้ง redirect URL เป็น{" "}
        <code className="text-zinc-400">{`{NEXT_PUBLIC_SITE_URL}/auth/callback`}</code>
      </p>

      <p className="mt-5 text-center text-sm text-zinc-400">
        {isRegister ? "มีบัญชีแล้ว?" : "ยังไม่มีบัญชี?"}{" "}
        <Link
          className="font-semibold text-lime-300"
          href={isRegister ? buildAuthHref("/login", nextPath) : buildAuthHref("/register", nextPath)}
        >
          {isRegister ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </Link>
      </p>
    </Card>
  );
}
