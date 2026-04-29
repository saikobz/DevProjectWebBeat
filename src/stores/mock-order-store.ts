"use client";

import type { CartItem, Order } from "@/types";

const key = "webbeat-orders";

export function getMockOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as Order[]) : [];
}

export function saveMockOrder(email: string, items: CartItem[]): Order {
  const orders = getMockOrders();
  const createdAt = new Date().toISOString();
  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: `ORD-${createdAt.slice(0, 10).replaceAll("-", "")}-${String(orders.length + 1).padStart(4, "0")}`,
    email,
    status: "paid",
    totalThb: items.reduce((total, item) => total + item.priceThb, 0),
    items,
    createdAt,
    paidAt: createdAt
  };

  window.localStorage.setItem(key, JSON.stringify([order, ...orders]));
  return order;
}
