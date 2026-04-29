import { NextResponse } from "next/server";
import { createMockCharge } from "@/lib/omise/create-charge";

export async function POST(request: Request) {
  const body = (await request.json()) as { orderId?: string; amountThb?: number; email?: string };

  if (!body.orderId || !body.amountThb || !body.email) {
    return NextResponse.json({ error: "orderId, amountThb and email are required" }, { status: 400 });
  }

  const charge = await createMockCharge({
    orderId: body.orderId,
    amountThb: body.amountThb,
    email: body.email
  });

  return NextResponse.json({ charge });
}
