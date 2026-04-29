import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/auth/admin-api";
import { mockBeats } from "@/lib/data/mock-beats";

export async function GET() {
  const { serviceRole, error } = await getAdminApiContext();
  if (error) return error;

  if (!serviceRole) {
    return NextResponse.json({
      beats: mockBeats.length,
      published: mockBeats.filter((beat) => beat.status === "published").length,
      sales: mockBeats.reduce((total, beat) => total + beat.saleCount, 0),
      revenueThb: mockBeats.reduce((total, beat) => total + beat.saleCount * Math.min(...beat.licenses.map((license) => license.priceThb)), 0)
    });
  }

  const [{ count: beats }, { count: published }, { data: paidOrders }, { data: paidItems }] = await Promise.all([
    serviceRole.from("beats").select("id", { count: "exact", head: true }),
    serviceRole.from("beats").select("id", { count: "exact", head: true }).eq("status", "published"),
    serviceRole.from("orders").select("id").eq("status", "paid"),
    serviceRole.from("order_items").select("price_thb, orders!inner(status)").eq("orders.status", "paid")
  ]);

  return NextResponse.json({
    beats: beats ?? 0,
    published: published ?? 0,
    sales: paidOrders?.length ?? 0,
    revenueThb: paidItems?.reduce((total, item) => total + Number(item.price_thb), 0) ?? 0
  });
}
