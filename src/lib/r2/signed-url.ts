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
