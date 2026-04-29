import { NextResponse } from "next/server";
import { createCharge } from "@/lib/omise/create-charge";
import { createServerMockOrder } from "@/lib/orders/mock";
import { finalizePaidOrder } from "@/lib/orders/finalize";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/types";

type CheckoutBeatRow = {
  id: string;
  slug: string;
  title: string;
  wav_path: string;
  stems_path: string | null;
};

type CheckoutLicenseRow = {
  id: string;
  beat_id: string;
  tier: CartItem["licenseTier"];
  price_thb: number;
  terms: Record<string, unknown>;
  beats: CheckoutBeatRow | CheckoutBeatRow[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as { customerName?: string; email?: string; items?: CartItem[] };
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!body.customerName || !body.email || !body.items?.length) {
    return NextResponse.json({ error: "customerName, email and items are required" }, { status: 400 });
  }

  const serviceRole = createServiceRoleClient();

  if (!serviceRole) {
    const order = createServerMockOrder(body.customerName, body.email, body.items);
    const charge = await createCharge({
      orderId: order.id,
      amountThb: order.totalThb,
      email: body.email
    });

    return NextResponse.json({ charge, order, mode: "mock" });
  }

  const serverClient = await createClient();
  const {
    data: { user }
  } = serverClient ? await serverClient.auth.getUser() : { data: { user: null } };

  const licenseIds = body.items.map((item) => item.licenseId);
  const licenseIdsLookUuid = licenseIds.map((id) => uuidPattern.test(id));
  let licenseRows: CheckoutLicenseRow[];

  if (licenseIdsLookUuid.every(Boolean)) {
    const { data: licenses, error: licensesError } = await serviceRole
      .from("beat_licenses")
      .select("id, beat_id, tier, price_thb, terms, beats(id, slug, title, wav_path, stems_path)")
      .in("id", licenseIds)
      .eq("is_available", true);

    if (licensesError || !licenses?.length) {
      return NextResponse.json({ error: licensesError?.message ?? "No available licenses found" }, { status: 400 });
    }

    licenseRows = licenses as unknown as CheckoutLicenseRow[];
  } else {
    const beatSlugs = [...new Set(body.items.map((item) => item.beatSlug))];
    const licenseTiers = [...new Set(body.items.map((item) => item.licenseTier))];
    const { data: beats, error: beatsError } = await serviceRole
      .from("beats")
      .select("id, slug, title, wav_path, stems_path")
      .in("slug", beatSlugs);

    if (beatsError || !beats?.length) {
      return NextResponse.json({ error: beatsError?.message ?? "No beats found for cart items" }, { status: 400 });
    }

    const beatRows = beats as CheckoutBeatRow[];
    const beatBySlug = new Map(beatRows.map((beat) => [beat.slug, beat]));
    const { data: licenses, error: licensesError } = await serviceRole
      .from("beat_licenses")
      .select("id, beat_id, tier, price_thb, terms")
      .in(
        "beat_id",
        beatRows.map((beat) => beat.id)
      )
      .in("tier", licenseTiers)
      .eq("is_available", true);

    if (licensesError || !licenses?.length) {
      return NextResponse.json({ error: licensesError?.message ?? "No available licenses found for cart items" }, { status: 400 });
    }

    const licenseByBeatAndTier = new Map(
      (licenses as Array<Omit<CheckoutLicenseRow, "beats">>).map((license) => [`${license.beat_id}:${license.tier}`, license])
    );

    const resolvedLicenseRows: CheckoutLicenseRow[] = [];
    const missingItems: string[] = [];

    body.items.forEach((item) => {
      const beat = beatBySlug.get(item.beatSlug);
      const license = beat ? licenseByBeatAndTier.get(`${beat.id}:${item.licenseTier}`) : undefined;

      if (!beat || !license) {
        missingItems.push(`${item.beatSlug}:${item.licenseTier}`);
        return;
      }

      resolvedLicenseRows.push({
        ...license,
        beats: beat
      });
    });

    if (missingItems.length > 0) {
      return NextResponse.json({ error: `No available licenses found for: ${missingItems.join(", ")}` }, { status: 400 });
    }

    licenseRows = resolvedLicenseRows;
  }

  const totalThb = licenseRows.reduce((total, license) => total + license.price_thb, 0);
  const { data: order, error: orderError } = await serviceRole
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      email: body.email,
      customer_name: body.customerName,
      total_thb: totalThb,
      status: "pending",
      payment_method: process.env.OMISE_SECRET_KEY ? "promptpay" : "mock"
    })
    .select("id, order_number, email, customer_name, total_thb, status, created_at")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? "Could not create order" }, { status: 500 });
  }

  const orderItems = licenseRows.map((license) => {
    const beat = Array.isArray(license.beats) ? license.beats[0] : license.beats;

    return {
      order_id: order.id,
      beat_id: license.beat_id,
      license_id: license.id,
      beat_title: beat.title,
      beat_slug: beat.slug,
      license_tier: license.tier,
      license_terms: license.terms,
      price_thb: license.price_thb
    };
  });

  const { error: itemsError } = await serviceRole.from("order_items").insert(orderItems);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  const charge = await createCharge({
    orderId: order.id,
    amountThb: totalThb,
    email: body.email,
    returnUrl: `/checkout/success?order=${order.id}`
  });

  if (!process.env.OMISE_SECRET_KEY) {
    await finalizePaidOrder(order.id, charge.id);
  } else {
    await serviceRole.from("orders").update({ omise_charge_id: charge.id }).eq("id", order.id);
  }

  return NextResponse.json({
    charge,
    order: {
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      email: order.email,
      status: process.env.OMISE_SECRET_KEY ? order.status : "paid",
      totalThb,
      items: body.items,
      createdAt: order.created_at
    }
  });
}
