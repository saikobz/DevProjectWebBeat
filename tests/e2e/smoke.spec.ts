import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("หน้าแรกและ browse beats", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /ซื้อบีทไทย/i })).toBeVisible();

    await page.goto("/beats");
    await expect(page.getByRole("heading", { level: 1, name: /beats ทั้งหมด/i })).toBeVisible();
  });

  test("หน้า legal", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { level: 1, name: /ข้อกำหนดการใช้บริการ/i })).toBeVisible();

    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1, name: /นโยบายความเป็นส่วนตัว/i })).toBeVisible();

    await page.goto("/refund");
    await expect(page.getByRole("heading", { level: 1, name: /นโยบายการคืนเงิน/i })).toBeVisible();
  });

  test("beat detail พร้อม waveform section", async ({ page }) => {
    await page.goto("/beats/dark-trap-140-cmin");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByTestId("beat-waveform")).toBeVisible();
    await expect(page.getByLabel(/waveform preview/i)).toBeVisible();
  });
});
