import { NextResponse } from "next/server";
import { finalizePaidOrder } from "@/lib/orders/finalize";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type OmiseWebhookPayload = {
  key?: string;
  data?: {
    id?: string;
    status?: string;
    paid?: boolean;
    metadata?: {
      order_id?: string;
    };
  };
};

export async function POST(request: Request) {
  const payload = (await request.json()) as OmiseWebhookPayload;
  const charge = payload.data;
  const orderId = charge?.metadata?.order_id;

  if (!orderId || !charge?.id) {
    return NextResponse.json({ error: "Missing order metadata" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured" }, { status: 503 });
  }

  if (charge.paid || charge.status === "successful") {
    const order = await finalizePaidOrder(orderId, charge.id);
    return NextResponse.json({ ok: true, order });
  }

  if (charge.status === "failed" || charge.status === "expired") {
    await supabase.from("orders").update({ status: "failed", omise_charge_id: charge.id }).eq("id", orderId);
    return NextResponse.json({ ok: true, status: "failed" });
  }

  return NextResponse.json({ ok: true, status: charge.status ?? "ignored" });
}
