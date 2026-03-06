import { expect, test, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const FORM_TIMEOUT = 10_000;

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function loginAsClient(page: Page) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({ timeout: FORM_TIMEOUT });
  await page.getByTestId("email-input").pressSequentially("lucas.bernard@cookus.app");
  await page.getByTestId("password-input").pressSequentially("client1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/client\/home/, { timeout: FORM_TIMEOUT });
}

// ─── Navigation helper ────────────────────────────────────────────────────────

async function navigateToBookingForm(page: Page) {
  await expect(page.getByTestId("cooker-card").first()).toBeVisible({
    timeout: FORM_TIMEOUT,
  });
  await page.getByTestId("cooker-card").first().click();
  await expect(page.getByTestId("propose-creneau-button")).toBeVisible({
    timeout: FORM_TIMEOUT,
  });
  await page.getByTestId("propose-creneau-button").click();
  await expect(page).toHaveURL(/\/client\/viewCook\/booking\//, {
    timeout: FORM_TIMEOUT,
  });
}

// ─── Scénario : Client connecté — Envoyer une proposition au cuisinier ────────

test.describe("Envoi d'une proposition au cuisinier", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await navigateToBookingForm(page);
  });

  test("affiche le formulaire de proposition", async ({ page }) => {
    await expect(page.getByTestId("send-proposition-form")).toBeVisible({
      timeout: FORM_TIMEOUT,
    });
  });

  test("affiche la spécialité du cuisinier", async ({ page }) => {
    const speciality = page.getByTestId("cook-speciality");
    await expect(speciality).toBeVisible({ timeout: FORM_TIMEOUT });
    await expect(speciality).not.toHaveText("");
  });

  test("affiche le champ nombre de convives", async ({ page }) => {
    await expect(page.getByTestId("number-of-guests-input")).toBeVisible({
      timeout: FORM_TIMEOUT,
    });
  });

  test("affiche le champ date", async ({ page }) => {
    await expect(page.getByTestId("start-date-input")).toBeVisible({
      timeout: FORM_TIMEOUT,
    });
  });

  test("affiche les options de type de repas", async ({ page }) => {
    await expect(page.getByTestId("meal-type-breakfast")).toBeVisible({ timeout: FORM_TIMEOUT });
    await expect(page.getByTestId("meal-type-lunch")).toBeVisible({ timeout: FORM_TIMEOUT });
    await expect(page.getByTestId("meal-type-dinner")).toBeVisible({ timeout: FORM_TIMEOUT });
  });

  test("affiche le champ message", async ({ page }) => {
    await expect(page.getByTestId("message-input")).toBeVisible({
      timeout: FORM_TIMEOUT,
    });
  });

  test("affiche les champs adresse", async ({ page }) => {
    await expect(page.getByTestId("street-input")).toBeVisible({ timeout: FORM_TIMEOUT });
    await expect(page.getByTestId("postalcode-input")).toBeVisible({ timeout: FORM_TIMEOUT });
    await expect(page.getByTestId("city-input")).toBeVisible({ timeout: FORM_TIMEOUT });
  });

  test("pré-remplit les champs adresse depuis le profil client", async ({ page }) => {
    await expect(page.getByTestId("street-input")).not.toHaveValue("", { timeout: FORM_TIMEOUT });
    await expect(page.getByTestId("postalcode-input")).not.toHaveValue("");
    await expect(page.getByTestId("city-input")).not.toHaveValue("");
  });

  test("affiche une erreur si le formulaire est soumis vide", async ({
    page,
  }) => {
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("error-message")).toBeVisible({
      timeout: FORM_TIMEOUT,
    });
  });

  test("envoie la proposition et redirige vers la conversation", async ({
    page,
  }) => {
    const [response] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/cook-request") && res.request().method() === "POST",
        { timeout: FORM_TIMEOUT },
      ),
      (async () => {
        await page.getByTestId("number-of-guests-input").pressSequentially("4");
        await page.getByTestId("start-date-input").fill("15-06-2026");
        await page.getByTestId("meal-type-dinner").click();
        await page.getByTestId("street-input").fill("15 rue de Rivoli");
        await page.getByTestId("postalcode-input").fill("75001");
        await page.getByTestId("city-input").fill("Paris");
        await page.getByTestId("submit-button").click();
      })(),
    ]);

    expect(response.status(), `API a répondu ${response.status()}: ${await response.text()}`).toBe(201);

    await expect(page).toHaveURL(/\/client\/messaging\//, {
      timeout: FORM_TIMEOUT,
    });
  });

  test("envoie la proposition sans retaper l'adresse (pré-remplie depuis le profil)", async ({
    page,
  }) => {
    // Attendre que le pré-remplissage soit effectif
    await expect(page.getByTestId("street-input")).not.toHaveValue("", {
      timeout: FORM_TIMEOUT,
    });

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/cook-request") && res.request().method() === "POST",
        { timeout: FORM_TIMEOUT },
      ),
      (async () => {
        await page.getByTestId("number-of-guests-input").pressSequentially("2");
        await page.getByTestId("start-date-input").fill("20-06-2027");
        await page.getByTestId("meal-type-lunch").click();
        // Pas de remplissage des champs adresse — on utilise le pré-remplissage
        await page.getByTestId("submit-button").click();
      })(),
    ]);

    expect(response.status(), `API a répondu ${response.status()}: ${await response.text()}`).toBe(201);

    await expect(page).toHaveURL(/\/client\/messaging\//, {
      timeout: FORM_TIMEOUT,
    });
  });
});
