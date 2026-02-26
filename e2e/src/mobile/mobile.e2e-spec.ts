import { test, expect } from '@playwright/test';

test("should display cook'us on the mobile web version", async ({ page }) => {
  await page.goto('http://localhost:8081/');
  await expect(page.getByText("cook'us")).toBeVisible({ timeout: 15000 });
});
