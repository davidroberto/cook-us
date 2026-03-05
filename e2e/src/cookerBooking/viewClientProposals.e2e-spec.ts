import { expect, test, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const TIMEOUT = 10_000;

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function loginAsClient(page: Page) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({ timeout: TIMEOUT });
  await page.getByTestId("email-input").pressSequentially("lucas.bernard@cookus.app");
  await page.getByTestId("password-input").pressSequentially("client1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/client\/home/, { timeout: TIMEOUT });
}

// ─── Scénario : Client — Voir ses propositions envoyées ──────────────────────

test.describe("Voir l'état de mes propositions", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`${MOBILE_URL}/client/orderHistory`);
    await expect(page.getByTestId("order-item").first()).toBeVisible({ timeout: TIMEOUT });
  });

  test("affiche la liste des propositions", async ({ page }) => {
    await expect(page.getByTestId("order-item").first()).toBeVisible({ timeout: TIMEOUT });
  });

  test("affiche le nom du cuisinier", async ({ page }) => {
    const cookName = page.getByTestId("order-cook-name").first();
    await expect(cookName).toBeVisible({ timeout: TIMEOUT });
    await expect(cookName).not.toHaveText("");
  });

  test("affiche la date de la proposition", async ({ page }) => {
    const date = page.getByTestId("order-date").first();
    await expect(date).toBeVisible({ timeout: TIMEOUT });
    await expect(date).not.toHaveText("");
  });

  test("affiche le nombre de convives", async ({ page }) => {
    const guests = page.getByTestId("order-guests").first();
    await expect(guests).toBeVisible({ timeout: TIMEOUT });
    await expect(guests).not.toHaveText("");
  });

  test("affiche le type de repas", async ({ page }) => {
    const mealType = page.getByTestId("order-meal-type").first();
    await expect(mealType).toBeVisible({ timeout: TIMEOUT });
    await expect(mealType).not.toHaveText("");
  });

  test("affiche le statut de la proposition", async ({ page }) => {
    const status = page.getByTestId("order-status").first();
    await expect(status).toBeVisible({ timeout: TIMEOUT });
    const validStatuses = ["En attente", "Acceptée", "Refusée", "Annulée"];
    const statusText = await status.textContent();
    expect(validStatuses).toContain(statusText);
  });
});
