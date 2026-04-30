import type { MetadataRoute } from "next";
import { getPublishedBeats } from "@/lib/data/beats";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const beats = await getPublishedBeats();

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/beats`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/refund`, lastModified: new Date() },
    ...beats.map((beat) => ({
      url: `${baseUrl}/beats/${beat.slug}`,
      lastModified: new Date(beat.publishedAt)
    }))
  ];
}
