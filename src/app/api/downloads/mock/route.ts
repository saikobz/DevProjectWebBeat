import { NextResponse } from "next/server";
import { getLicenseTierConfig } from "@/lib/license/terms";
import { generateLicensePdfBytes } from "@/lib/pdf/license-pdf";
import { createDownloadUrl } from "@/lib/r2/signed-url";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type DownloadTokenRow = {
  id: string;
  order_item_id: string;
  file_path: string;
  expires_at: string;
  max_downloads: number;
  download_count: number;
};

type DownloadOrderItemRow = {
  beat_slug: string;
  beat_title: string;
  license_tier: "basic" | "premium" | "trackout" | "exclusive";
  orders:
    | {
        order_number: string;
        customer_name: string | null;
        email: string;
      }
    | Array<{
        order_number: string;
        customer_name: string | null;
        email: string;
      }>;
};

function createMockDownloadResponse(filePath: string) {
  const filename = `${filePath.split("/").pop() || "download"}.txt`;

  return new NextResponse(`Mock download for ${filePath}\nConfigure R2 env to serve the real file.\n`, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}

function createBinaryResponse(bytes: Uint8Array, filename: string, contentType: string) {
  const body = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(body).set(bytes);

  return new NextResponse(body, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": contentType
    }
  });
}

function createSilentWavResponse(filePath: string) {
  const sampleRate = 44100;
  const channels = 1;
  const bitsPerSample = 16;
  const seconds = 1;
  const dataSize = sampleRate * channels * (bitsPerSample / 8) * seconds;
  const bytes = new Uint8Array(44 + dataSize);
  const view = new DataView(bytes.buffer);

  writeAscii(bytes, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(bytes, 8, "WAVE");
  writeAscii(bytes, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * (bitsPerSample / 8), true);
  view.setUint16(32, channels * (bitsPerSample / 8), true);
  view.setUint16(34, bitsPerSample, true);
  writeAscii(bytes, 36, "data");
  view.setUint32(40, dataSize, true);

  return createBinaryResponse(bytes, filePath.split("/").pop() || "mock.wav", "audio/wav");
}

function createMockZipResponse(filePath: string) {
  const readme = new TextEncoder().encode(
    `Mock stems archive for ${filePath}\nConfigure R2 env and upload stems to serve the real ZIP.\n`
  );
  const filename = "README.txt";
  const filenameBytes = new TextEncoder().encode(filename);
  const crc = crc32(readme);
  const localHeaderSize = 30 + filenameBytes.length;
  const centralHeaderSize = 46 + filenameBytes.length;
  const bytes = new Uint8Array(localHeaderSize + readme.length + centralHeaderSize + 22);
  const view = new DataView(bytes.buffer);
  let offset = 0;

  view.setUint32(offset, 0x04034b50, true);
  view.setUint16(offset + 4, 20, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, 0, true);
  view.setUint16(offset + 10, 0, true);
  view.setUint16(offset + 12, 0, true);
  view.setUint32(offset + 14, crc, true);
  view.setUint32(offset + 18, readme.length, true);
  view.setUint32(offset + 22, readme.length, true);
  view.setUint16(offset + 26, filenameBytes.length, true);
  view.setUint16(offset + 28, 0, true);
  bytes.set(filenameBytes, offset + 30);
  offset += localHeaderSize;
  bytes.set(readme, offset);
  offset += readme.length;

  const centralDirectoryOffset = offset;
  view.setUint32(offset, 0x02014b50, true);
  view.setUint16(offset + 4, 20, true);
  view.setUint16(offset + 6, 20, true);
  view.setUint16(offset + 8, 0, true);
  view.setUint16(offset + 10, 0, true);
  view.setUint16(offset + 12, 0, true);
  view.setUint16(offset + 14, 0, true);
  view.setUint32(offset + 16, crc, true);
  view.setUint32(offset + 20, readme.length, true);
  view.setUint32(offset + 24, readme.length, true);
  view.setUint16(offset + 28, filenameBytes.length, true);
  view.setUint16(offset + 30, 0, true);
  view.setUint16(offset + 32, 0, true);
  view.setUint16(offset + 34, 0, true);
  view.setUint16(offset + 36, 0, true);
  view.setUint32(offset + 38, 0, true);
  view.setUint32(offset + 42, 0, true);
  bytes.set(filenameBytes, offset + 46);
  offset += centralHeaderSize;

  view.setUint32(offset, 0x06054b50, true);
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, 1, true);
  view.setUint16(offset + 10, 1, true);
  view.setUint32(offset + 12, centralHeaderSize, true);
  view.setUint32(offset + 16, centralDirectoryOffset, true);
  view.setUint16(offset + 20, 0, true);

  return createBinaryResponse(bytes, filePath.split("/").pop() || "mock.zip", "application/zip");
}

async function createLicensePdfResponse(filePath: string, tokenRow: DownloadTokenRow, supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>) {
  const { data, error } = await supabase
    .from("order_items")
    .select("beat_slug, beat_title, license_tier, orders!inner(order_number, customer_name, email)")
    .eq("id", tokenRow.order_item_id)
    .single();

  if (error || !data) {
    return createMockDownloadResponse(filePath);
  }

  const item = data as unknown as DownloadOrderItemRow;
  const order = Array.isArray(item.orders) ? item.orders[0] : item.orders;
  const bytes = generateLicensePdfBytes({
    orderNumber: order.order_number,
    customerName: order.customer_name ?? order.email,
    email: order.email,
    item: {
      beatSlug: item.beat_slug,
      beatTitle: item.beat_title,
      licenseTier: item.license_tier,
      licenseName: getLicenseTierConfig(item.license_tier).name
    }
  });

  return createBinaryResponse(bytes, filePath.split("/").pop() || "license.pdf", "application/pdf");
}

async function createDownloadResponse(filePath: string, requestUrl: string) {
  const downloadUrl = await createDownloadUrl(filePath);

  if (downloadUrl.startsWith("http://") || downloadUrl.startsWith("https://")) {
    return NextResponse.redirect(downloadUrl);
  }

  const targetUrl = new URL(downloadUrl, requestUrl);
  const currentUrl = new URL(requestUrl);

  if (targetUrl.pathname === currentUrl.pathname) {
    return createMockDownloadResponse(filePath);
  }

  return NextResponse.redirect(targetUrl);
}

async function createTokenDownloadResponse(
  tokenRow: DownloadTokenRow,
  requestUrl: string,
  supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>
) {
  const downloadUrl = await createDownloadUrl(tokenRow.file_path);

  if (downloadUrl.startsWith("http://") || downloadUrl.startsWith("https://")) {
    return NextResponse.redirect(downloadUrl);
  }

  if (tokenRow.file_path.endsWith(".pdf")) return createLicensePdfResponse(tokenRow.file_path, tokenRow, supabase);
  if (tokenRow.file_path.endsWith(".wav")) return createSilentWavResponse(tokenRow.file_path);
  if (tokenRow.file_path.endsWith(".zip")) return createMockZipResponse(tokenRow.file_path);

  return createDownloadResponse(tokenRow.file_path, requestUrl);
}

function writeAscii(bytes: Uint8Array, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    bytes[offset + index] = value.charCodeAt(index);
  }
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token) {
    const supabase = createServiceRoleClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase service role is not configured" }, { status: 503 });
    }

    const { data, error } = await supabase
      .from("download_tokens")
      .select("id, order_item_id, file_path, expires_at, max_downloads, download_count")
      .eq("token", token)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Download token not found" }, { status: 404 });
    }

    const expiresAt = new Date(data.expires_at).getTime();
    if (expiresAt < Date.now()) {
      return NextResponse.json({ error: "Download token expired" }, { status: 410 });
    }

    if (data.download_count >= data.max_downloads) {
      return NextResponse.json({ error: "Download limit reached" }, { status: 429 });
    }

    await supabase
      .from("download_tokens")
      .update({ download_count: data.download_count + 1 })
      .eq("id", data.id);

    return createTokenDownloadResponse(data as DownloadTokenRow, request.url, supabase);
  }

  const path = url.searchParams.get("path");
  if (path) {
    return createDownloadResponse(path, request.url);
  }

  return NextResponse.json({ error: "token or path is required" }, { status: 400 });
}
