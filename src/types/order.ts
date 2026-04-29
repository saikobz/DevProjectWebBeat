import type { LicenseTier } from "./license";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export type CartItem = {
  beatId: string;
  beatSlug: string;
  beatTitle: string;
  licenseId: string;
  licenseTier: LicenseTier;
  licenseName: string;
  priceThb: number;
};

export type OrderItem = CartItem & {
  licensePdfPath?: string;
  downloadLinks?: Array<{
    label: string;
    url: string;
    expiresAt: string;
  }>;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  status: OrderStatus;
  totalThb: number;
  items: OrderItem[];
  createdAt: string;
  paidAt?: string;
};
