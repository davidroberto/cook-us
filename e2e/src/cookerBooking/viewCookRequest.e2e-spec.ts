import { expect, test, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const TIMEOUT = 10_000;

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function loginAsCook(page: Page) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({ timeout: TIMEOUT });
  await page.getByTestId("email-input").pressSequentially("pierre.martin@cookus.app");
  await page.getByTestId("password-input").pressSequentially("cook1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/cook\/home/, { timeout: TIMEOUT });
}

// ─── Navigation helper ────────────────────────────────────────────────────────

async function navigateToFirstCookRequest(page: Page) {
  await page.goto(`${MOBILE_URL}/cook/messages`);
  await expect(page.getByTestId("conversation-item").first()).toBeVisible({
    timeout: TIMEOUT,
  });
  await page.getByTestId("conversation-item").first().click();
  await expect(page).toHaveURL(/\/cook\/messaging\//, { timeout: TIMEOUT });
}

// ─── Scénario : Cuisinier connecté — Voir les infos d'une demande client ─────

test.describe("Voir les infos d'une demande client", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCook(page);
    await navigateToFirstCookRequest(page);
  });

  test("affiche la carte de demande reçue", async ({ page }) => {
    await expect(page.getByTestId("request-summary-card").first()).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  test("affiche la date de la demande", async ({ page }) => {
    const date = page.getByTestId("request-date").first();
    await expect(date).toBeVisible({ timeout: TIMEOUT });
    await expect(date).not.toHaveText("");
  });

  test("affiche le nombre de convives", async ({ page }) => {
    const guests = page.getByTestId("request-guests").first();
    await expect(guests).toBeVisible({ timeout: TIMEOUT });
    await expect(guests).not.toHaveText("");
  });

  test("affiche le type de repas", async ({ page }) => {
    const mealType = page.getByTestId("request-meal-type").first();
    await expect(mealType).toBeVisible({ timeout: TIMEOUT });
    await expect(mealType).not.toHaveText("");
  });

  test("affiche le message du client si présent", async ({ page }) => {
    const messageEl = page.getByTestId("request-message").first();
    const count = await page.getByTestId("request-message").count();
    if (count > 0) {
      await expect(messageEl).toBeVisible({ timeout: TIMEOUT });
      await expect(messageEl).not.toHaveText("");
    }
  });
});
