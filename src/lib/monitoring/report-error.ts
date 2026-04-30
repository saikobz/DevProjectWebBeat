import * as Sentry from "@sentry/nextjs";

export function reportError(error: unknown, context: string, extra?: Record<string, unknown>) {
  if (error instanceof Error) {
    Sentry.captureException(error, {
      tags: { context },
      extra
    });
    return;
  }

  Sentry.captureMessage(`${context}: non-Error exception`, {
    level: "error",
    extra: {
      thrown: error,
      ...extra
    }
  });
}
