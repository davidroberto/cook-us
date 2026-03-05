import { expect, test, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const PROFILE_TIMEOUT = 10_000;

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function loginAsClient(page: Page) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({ timeout: PROFILE_TIMEOUT });
  await page.getByTestId("email-input").pressSequentially("lucas.bernard@cookus.app");
  await page.getByTestId("password-input").pressSequentially("client1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/client\/home/, { timeout: PROFILE_TIMEOUT });
}

// ─── Scénario : Client connecté — Voir les informations du cuisinier ─────────

test.describe("Profil cuisinier", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await expect(page.getByTestId("cooker-card").first()).toBeVisible({
      timeout: PROFILE_TIMEOUT,
    });
    await page.getByTestId("cooker-card").first().click();
    await expect(page).toHaveURL(/\/client\/viewCook\/profile\//, {
      timeout: PROFILE_TIMEOUT,
    });
  });

  test("affiche le nom et prénom du cuisinier", async ({ page }) => {
    const name = page.getByTestId("profile-name");
    await expect(name).toBeVisible({ timeout: PROFILE_TIMEOUT });
    await expect(name).not.toHaveText("");
  });

  test("affiche la description courte du cuisinier", async ({ page }) => {
    const description = page.getByTestId("profile-description");
    await expect(description).toBeVisible({ timeout: PROFILE_TIMEOUT });
    await expect(description).not.toHaveText("");
  });

  test("affiche la photo de profil ou les initiales du cuisinier", async ({
    page,
  }) => {
    await expect(page.getByTestId("profile-card")).toBeVisible({
      timeout: PROFILE_TIMEOUT,
    });

    const hasAvatar = await page.getByTestId("profile-avatar").isVisible();
    if (!hasAvatar) {
      await expect(page.getByTestId("profile-avatar-fallback")).toBeVisible();
    }
  });

  test("affiche la spécialité du cuisinier", async ({ page }) => {
    const speciality = page.getByTestId("profile-speciality");
    await expect(speciality).toBeVisible({ timeout: PROFILE_TIMEOUT });
    await expect(speciality).not.toHaveText("");
  });

  test("affiche le tarif horaire du cuisinier", async ({ page }) => {
    const rate = page.getByTestId("profile-rate");
    await expect(rate).toBeVisible({ timeout: PROFILE_TIMEOUT });
    await expect(rate).toContainText("€/h");
  });
});
