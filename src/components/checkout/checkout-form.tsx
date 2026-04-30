"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatTHB } from "@/lib/format";
import { trackBeginCheckout } from "@/lib/analytics/gtag";
import { reportError } from "@/lib/monitoring/report-error";
import { useCartStore, getCartTotal } from "@/stores/cart-store";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function navigateToExternalUrl(url: string) {
  globalThis.location.assign(url);
}

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = getCartTotal(items);

  if (items.length === 0) {
    return (
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-white">ยังไม่มีสินค้าในตะกร้า</h1>
        <p className="mt-2 text-zinc-400">กลับไปเลือกบีทก่อนชำระเงิน</p>
        <LinkButton href="/beats" className="mt-6">
          ไปค้นบีท
        </LinkButton>
      </Card>
    );
  }

  return (
    <form
      className="grid gap-6 lg:grid-cols-[1fr_360px]"
      aria-busy={isSubmitting}
      onSubmit={async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              customerName,
              email,
              items
            })
          });

          const result = (await response.json()) as {
            error?: string;
            order?: { id: string };
            charge?: { authorizeUri?: string };
          };

          if (!response.ok || result.error || !result.order) {
            setError(result.error ?? "ไม่สามารถสร้างออเดอร์ได้");
            setIsSubmitting(false);
            return;
          }

          trackBeginCheckout(items);
          clear();
          const nextUrl = result.charge?.authorizeUri ?? `/checkout/success?order=${result.order.id}`;

          if (nextUrl.startsWith("http")) {
            navigateToExternalUrl(nextUrl);
            return;
          }

          router.push(nextUrl);
        } catch (caughtError) {
          reportError(caughtError, "checkout-submit", { itemCount: items.length });
          setError("เกิดข้อผิดพลาดระหว่างสร้างออเดอร์ กรุณาลองใหม่อีกครั้ง");
          setIsSubmitting(false);
        }
      }}
    >
      <Card>
        <h1 className="text-2xl font-bold text-white">ชำระเงิน</h1>
        <p className="mt-2 text-zinc-400">กรอกข้อมูลสำหรับออก license และรับไฟล์ ระบบจะสร้างออเดอร์ก่อนพาไปขั้นตอนชำระเงิน</p>
        <label className="mt-6 block text-sm font-semibold text-white" htmlFor="customerName">
          ชื่อสำหรับออก License
        </label>
        <input
          id="customerName"
          type="text"
          required
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          placeholder="ชื่อ-นามสกุล หรือ artist/company name"
          autoComplete="name"
          className="mt-2 min-h-11 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-lime-300 focus-visible:ring-2 focus-visible:ring-lime-300/60"
        />
        <p className="mt-2 text-xs text-zinc-500">ชื่อนี้จะถูกใช้ในเอกสาร license และข้อมูลคำสั่งซื้อ</p>
        <label className="mt-6 block text-sm font-semibold text-white" htmlFor="email">
          อีเมลสำหรับรับไฟล์
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ชื่อ@example.com"
          autoComplete="email"
          className="mt-2 min-h-11 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-lime-300 focus-visible:ring-2 focus-visible:ring-lime-300/60"
        />
        <p className="mt-2 text-xs text-zinc-500">ตรวจสอบอีเมลให้ถูกต้องเพื่อใช้รับไฟล์และลิงก์ดาวน์โหลด</p>
        <div className="mt-6 space-y-2 rounded-2xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400">
          <p className="font-medium text-zinc-200">ก่อนชำระเงิน</p>
          <p>ระบบจะสรุปรายการ สร้างออเดอร์ และพาไปชำระผ่าน PromptPay เมื่อ integration พร้อมใช้งาน</p>
          <p>ถ้ายังไม่ได้ตั้งค่า payment env ระบบจะใช้ mock fallback สำหรับการทดสอบ flow</p>
        </div>
        {error ? <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
      </Card>
      <Card className="h-fit lg:sticky lg:top-24">
        <h2 className="text-xl font-bold text-white">สรุปรายการ</h2>
        <p className="mt-2 text-sm text-zinc-400">{items.length} รายการในออเดอร์นี้</p>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div className="flex flex-col gap-1 border-b border-zinc-800/80 pb-3 text-sm last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4" key={item.licenseId}>
              <div className="min-w-0">
                <span className="block wrap-break-word text-zinc-300">{item.beatTitle}</span>
                <span className="text-xs text-zinc-500">{item.licenseName}</span>
              </div>
              <span className="font-medium text-zinc-400">{formatTHB(item.priceThb)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-zinc-800 pt-5">
          <span className="text-zinc-300">ยอดรวม</span>
          <span className="font-black text-lime-300">{formatTHB(total)}</span>
        </div>
        <Button className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "กำลังดำเนินการ..." : "ชำระเงิน"}
        </Button>
        <LinkButton href="/cart" variant="ghost" className="mt-3 w-full">
          กลับไปแก้ไขตะกร้า
        </LinkButton>
      </Card>
    </form>
  );
}