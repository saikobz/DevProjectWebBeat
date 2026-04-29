export async function createDownloadUrl(path: string) {
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  return `/api/downloads/mock?path=${encodeURIComponent(path)}`;
}
