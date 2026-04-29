import { getLicenseTierConfig } from "@/lib/license/terms";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { Order, OrderItem } from "@/types";

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string | null;
  email: string;
  status: Order["status"];
  total_thb: number;
  created_at: string;
  paid_at: string | null;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  beat_id: string | null;
  license_id: string | null;
  beat_title: string;
  beat_slug: string;
  license_tier: OrderItem["licenseTier"];
  price_thb: number;
  license_pdf_path: string | null;
};

type DownloadTokenRow = {
  order_item_id: string;
  token: string;
  file_path: string;
  expires_at: string;
};

export async function getOrderById(orderId: string) {
  const orders = await getOrders({ orderId });
  return orders[0] ?? null;
}

export async function getOrdersForUser(userId: string, paidOnly = false) {
  return getOrders({ userId, paidOnly });
}

async function getOrders(filters: { userId?: string; orderId?: string; paidOnly?: boolean }) {
  const supabase = createServiceRoleClient();
  if (!supabase) return [];

  let query = supabase
    .from("orders")
    .select("id, order_number, customer_name, email, status, total_thb, created_at, paid_at")
    .order("created_at", { ascending: false });

  if (filters.userId) query = query.eq("user_id", filters.userId);
  if (filters.orderId) query = query.eq("id", filters.orderId);
  if (filters.paidOnly) query = query.eq("status", "paid");

  const { data: orders, error } = await query;
  if (error || !orders?.length) return [];

  const orderRows = orders as OrderRow[];
  const orderIds = orderRows.map((order) => order.id);
  const { data: items } = await supabase
    .from("order_items")
    .select("id, order_id, beat_id, license_id, beat_title, beat_slug, license_tier, price_thb, license_pdf_path")
    .in("order_id", orderIds);

  const itemRows = (items ?? []) as OrderItemRow[];
  const itemIds = itemRows.map((item) => item.id);
  const { data: tokens } = itemIds.length
    ? await supabase.from("download_tokens").select("order_item_id, token, file_path, expires_at").in("order_item_id", itemIds)
    : { data: [] };

  const tokenRows = (tokens ?? []) as DownloadTokenRow[];

  return Promise.all(
    orderRows.map(async (order) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name ?? order.email,
      email: order.email,
      status: order.status,
      totalThb: order.total_thb,
      createdAt: order.created_at,
      paidAt: order.paid_at ?? undefined,
      items: mapOrderItems(
        itemRows.filter((item) => item.order_id === order.id),
        tokenRows
      )
    }))
  );
}

function mapOrderItems(items: OrderItemRow[], tokens: DownloadTokenRow[]) {
  return items.map((item) => {
    const config = getLicenseTierConfig(item.license_tier);
    return {
      beatId: item.beat_id ?? "",
      beatSlug: item.beat_slug,
      beatTitle: item.beat_title,
      licenseId: item.license_id ?? item.id,
      licenseTier: item.license_tier,
      licenseName: config.name,
      priceThb: item.price_thb,
      licensePdfPath: item.license_pdf_path ?? undefined,
      downloadLinks: tokens
        .filter((token) => token.order_item_id === item.id)
        .map((token) => ({
          label: getDownloadLabel(token.file_path),
          url: `/api/downloads/mock?token=${encodeURIComponent(token.token)}`,
          expiresAt: token.expires_at
        }))
    };
  });
}

function getDownloadLabel(path: string) {
  if (path.endsWith(".pdf")) return "License PDF";
  if (path.endsWith(".zip")) return "Stems ZIP";
  if (path.endsWith(".wav")) return "WAV";
  return "Download";
}
