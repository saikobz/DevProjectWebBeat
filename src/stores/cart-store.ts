"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat, BeatLicense, CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  addItem: (beat: Beat, license: BeatLicense) => void;
  removeItem: (licenseId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (beat, license) =>
        set((state) => {
          const nextItem: CartItem = {
            beatId: beat.id,
            beatSlug: beat.slug,
            beatTitle: beat.title,
            licenseId: license.id,
            licenseTier: license.tier,
            licenseName: license.name,
            priceThb: license.priceThb
          };

          return {
            items: [...state.items.filter((item) => item.beatId !== beat.id), nextItem]
          };
        }),
      removeItem: (licenseId) =>
        set((state) => ({
          items: state.items.filter((item) => item.licenseId !== licenseId)
        })),
      clear: () => set({ items: [] })
    }),
    {
      name: "webbeat-cart"
    }
  )
);

export function getCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.priceThb, 0);
}
