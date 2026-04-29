"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatTHB } from "@/lib/format";
import { useCartStore, getCartTotal } from "@/stores/cart-store";
import { saveMockOrder } from "@/stores/mock-order-store";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = getCartTotal(items);

  if (items.length === 0) {
    return (
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-white">ยังไม่มีสินค้าใน cart</h1>
        <p className="mt-2 text-zinc-400">กลับไปเลือกบีทก่อน checkout</p>
        <LinkButton href="/beats" className="mt-6">Browse Beats</LinkButton>
      </Card>
    );
  }

  return (
    <form
      className="grid gap-6 lg:grid-cols-[1fr_360px]"
      onSubmit={(event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const order = saveMockOrder(email, items);
        clear();
        router.push(`/checkout/success?order=${order.id}`);
      }}
    >
      <Card>
        <h1 className="text-2xl font-bold text-white">Checkout</h1>
        <p className="mt-2 text-zinc-400">MVP ตอนนี้เป็น mock payment เพื่อทดสอบ flow ก่อนต่อ Omise PromptPay จริง</p>
        <label className="mt-6 block text-sm font-semibold text-white" htmlFor="email">
          Email สำหรับรับไฟล์
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-lime-300"
        />
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400">
          Payment method: Mock PromptPay success
        </div>
      </Card>
      <Card className="h-fit">
        <h2 className="text-xl font-bold text-white">Summary</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div className="flex justify-between gap-4 text-sm" key={item.licenseId}>
              <span className="text-zinc-300">{item.beatTitle}</span>
              <span className="text-zinc-400">{formatTHB(item.priceThb)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-zinc-800 pt-5">
          <span className="text-zinc-300">Total</span>
          <span className="font-black text-lime-300">{formatTHB(total)}</span>
        </div>
        <Button className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Mock Pay Success"}
        </Button>
      </Card>
    </form>
  );
}
