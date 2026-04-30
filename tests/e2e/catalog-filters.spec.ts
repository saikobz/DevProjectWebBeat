import { expect, test } from "@playwright/test";

test.describe("browse filters", () => {
  test("genre, BPM, and key filters narrow the catalog", async ({ page }) => {
    await page.goto("/beats?genre=trap&bpmMin=138&bpmMax=141&key=minor");

    await expect(page.getByRole("heading", { level: 1, name: /beats ทั้งหมด/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Midnight Trap" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Afterhours Phonk" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Smoke Signals" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Bangkok Drill" })).toHaveCount(0);
  });

  test("sales sort prioritizes top-selling beats and clear filters resets state", async ({ page }) => {
    await page.goto("/beats?genre=trap&sort=sales");

    const firstBeatLink = page.locator("main").locator('a[href^="/beats/"]').first();
    await expect(firstBeatLink).toHaveText("Smoke Signals");

    await page.getByRole("link", { name: /ล้างตัวกรอง/i }).click();
    await expect(page).toHaveURL(/\/beats$/);
  });
});
