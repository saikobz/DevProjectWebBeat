"use client";

import { useSyncExternalStore } from "react";
import { formatDateTime, formatTHB } from "@/lib/format";
import { getMockOrders } from "@/stores/mock-order-store";
import type { Order } from "@/types";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

const emptyOrders: Order[] = [];
let cachedOrdersRaw: string | null = null;
let cachedPaidOrders: Order[] = emptyOrders;

function subscribeToOrders(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getPaidOrdersSnapshot() {
  const ordersRaw = window.localStorage.getItem("webbeat-orders");
  if (ordersRaw === cachedOrdersRaw) {
    return cachedPaidOrders;
  }

  cachedOrdersRaw = ordersRaw;
  const orders = getMockOrders().filter((order) => order.status === "paid");
  cachedPaidOrders = orders.length > 0 ? orders : emptyOrders;
  return cachedPaidOrders;
}

function getServerOrdersSnapshot() {
  return emptyOrders;
}

export function LibraryView() {
  const orders = useSyncExternalStore(subscribeToOrders, getPaidOrdersSnapshot, getServerOrdersSnapshot);

  if (orders.length === 0) {
    return (
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-white">My Library</h1>
        <p className="mt-2 text-zinc-400">ยังไม่มี order ที่ชำระสำเร็จใน mock storage</p>
        <LinkButton href="/beats" className="mt-6">Browse Beats</LinkButton>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <div className="flex flex-col justify-between gap-2 md:flex-row">
            <div>
              <p className="font-bold text-white">{order.orderNumber}</p>
              <p className="text-sm text-zinc-300">{order.customerName}</p>
              <p className="text-sm text-zinc-400">{formatDateTime(order.paidAt ?? order.createdAt)}</p>
            </div>
            <p className="font-bold text-lime-300">{formatTHB(order.totalThb)}</p>
          </div>
          <div className="mt-4 grid gap-3">
            {order.items.map((item) => (
              <div key={item.licenseId} className="flex flex-col justify-between gap-2 rounded-2xl bg-zinc-950 p-4 md:flex-row md:items-center">
                <div>
                  <p className="font-semibold text-white">{item.beatTitle}</p>
                  <p className="text-sm text-zinc-400">{item.licenseName}</p>
                </div>
                <a className="text-sm font-semibold text-lime-300" href={`/api/downloads/mock?beat=${item.beatId}`}>
                  Download placeholder
                </a>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
