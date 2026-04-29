import { formatDuration, formatTHB } from "@/lib/format";
import type { Beat, BeatLicense, Order } from "@/types";

export const REQUIRED_LICENSE_PLACEHOLDERS = [
  "LICENSOR_NAME",
  "LICENSOR_LEGAL_NAME",
  "LICENSOR_EMAIL",
  "LICENSEE_NAME",
  "LICENSEE_EMAIL",
  "BEAT_TITLE",
  "BEAT_BPM",
  "BEAT_KEY",
  "BEAT_DURATION",
  "ORDER_NUMBER",
  "LICENSE_DATE",
  "LICENSE_PRICE",
  "LICENSE_ID",
  "SITE_URL",
  "PRODUCER_TAG"
] as const;

export type LicensePlaceholder = (typeof REQUIRED_LICENSE_PLACEHOLDERS)[number];
export type LicensePlaceholderMap = Record<LicensePlaceholder, string>;

type BuildPlaceholderInput = {
  beat: Beat;
  license: BeatLicense;
  order: Order;
  producer: {
    name: string;
    legalName: string;
    email: string;
    tag: string;
  };
  siteUrl: string;
};

export function buildLicensePlaceholderMap(input: BuildPlaceholderInput): LicensePlaceholderMap {
  return {
    LICENSOR_NAME: input.producer.name,
    LICENSOR_LEGAL_NAME: input.producer.legalName,
    LICENSOR_EMAIL: input.producer.email,
    LICENSEE_NAME: input.order.customerName,
    LICENSEE_EMAIL: input.order.email,
    BEAT_TITLE: input.beat.title,
    BEAT_BPM: input.beat.bpm.toString(),
    BEAT_KEY: input.beat.key,
    BEAT_DURATION: formatDuration(input.beat.durationSec),
    ORDER_NUMBER: input.order.orderNumber,
    LICENSE_DATE: new Intl.DateTimeFormat("th-TH", { dateStyle: "long" }).format(new Date(input.order.paidAt ?? input.order.createdAt)),
    LICENSE_PRICE: formatTHB(input.license.priceThb),
    LICENSE_ID: input.license.id,
    SITE_URL: input.siteUrl,
    PRODUCER_TAG: input.producer.tag
  };
}

export function findMissingPlaceholders(template: string) {
  return REQUIRED_LICENSE_PLACEHOLDERS.filter((placeholder) => !template.includes(`{{${placeholder}}}`));
}

export function renderLicenseTemplate(template: string, placeholders: LicensePlaceholderMap) {
  return REQUIRED_LICENSE_PLACEHOLDERS.reduce(
    (content, placeholder) => content.replaceAll(`{{${placeholder}}}`, placeholders[placeholder]),
    template
  );
}
