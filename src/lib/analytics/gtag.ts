"use client";

import type { Beat, BeatLicense, CartItem, Order } from "@/types";

type GtagCommand = "config" | "event" | "js";

type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: Record<string, unknown>) => void;
  }
}

function canTrackAnalytics() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

function trackEvent(eventName: string, params: Record<string, unknown>) {
  if (!canTrackAnalytics()) return;
  window.gtag?.("event", eventName, params);
}

function minBeatLicensePriceThb(beat: Beat): number | undefined {
  if (beat.licenses.length === 0) return undefined;
  return Math.min(...beat.licenses.map((item) => item.priceThb));
}

function beatToItem(beat: Beat, license?: BeatLicense): AnalyticsItem {
  const price = license?.priceThb ?? minBeatLicensePriceThb(beat);
  return {
    item_id: beat.slug,
    item_name: beat.title,
    item_category: beat.genre,
    item_variant: license?.tier,
    ...(price !== undefined ? { price } : {}),
    quantity: 1
  };
}

function cartItemToAnalyticsItem(item: CartItem): AnalyticsItem {
  return {
    item_id: item.beatSlug,
    item_name: item.beatTitle,
    item_variant: item.licenseTier,
    price: item.priceThb,
    quantity: 1
  };
}

export function trackBeatView(beat: Beat) {
  const value = minBeatLicensePriceThb(beat);
  trackEvent("view_item", {
    currency: "THB",
    ...(value !== undefined ? { value } : {}),
    items: [beatToItem(beat)]
  });
}

export function trackAddToCart(beat: Beat, license: BeatLicense) {
  trackEvent("add_to_cart", {
    currency: "THB",
    value: license.priceThb,
    items: [beatToItem(beat, license)]
  });
}

export function trackBeginCheckout(items: CartItem[]) {
  trackEvent("begin_checkout", {
    currency: "THB",
    value: items.reduce((total, item) => total + item.priceThb, 0),
    items: items.map(cartItemToAnalyticsItem)
  });
}

export function trackPurchase(order: Pick<Order, "id" | "orderNumber" | "totalThb" | "items">) {
  trackEvent("purchase", {
    transaction_id: order.orderNumber || order.id,
    currency: "THB",
    value: order.totalThb,
    items: order.items.map(cartItemToAnalyticsItem)
  });
}
