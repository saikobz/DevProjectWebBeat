import { expect, test } from "@playwright/test";

test.describe("critical flows", () => {
  test("login preserves next param across auth links and shows OAuth feedback", async ({ page }) => {
    await page.goto("/login?next=%2Forders&error=oauth");

    await expect(page.getByText(/Google sign-in ไม่สำเร็จ/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /ดำเนินการต่อด้วย Google/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /สมัครสมาชิก/i })).toHaveAttribute("href", "/register?next=%2Forders");
  });

  test("user can add to cart and finish checkout UI flow", async ({ page }) => {
    await page.route("**/api/checkout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          order: { id: "test-order-123" },
          charge: {}
        })
      });
    });

    await page.goto("/beats/dark-trap-140-cmin");
    await page.getByRole("button", { name: /ใส่ตะกร้า/i }).click();
    await page.getByRole("link", { name: /ไปตะกร้า/i }).click();

    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole("heading", { name: /สรุปยอด/i })).toBeVisible();

    await page.getByRole("link", { name: /ไปชำระเงิน/i }).click();
    await expect(page).toHaveURL(/\/checkout$/);

    await page.getByLabel(/ชื่อสำหรับออก License/i).fill("WebBeat Tester");
    await page.getByLabel(/อีเมลสำหรับรับไฟล์/i).fill("tester@example.com");
    await page.getByRole("button", { name: /^ชำระเงิน$/i }).click();

    await expect(page).toHaveURL(/\/checkout\/success\?order=test-order-123/);
    await expect(page.getByRole("heading", { level: 1, name: /รับคำสั่งซื้อแล้ว/i })).toBeVisible();
  });
});
