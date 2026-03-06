import { expect, test, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const TIMEOUT = 10_000;

// ─── Auth helpers ──────────────────────────────────────────────────────────────

async function loginAsClient(page: Page) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({
    timeout: TIMEOUT,
  });
  await page
    .getByTestId("email-input")
    .pressSequentially("lucas.bernard@cookus.app");
  await page.getByTestId("password-input").pressSequentially("client1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/client\/home/, { timeout: TIMEOUT });
}

// ─── Scénario : Modification d'adresse depuis la messagerie ──────────────────

test.describe("Modification d'adresse depuis le modal des commandes", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`${MOBILE_URL}/client/messages`);
    await expect(page.getByTestId("conversation-item").first()).toBeVisible({
      timeout: TIMEOUT,
    });
    await page.getByTestId("conversation-item").first().click();
    await expect(page).toHaveURL(/\/client\/messaging\//, { timeout: TIMEOUT });
  });

  test("ouvre le modal des commandes via le bouton Commandes", async ({
    page,
  }) => {
    await expect(page.getByTestId("orders-button")).toBeVisible({
      timeout: TIMEOUT,
    });
    await page.getByTestId("orders-button").click();
    await expect(page.getByTestId("order-item").first()).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  test("affiche le bouton Modifier l'adresse sur une demande modifiable", async ({
    page,
  }) => {
    await page.getByTestId("orders-button").click();
    await expect(
      page.getByTestId("address-editor-edit-btn").first(),
    ).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  test("ouvre le formulaire de modification d'adresse", async ({ page }) => {
    await page.getByTestId("orders-button").click();
    await page.getByTestId("address-editor-edit-btn").first().click();
    await expect(page.getByTestId("address-editor-street")).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByTestId("address-editor-postalcode")).toBeVisible();
    await expect(page.getByTestId("address-editor-city")).toBeVisible();
  });

  test("affiche une erreur si un champ est vide", async ({ page }) => {
    await page.getByTestId("orders-button").click();
    await page.getByTestId("address-editor-edit-btn").first().click();
    await page.getByTestId("address-editor-street").clear();
    await page.getByTestId("address-editor-save").click();
    await expect(page.getByTestId("address-editor-error")).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  test.describe.serial("mise à jour de l'adresse et refresh du message", () => {
    const newStreet = "42 rue des Nouveaux Tests";
    const newPostalCode = "75011";
    const newCity = "Paris";

    test("enregistre la nouvelle adresse et ferme le modal", async ({
      page,
    }) => {
      await page.getByTestId("orders-button").click();
      await page.getByTestId("address-editor-edit-btn").first().click();

      await page.getByTestId("address-editor-street").clear();
      await page.getByTestId("address-editor-street").fill(newStreet);
      await page.getByTestId("address-editor-postalcode").clear();
      await page.getByTestId("address-editor-postalcode").fill(newPostalCode);
      await page.getByTestId("address-editor-city").clear();
      await page.getByTestId("address-editor-city").fill(newCity);

      await page.getByTestId("address-editor-save").click();

      // Le formulaire se ferme après la sauvegarde
      await expect(page.getByTestId("address-editor-street")).not.toBeVisible({
        timeout: TIMEOUT,
      });
    });

    test("le message dans la conversation reflète la nouvelle adresse après fermeture du modal", async ({
      page,
    }) => {
      // Modifier l'adresse
      await page.getByTestId("orders-button").click();
      await page.getByTestId("address-editor-edit-btn").first().click();

      await page.getByTestId("address-editor-street").clear();
      await page.getByTestId("address-editor-street").fill(newStreet);
      await page.getByTestId("address-editor-postalcode").clear();
      await page.getByTestId("address-editor-postalcode").fill(newPostalCode);
      await page.getByTestId("address-editor-city").clear();
      await page.getByTestId("address-editor-city").fill(newCity);

      const [response] = await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes("/address") &&
            res.request().method() === "PATCH",
          { timeout: TIMEOUT },
        ),
        page.getByTestId("address-editor-save").click(),
      ]);

      expect(
        response.status(),
        `API a répondu ${response.status()}: ${await response.text()}`,
      ).toBe(200);

      await expect(page.getByTestId("address-editor-street")).not.toBeVisible({
        timeout: TIMEOUT,
      });

      // Fermer le modal
      await page.getByText("Fermer").click();

      // Wait for modal to close
      await expect(
        page.getByTestId("request-summary-card").first(),
      ).not.toBeVisible({
        timeout: TIMEOUT,
      });

      // La bulle de demande doit afficher la nouvelle adresse (refresh async après fermeture)
      await expect(
        page
          .getByTestId("request-address")
          .filter({ hasText: newStreet })
          .first(),
      ).toBeVisible({ timeout: TIMEOUT * 2 });
    });
  });
});
