"use client";

import Link from "next/link";
import { formatTHB } from "@/lib/format";
import { getCartTotal, useCartStore } from "@/stores/cart-store";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const total = getCartTotal(items);

  if (items.length === 0) {
    return (
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-white">Cart ว่างอยู่</h1>
        <p className="mt-2 text-zinc-400">เลือกบีทและ license ก่อนเริ่ม checkout</p>
        <LinkButton href="/beats" className="mt-6">
          ไปค้นบีท
        </LinkButton>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.licenseId} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">บีท</p>
              <Link
                href={`/beats/${item.beatSlug}`}
                className="mt-1 inline-block wrap-break-word font-semibold text-white transition hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
              >
                {item.beatTitle}
              </Link>
              <p className="mt-1 text-sm text-zinc-400">{item.licenseName}</p>
            </div>
            <div className="flex items-end justify-between gap-4 sm:block sm:text-right">
              <p className="font-bold text-lime-300">{formatTHB(item.priceThb)}</p>
              <button
                className="inline-flex min-h-11 items-center rounded-full px-3 py-2 text-sm text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 sm:mt-2 sm:text-xs"
                onClick={() => removeItem(item.licenseId)}
                type="button"
              >
                ลบ
              </button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="h-fit lg:sticky lg:top-24">
        <h2 className="text-xl font-bold text-white">สรุปยอด</h2>
        <p className="mt-2 text-sm text-zinc-400">{items.length} รายการ พร้อมไป checkout</p>
        <div className="mt-5 flex justify-between text-zinc-300">
          <span>ยอดรวม</span>
          <span className="text-2xl font-black text-lime-300">{formatTHB(total)}</span>
        </div>
        <LinkButton href="/checkout" className="mt-6 w-full">
          ไปชำระเงิน
        </LinkButton>
        <Button variant="ghost" className="mt-3 w-full" onClick={() => clear()}>
          ล้างตะกร้า
        </Button>
      </Card>
    </div>
  );
}
