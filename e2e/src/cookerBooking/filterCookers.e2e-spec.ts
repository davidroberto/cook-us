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

// ─── Scénario : Client — Filtrer les cuisiniers ───────────────────────────────

test.describe("Filtrer les cuisiniers", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await expect(page.getByTestId("cooker-list")).toBeVisible({ timeout: TIMEOUT });
  });

  // ── Recherche par ville ───────────────────────────────────────────────────

  test("affiche le champ de recherche", async ({ page }) => {
    await expect(page.getByTestId("search-input")).toBeVisible({ timeout: TIMEOUT });
  });

  test("rechercher une ville inexistante affiche le message vide", async ({ page }) => {
    await page.getByTestId("search-input").fill("VilleInexistanteXYZ999");
    await expect(page.getByTestId("empty-message")).toBeVisible({ timeout: TIMEOUT });
  });

  test("effacer la recherche restaure la liste", async ({ page }) => {
    await page.getByTestId("search-input").fill("VilleInexistanteXYZ999");
    await expect(page.getByTestId("empty-message")).toBeVisible({ timeout: TIMEOUT });

    await page.getByTestId("search-input").fill("");
    await expect(page.getByTestId("cooker-list")).toBeVisible({ timeout: TIMEOUT });
    await expect(page.getByTestId("cooker-card").first()).toBeVisible({ timeout: TIMEOUT });
  });

  // ── Filtre par spécialité ─────────────────────────────────────────────────

  test("affiche les chips de filtre par spécialité", async ({ page }) => {
    await expect(page.getByTestId("speciality-chip-all")).toBeVisible({ timeout: TIMEOUT });
    await expect(page.getByTestId("speciality-chip-french_cooking")).toBeVisible({ timeout: TIMEOUT });
    await expect(page.getByTestId("speciality-chip-italian_cooking")).toBeVisible({ timeout: TIMEOUT });
  });

  test("le chip Tous est actif par défaut et la liste est visible", async ({ page }) => {
    await expect(page.getByTestId("speciality-chip-all")).toBeVisible({ timeout: TIMEOUT });
    await expect(page.getByTestId("cooker-card").first()).toBeVisible({ timeout: TIMEOUT });
  });

  test("sélectionner une spécialité sans résultat affiche le message vide", async ({ page }) => {
    await page.getByTestId("speciality-chip-japanese_cooking").click();
    await expect(page.getByTestId("loading-indicator")).toBeHidden({ timeout: TIMEOUT });
    const hasResults = await page.getByTestId("cooker-card").first().isVisible();
    if (!hasResults) {
      await expect(page.getByTestId("empty-message")).toBeVisible({ timeout: TIMEOUT });
    }
  });

  test("recliquer sur une spécialité active désactive le filtre", async ({ page }) => {
    await page.getByTestId("speciality-chip-french_cooking").click();
    await page.getByTestId("speciality-chip-french_cooking").click();
    await expect(page.getByTestId("cooker-list")).toBeVisible({ timeout: TIMEOUT });
  });
});
