import { expect, test } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const REGISTER_TIMEOUT = 10_000;

// ─── Scénario : Visiteur — S'inscrire pour accéder à la plateforme ────────────

test.describe("Inscription visiteur", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${MOBILE_URL}/register`);
    await expect(page.getByTestId("register-form")).toBeVisible({
      timeout: REGISTER_TIMEOUT,
    });
  });

  test("affiche le formulaire d'inscription", async ({ page }) => {
    await expect(page.getByTestId("register-form")).toBeVisible();
  });

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

  test("affiche l'option rôle client", async ({ page }) => {
    await expect(page.getByTestId("role-client")).toBeVisible();
  });

  test("affiche une erreur si le formulaire est soumis vide", async ({
    page,
  }) => {
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("error-message")).toBeVisible({
      timeout: REGISTER_TIMEOUT,
    });
  });

  test("inscrit un client et redirige vers la home", async ({ page }) => {
    const uniqueEmail = `test.e2e.${Date.now()}@cookus.app`;

    await page.getByTestId("firstname-input").pressSequentially("Jean");
    await page.getByTestId("lastname-input").pressSequentially("Dupont");
    await page.getByTestId("email-input").pressSequentially(uniqueEmail);
    await page.getByTestId("password-input").pressSequentially("password123");
    await page.getByTestId("role-client").click();

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

    await expect(page).toHaveURL(/\/client\/home/, {
      timeout: REGISTER_TIMEOUT,
    });
  });
});
