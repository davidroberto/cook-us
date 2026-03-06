import { test, expect, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";
const API = "http://localhost:8080/api";

const TIMEOUT = 10_000;

// ─── Auth helpers ──────────────────────────────────────────────────────────────

async function loginAsClient(page: Page) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({ timeout: TIMEOUT });
  await page.getByTestId("email-input").pressSequentially("lucas.bernard@cookus.app");
  await page.getByTestId("password-input").pressSequentially("client1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/client\/home/, { timeout: TIMEOUT });
}

// ─── Scénario : Accordéon "Mon adresse" sur le profil client ─────────────────

test.describe("Profil client — accordéon Mon adresse", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`${MOBILE_URL}/client/compte`);
    await expect(page.getByTestId("accordion-address-header")).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  test("affiche l'accordéon Mon adresse", async ({ page }) => {
    await expect(page.getByTestId("accordion-address-header")).toBeVisible();
  });

  test("ouvre l'accordéon et affiche les champs adresse", async ({ page }) => {
    await page.getByTestId("accordion-address-header").click();
    await expect(page.getByTestId("accordion-address-street")).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByTestId("accordion-address-postalcode")).toBeVisible();
    await expect(page.getByTestId("accordion-address-city")).toBeVisible();
  });

  test("affiche une erreur si un champ est vide", async ({ page }) => {
    await page.getByTestId("accordion-address-header").click();
    await page.getByTestId("accordion-address-street").clear();
    await page.getByTestId("accordion-address-postalcode").clear();
    await page.getByTestId("accordion-address-city").clear();
    await page.getByTestId("accordion-address-save").click();
    await expect(page.getByTestId("accordion-address-notice")).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  test("enregistre l'adresse et affiche un message de succès", async ({ page }) => {
    await page.getByTestId("accordion-address-header").click();
    await page.getByTestId("accordion-address-street").clear();
    await page.getByTestId("accordion-address-street").fill("10 rue du Test");
    await page.getByTestId("accordion-address-postalcode").clear();
    await page.getByTestId("accordion-address-postalcode").fill("75010");
    await page.getByTestId("accordion-address-city").clear();
    await page.getByTestId("accordion-address-city").fill("Paris");
    await page.getByTestId("accordion-address-save").click();
    await expect(page.getByTestId("accordion-address-notice")).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByTestId("accordion-address-notice")).toContainText(
      "Adresse enregistrée"
    );
  });

  test("l'adresse enregistrée est persistée côté API", async ({ page, request }) => {
    await page.getByTestId("accordion-address-header").click();
    await page.getByTestId("accordion-address-street").clear();
    await page.getByTestId("accordion-address-street").fill("99 avenue des Tests");
    await page.getByTestId("accordion-address-postalcode").clear();
    await page.getByTestId("accordion-address-postalcode").fill("75019");
    await page.getByTestId("accordion-address-city").clear();
    await page.getByTestId("accordion-address-city").fill("Paris");
    await page.getByTestId("accordion-address-save").click();
    await expect(page.getByTestId("accordion-address-notice")).toContainText(
      "Adresse enregistrée",
      { timeout: TIMEOUT }
    );

    // Vérification via l'API
    const loginRes = await request.post(`${API}/auth/login`, {
      data: { email: "lucas.bernard@cookus.app", password: "client1234" },
    });
    const { token } = await loginRes.json();
    const profileRes = await request.get(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const profile = await profileRes.json();
    expect(profile.address).toMatchObject({
      street: "99 avenue des Tests",
      postalCode: "75019",
      city: "Paris",
    });
  });
});
