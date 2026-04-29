"use client";

import Link from "next/link";
import { formatTHB } from "@/lib/format";
import { getCartTotal, useCartStore } from "@/stores/cart-store";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = getCartTotal(items);

  if (items.length === 0) {
    return (
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-white">Cart ว่างอยู่</h1>
        <p className="mt-2 text-zinc-400">เลือกบีทและ license ก่อนเริ่ม checkout</p>
        <LinkButton href="/beats" className="mt-6">Browse Beats</LinkButton>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.licenseId} className="flex items-center justify-between gap-4">
            <div>
              <Link href={`/beats/${item.beatSlug}`} className="font-semibold text-white hover:text-lime-300">
                {item.beatTitle}
              </Link>
              <p className="text-sm text-zinc-400">{item.licenseName}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lime-300">{formatTHB(item.priceThb)}</p>
              <button className="mt-2 text-xs text-zinc-500 hover:text-white" onClick={() => removeItem(item.licenseId)} type="button">
                remove
              </button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="h-fit">
        <h2 className="text-xl font-bold text-white">Order Summary</h2>
        <div className="mt-5 flex justify-between text-zinc-300">
          <span>Total</span>
          <span className="text-2xl font-black text-lime-300">{formatTHB(total)}</span>
        </div>
        <LinkButton href="/checkout" className="mt-6 w-full">Checkout</LinkButton>
        <Button variant="ghost" className="mt-3 w-full" onClick={() => useCartStore.getState().clear()}>
          Clear cart
        </Button>
      </Card>
    </div>
  );
}
