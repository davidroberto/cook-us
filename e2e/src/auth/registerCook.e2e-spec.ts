import { expect, test } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const REGISTER_TIMEOUT = 10_000;

// ─── Scénario : Visiteur cuisinier — Créer son profil pour vendre des prestations

test.describe("Inscription cuisinier", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${MOBILE_URL}/register`);
    await expect(page.getByTestId("register-form")).toBeVisible({
      timeout: REGISTER_TIMEOUT,
    });
  });

  // ─── Champs communs ──────────────────────────────────────────────────────────

  test("affiche le champ prénom", async ({ page }) => {
    await expect(page.getByTestId("firstname-input")).toBeVisible();
  });

  test("affiche le champ nom", async ({ page }) => {
    await expect(page.getByTestId("lastname-input")).toBeVisible();
  });

  test("affiche le champ email", async ({ page }) => {
    await expect(page.getByTestId("email-input")).toBeVisible();
  });

  test("affiche le champ mot de passe", async ({ page }) => {
    await expect(page.getByTestId("password-input")).toBeVisible();
  });

  test("affiche le sélecteur de photo de profil", async ({ page }) => {
    await expect(page.getByTestId("avatar-picker")).toBeVisible();
  });

  test("affiche l'option rôle cuisinier", async ({ page }) => {
    await expect(page.getByTestId("role-cook")).toBeVisible();
  });

  // ─── Champs spécifiques cuisinier (visibles après sélection du rôle) ─────────

  test("affiche le sélecteur de spécialité après sélection du rôle cuisinier", async ({
    page,
  }) => {
    await page.getByTestId("role-cook").click();
    await expect(page.getByTestId("speciality-french_cooking")).toBeVisible({
      timeout: REGISTER_TIMEOUT,
    });
  });

  test("affiche le champ description après sélection du rôle cuisinier", async ({
    page,
  }) => {
    await page.getByTestId("role-cook").click();
    await expect(page.getByTestId("description-input")).toBeVisible({
      timeout: REGISTER_TIMEOUT,
    });
  });

  test("affiche le champ tarif horaire après sélection du rôle cuisinier", async ({
    page,
  }) => {
    await page.getByTestId("role-cook").click();
    await expect(page.getByTestId("hourly-rate-input")).toBeVisible({
      timeout: REGISTER_TIMEOUT,
    });
  });

  test("affiche le champ SIRET après sélection du rôle cuisinier", async ({
    page,
  }) => {
    await page.getByTestId("role-cook").click();
    await expect(page.getByTestId("siret-input")).toBeVisible({
      timeout: REGISTER_TIMEOUT,
    });
  });

  // ─── Validation ──────────────────────────────────────────────────────────────

  test("affiche une erreur si le formulaire est soumis vide", async ({
    page,
  }) => {
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("error-message")).toBeVisible({
      timeout: REGISTER_TIMEOUT,
    });
  });

  // ─── Happy path ──────────────────────────────────────────────────────────────

  test("inscrit un cuisinier et redirige vers la home", async ({ page }) => {
    const uniqueEmail = `test.cook.e2e.${Date.now()}@cookus.app`;

    await page.getByTestId("firstname-input").pressSequentially("Marie");
    await page.getByTestId("lastname-input").pressSequentially("Curie");
    await page.getByTestId("email-input").pressSequentially(uniqueEmail);
    await page.getByTestId("password-input").pressSequentially("password123");
    await page.getByTestId("role-cook").click();
    await page.getByTestId("speciality-french_cooking").click();
    await page.getByTestId("siret-input").pressSequentially("81234567800015");
    await page.getByTestId("cook-city-input").pressSequentially("Paris");
    await page
      .getByTestId("description-input")
      .pressSequentially("Cuisinière passionnée par la gastronomie française.");
    await page.getByTestId("hourly-rate-input").pressSequentially("45");

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/auth/register") &&
          res.request().method() === "POST",
        { timeout: REGISTER_TIMEOUT },
      ),
      page.getByTestId("submit-button").click(),
    ]);

    expect(
      response.status(),
      `API a répondu ${response.status()}: ${await response.text()}`,
    ).toBe(201);

    await expect(page).toHaveURL(/\/cook\/home/, {
      timeout: REGISTER_TIMEOUT,
    });
  });
});
