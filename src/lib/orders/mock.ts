import { getLicenseTierConfig } from "@/lib/license/terms";
import type { CartItem, Order } from "@/types";

export function createServerMockOrder(customerName: string, email: string, items: CartItem[]): Order {
  const createdAt = new Date().toISOString();
  const orderNumber = `ORD-${createdAt.slice(0, 10).replaceAll("-", "")}-${String(Date.now()).slice(-4)}`;

  return {
    id: crypto.randomUUID(),
    orderNumber,
    customerName,
    email,
    status: "paid",
    totalThb: items.reduce((total, item) => total + item.priceThb, 0),
    items: items.map((item) => ({
      ...item,
      licensePdfPath: `licenses/${orderNumber}/${item.beatSlug}-${item.licenseTier}.pdf`,
      downloadLinks: [
        {
          label: getLicenseTierConfig(item.licenseTier).terms.stemsIncluded ? "WAV + Stems package" : "WAV package",
          url: `/api/downloads/mock?path=${encodeURIComponent(`private/wav/${item.beatSlug}.wav`)}`,
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        }
      ]
    })),
    createdAt,
    paidAt: createdAt
  };
}
