import type { OrderItem } from "@/types";

export function getMockLicensePdfPath(orderNumber: string, item: OrderItem) {
  return `licenses/${orderNumber}/${item.beatSlug}-${item.licenseTier}.pdf`;
}
