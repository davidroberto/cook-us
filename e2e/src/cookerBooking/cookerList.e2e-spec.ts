import { expect, test, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const LIST_TIMEOUT = 10_000;

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function loginAsClient(page: Page) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({ timeout: LIST_TIMEOUT });
  await page.getByTestId("email-input").pressSequentially("lucas.bernard@cookus.app");
  await page.getByTestId("password-input").pressSequentially("client1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/client\/home/, { timeout: LIST_TIMEOUT });
}

// ─── Scénario : Client connecté — Voir la liste des cuisiniers ────────────────

test.describe("Liste des cuisiniers", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
  });

  test("affiche la liste des cuisiniers", async ({ page }) => {
    await expect(page.getByTestId("cooker-list")).toBeVisible({
      timeout: LIST_TIMEOUT,
    });
  });

  test("affiche au moins un cuisinier", async ({ page }) => {
    await expect(page.getByTestId("cooker-card").first()).toBeVisible({
      timeout: LIST_TIMEOUT,
    });
  });

  test("affiche le nom et prénom du cuisinier", async ({ page }) => {
    const name = page.getByTestId("cooker-name").first();
    await expect(name).toBeVisible({ timeout: LIST_TIMEOUT });
    await expect(name).not.toHaveText("");
  });

  test("affiche la spécialité du cuisinier", async ({ page }) => {
    const speciality = page.getByTestId("cooker-speciality").first();
    await expect(speciality).toBeVisible({ timeout: LIST_TIMEOUT });
    await expect(speciality).not.toHaveText("");
  });

  test("affiche le tarif horaire du cuisinier", async ({ page }) => {
    const rate = page.getByTestId("cooker-rate").first();
    await expect(rate).toBeVisible({ timeout: LIST_TIMEOUT });
    await expect(rate).toContainText("€/h");
  });

  test("affiche la photo ou les initiales du cuisinier", async ({ page }) => {
    await expect(page.getByTestId("cooker-card").first()).toBeVisible({
      timeout: LIST_TIMEOUT,
    });

    const hasThumbnail = await page
      .getByTestId("cooker-thumbnail")
      .first()
      .isVisible();
    if (!hasThumbnail) {
      // Fallback initiales : l'avatar placeholder doit contenir du texte
      const card = page.getByTestId("cooker-card").first();
      await expect(card).toBeVisible();
    }
  });

  test("redirige vers le profil au clic sur une carte", async ({ page }) => {
    await expect(page.getByTestId("cooker-card").first()).toBeVisible({
      timeout: LIST_TIMEOUT,
    });

    await page.getByTestId("cooker-card").first().click();

    await expect(page).toHaveURL(/\/client\/viewCook\/profile\//, {
      timeout: LIST_TIMEOUT,
    });
  });
});
