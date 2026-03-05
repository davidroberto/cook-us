import { expect, test } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const LOGIN_TIMEOUT = 10_000;

// ─── Scénario : Client ou Cuisinier — Se connecter pour accéder à son compte ──

test.describe("Connexion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${MOBILE_URL}/login`);
    await expect(page.getByTestId("login-form")).toBeVisible({
      timeout: LOGIN_TIMEOUT,
    });
  });

  test("affiche le champ email", async ({ page }) => {
    await expect(page.getByTestId("email-input")).toBeVisible();
  });

  test("affiche le champ mot de passe", async ({ page }) => {
    await expect(page.getByTestId("password-input")).toBeVisible();
  });

  test("affiche une erreur si le formulaire est soumis vide", async ({
    page,
  }) => {
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("error-message")).toBeVisible({
      timeout: LOGIN_TIMEOUT,
    });
  });

  test("affiche une erreur avec des identifiants incorrects", async ({
    page,
  }) => {
    await page
      .getByTestId("email-input")
      .pressSequentially("inconnu@cookus.app");
    await page.getByTestId("password-input").pressSequentially("mauvaismdp");
    await page.getByTestId("submit-button").click();
    await expect(page.getByTestId("error-message")).toBeVisible({
      timeout: LOGIN_TIMEOUT,
    });
  });

  test("connecte un client et redirige vers la home client", async ({
    page,
  }) => {
    await page
      .getByTestId("email-input")
      .pressSequentially("lucas.bernard@cookus.app");
    await page
      .getByTestId("password-input")
      .pressSequentially("client1234");
    await page.getByTestId("submit-button").click();

    await expect(page).toHaveURL(/\/client\/home/, {
      timeout: LOGIN_TIMEOUT,
    });
  });

  test("connecte un cuisinier et redirige vers la home cuisinier", async ({
    page,
  }) => {
    await page
      .getByTestId("email-input")
      .pressSequentially("pierre.martin@cookus.app");
    await page
      .getByTestId("password-input")
      .pressSequentially("cook1234");
    await page.getByTestId("submit-button").click();

    await expect(page).toHaveURL(/\/cook\/home/, {
      timeout: LOGIN_TIMEOUT,
    });
  });
});
