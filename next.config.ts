import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos"
      },
      {
        protocol: "https",
        hostname: "*.r2.dev"
      },
      {
        protocol: "https",
        hostname: "*.cloudflarestorage.com"
      }
    ]
  }
};

/**
 * Source map upload needs non-empty organization slug + project slug + auth token.
 * Per https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
 * those slugs are fixed strings from your Sentry URLs — set them at build time
 * (e.g. `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` on CI/Vercel).
 * Avoid passing `undefined` for org/project or the webpack plugin skips uploads silently.
 */
function sentryBuildOptions(): Parameters<typeof withSentryConfig>[1] {
  const base: Parameters<typeof withSentryConfig>[1] = {
    silent: !process.env.CI,
    widenClientFileUpload: false
  };

  const org = process.env.SENTRY_ORG?.trim();
  const project = process.env.SENTRY_PROJECT?.trim();
  const authToken = process.env.SENTRY_AUTH_TOKEN?.trim();

  if (authToken && org && project) {
    return {
      ...base,
      authToken,
      org,
      project
    };
  }

  return base;
}

export default withSentryConfig(nextConfig, sentryBuildOptions());
