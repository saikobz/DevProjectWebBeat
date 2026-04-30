import { expect, test, type Page } from "@playwright/test";

/**
 * HTML routes from `next build` — smoke navigation + zero browser-level errors.
 * Protected routes (ไม่ login) ควร redirect ไป `/login` โดยไม่โยน exception ในเบราว์เซอร์
 */
const PUBLIC_PAGES = [
  "/",
  "/login",
  "/register",
  "/beats",
  "/beats/dark-trap-140-cmin",
  "/beats/rnb-late-night-92-amin",
  "/cart",
  "/checkout",
  "/checkout/success",
  "/free",
  "/terms",
  "/privacy",
  "/refund",
  "/auth/callback"
] as const;

const PROTECTED_PAGES = [
  "/library",
  "/orders",
  "/account",
  "/admin",
  "/admin/beats",
  "/admin/beats/new"
] as const;

async function collectNavigationIssues(page: Page, path: string) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
  });

  const response = await page.goto(path, { waitUntil: "load", timeout: 45_000 });
  await expect(page.locator("body")).toBeVisible({ timeout: 15_000 });

  const status = response?.status() ?? 0;
  return { consoleErrors, pageErrors, status };
}

test.describe("route health (public)", () => {
  for (const path of PUBLIC_PAGES) {
    test(`${path} loads — status OK, no console/page errors`, async ({ page }) => {
      const { consoleErrors, pageErrors, status } = await collectNavigationIssues(page, path);

      expect(status, `${path}: HTTP ${status}`).toBeGreaterThanOrEqual(200);
      expect(status, `${path}: HTTP ${status}`).toBeLessThan(400);
      expect.soft(consoleErrors, `[${path}] console.error:\n${consoleErrors.join("\n")}`).toEqual([]);
      expect.soft(pageErrors, `[${path}] pageerror:\n${pageErrors.join("\n")}`).toEqual([]);
    });
  }
});

test.describe("route health (protected — expect redirect to login)", () => {
  for (const path of PROTECTED_PAGES) {
    test(`${path} redirects cleanly — no browser errors`, async ({ page }) => {
      const { consoleErrors, pageErrors, status } = await collectNavigationIssues(page, path);

      expect(status, `${path}: final HTTP ${status}`).toBeGreaterThanOrEqual(200);
      expect(status, `${path}: final HTTP ${status}`).toBeLessThan(500);
      expect.soft(consoleErrors, `[${path}] console.error:\n${consoleErrors.join("\n")}`).toEqual([]);
      expect.soft(pageErrors, `[${path}] pageerror:\n${pageErrors.join("\n")}`).toEqual([]);
      await expect(page).toHaveURL(/\/login/);
    });
  }
});
