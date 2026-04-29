import type { MetadataRoute } from "next";
import { getPublishedBeats } from "@/lib/data/mock-beats";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/beats`, lastModified: new Date() },
    ...getPublishedBeats().map((beat) => ({
      url: `${baseUrl}/beats/${beat.slug}`,
      lastModified: new Date(beat.publishedAt)
    }))
  ];
}
