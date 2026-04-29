"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setError("ยังไม่ได้ตั้งค่า Supabase env ใน .env.local");
      setIsSubmitting(false);
      return;
    }

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
    router.push(isRegister ? "/account" : "/library");
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
        {error ? <p className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
        {message ? <p className="rounded-2xl border border-lime-300/40 bg-lime-300/10 p-3 text-sm text-lime-100">{message}</p> : null}
        <Button className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "กำลังดำเนินการ..." : isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-zinc-400">
        {isRegister ? "มีบัญชีแล้ว?" : "ยังไม่มีบัญชี?"}{" "}
        <Link className="font-semibold text-lime-300" href={isRegister ? "/login" : "/register"}>
          {isRegister ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </Link>
      </p>
    </Card>
  );
}
