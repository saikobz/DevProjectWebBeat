/** Stable placeholder — avoids legacy Unsplash photo IDs that 404 through Next/Image optimizer. */
export function placeholderCoverForSlug(slug: string): string {
  return `https://picsum.photos/seed/webbeat-${slug}/900/900`;
}

/** Normalize rows loaded from DB (older seeds stored unsplash URLs that often break). */
export function resolveBeatCoverUrl(coverUrl: string | null | undefined, slug: string): string | undefined {
  const trimmed = coverUrl?.trim();
  if (!trimmed || trimmed.includes("images.unsplash.com")) {
    return placeholderCoverForSlug(slug);
  }
  return trimmed;
}
