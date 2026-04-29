import type { LicenseTier, OrderItem } from "@/types";

type LicensePdfItem = Pick<OrderItem, "beatSlug" | "licenseTier" | "beatTitle" | "licenseName">;

export function getLicensePdfPath(orderNumber: string, item: Pick<OrderItem, "beatSlug" | "licenseTier">) {
  return `licenses/${orderNumber}/${item.beatSlug}-${item.licenseTier}.pdf`;
}

export function getMockLicensePdfPath(orderNumber: string, item: OrderItem) {
  return getLicensePdfPath(orderNumber, item);
}

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

export function generateLicensePdfBytes(input: {
  orderNumber: string;
  customerName: string;
  email: string;
  item: LicensePdfItem;
}) {
  const lines = [
    "WebBeatTH License Agreement",
    `Order: ${input.orderNumber}`,
    `Customer: ${input.customerName}`,
    `Email: ${input.email}`,
    `Beat: ${input.item.beatTitle}`,
    `License: ${input.item.licenseName}`,
    `Tier: ${formatTier(input.item.licenseTier)}`,
    "This draft PDF is generated for MVP delivery and should be reviewed before production use."
  ];

  const text = lines.map((line, index) => `BT /F1 12 Tf 72 ${760 - index * 24} Td (${escapePdfText(line)}) Tj ET`).join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${text.length} >> stream\n${text}\nendstream endobj`
  ];

  const body = objects.join("\n");
  const pdf = `%PDF-1.4\n${body}\ntrailer << /Root 1 0 R >>\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

function formatTier(tier: LicenseTier) {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
