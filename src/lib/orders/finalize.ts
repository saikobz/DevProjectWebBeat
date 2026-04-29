import { sendOrderEmail } from "@/lib/email/send";
import { generateLicensePdfBytes, getLicensePdfPath } from "@/lib/pdf/license-pdf";
import { getLicenseTierConfig } from "@/lib/license/terms";
import { uploadPrivateFile } from "@/lib/r2/signed-url";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type OrderItemRow = {
  id: string;
  order_id: string;
  beat_id: string | null;
  beat_slug: string;
  beat_title: string;
  license_tier: "basic" | "premium" | "trackout" | "exclusive";
  license_pdf_path: string | null;
};

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string | null;
  email: string;
};

function getDownloadPaths(item: OrderItemRow) {
  const paths = [`private/wav/${item.beat_slug}.wav`];

  if (item.license_tier === "trackout" || item.license_tier === "exclusive") {
    paths.push(`private/stems/${item.beat_slug}.zip`);
  }

  return paths;
}

export async function finalizePaidOrder(orderId: string, chargeId?: string) {
  const supabase = createServiceRoleClient();
  if (!supabase) return null;

  const paidAt = new Date().toISOString();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .update({
      status: "paid",
      paid_at: paidAt,
      omise_charge_id: chargeId
    })
    .eq("id", orderId)
    .select("id, order_number, customer_name, email")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Order not found");
  }

  const orderRow = order as OrderRow;
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, order_id, beat_id, beat_slug, beat_title, license_tier, license_pdf_path")
    .eq("order_id", orderId);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const itemRows = (items ?? []) as OrderItemRow[];

  for (const item of itemRows) {
    const licensePdfPath =
      item.license_pdf_path ??
      getLicensePdfPath(orderRow.order_number, {
        beatSlug: item.beat_slug,
        licenseTier: item.license_tier
      });
    const licensePdfBytes = generateLicensePdfBytes({
      orderNumber: orderRow.order_number,
      customerName: orderRow.customer_name ?? orderRow.email,
      email: orderRow.email,
      item: {
        beatSlug: item.beat_slug,
        beatTitle: item.beat_title,
        licenseTier: item.license_tier,
        licenseName: getLicenseTierConfig(item.license_tier).name
      }
    });
    await uploadPrivateFile(licensePdfPath, licensePdfBytes, "application/pdf");

    await supabase.from("order_items").update({ license_pdf_path: licensePdfPath }).eq("id", item.id);

    const { data: existingTokens } = await supabase.from("download_tokens").select("id").eq("order_item_id", item.id).limit(1);

    if (!existingTokens?.length) {
      const tokenRows = [...getDownloadPaths(item), licensePdfPath].map((filePath) => ({
        order_item_id: item.id,
        file_path: filePath
      }));

      await supabase.from("download_tokens").insert(tokenRows);
    }

    if (item.beat_id) {
      await supabase.rpc("increment_beat_sale_count", { beat_id_input: item.beat_id });
    }
  }

  await sendOrderEmail({
    email: orderRow.email,
    orderNumber: orderRow.order_number,
    orderId: orderRow.id
  });

  return orderRow;
}
