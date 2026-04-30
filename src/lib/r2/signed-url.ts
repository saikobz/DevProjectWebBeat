import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function createR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
}

export async function createDownloadUrl(path: string) {
  const privateBucket = process.env.R2_PRIVATE_BUCKET;
  const client = createR2Client();

  if (client && privateBucket) {
    return getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: privateBucket,
        Key: path.replace(/^\//, "")
      }),
      { expiresIn: 60 * 10 }
    );
  }

  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  return `/api/downloads/mock?path=${encodeURIComponent(path)}`;
}

export async function uploadPrivateFile(path: string, body: Uint8Array, contentType: string) {
  const privateBucket = process.env.R2_PRIVATE_BUCKET;
  const client = createR2Client();

  if (!client || !privateBucket) {
    return { skipped: true, reason: "R2 private bucket is not configured" };
  }

  await client.send(
    new PutObjectCommand({
      Bucket: privateBucket,
      Key: path.replace(/^\//, ""),
      Body: body,
      ContentType: contentType
    })
  );

  return { skipped: false, path };
}

export type BeatUploadScope = "preview" | "wav" | "stems";

/** Presigned PUT สำหรับอัปโหลดจากเบราว์เซอร์ไปยัง R2 (แบบไม่ผ่านเซิร์ฟเวอร์รับไฟล์เต็ม). */
export async function createPresignedPutForBeatUpload(scope: BeatUploadScope, fileName: string, contentType: string) {
  const client = createR2Client();
  if (!client) {
    return { ok: false as const, error: "R2 credentials are not configured" };
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 160);
  const id = crypto.randomUUID();

  if (scope === "preview") {
    const publicBucket = process.env.R2_PUBLIC_BUCKET;
    if (!publicBucket) {
      return { ok: false as const, error: "R2_PUBLIC_BUCKET is not configured" };
    }
    const key = `public/previews/${id}-${safeName}`;
    const putUrl = await getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: publicBucket,
        Key: key,
        ContentType: contentType
      }),
      { expiresIn: 60 * 15 }
    );
    const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
    const publicUrl = base ? `${base}/${key}` : undefined;
    return { ok: true as const, putUrl, key, publicUrl };
  }

  const privateBucket = process.env.R2_PRIVATE_BUCKET;
  if (!privateBucket) {
    return { ok: false as const, error: "R2_PRIVATE_BUCKET is not configured" };
  }

  const folder = scope === "wav" ? "private/wav" : "private/stems";
  const key = `${folder}/${id}-${safeName}`;
  const putUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: privateBucket,
      Key: key,
      ContentType: contentType
    }),
    { expiresIn: 60 * 15 }
  );

  return { ok: true as const, putUrl, key, publicUrl: undefined };
}

const ALLOWED_PUT_TYPES: Record<BeatUploadScope, readonly string[]> = {
  preview: ["audio/mpeg", "audio/mp3", "audio/wav"],
  wav: ["audio/wav", "audio/x-wav"],
  stems: ["application/zip", "application/x-zip-compressed"]
};

export function isAllowedBeatUploadContentType(scope: BeatUploadScope, contentType: string) {
  return ALLOWED_PUT_TYPES[scope].includes(contentType);
}
