"use client";

import { useEffect } from "react";
import type { Order } from "@/types";
import { trackPurchase } from "@/lib/analytics/gtag";

type CheckoutSuccessTrackerProps = {
  order: Pick<Order, "id" | "orderNumber" | "totalThb" | "items">;
};

export function CheckoutSuccessTracker({ order }: CheckoutSuccessTrackerProps) {
  useEffect(() => {
    trackPurchase(order);
  }, [order]);

  return null;
}
