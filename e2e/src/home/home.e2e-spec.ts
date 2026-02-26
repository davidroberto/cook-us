import { test, expect } from '@playwright/test';

test("should display cook'us on the home page", async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText("cook'us")).toBeVisible();
});
