import { expect, test, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const TIMEOUT = 10_000;

// ─── Auth helpers ──────────────────────────────────────────────────────────────

async function loginAsCook(page: Page, email: string) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({
    timeout: TIMEOUT,
  });
  await page.getByTestId("email-input").pressSequentially(email);
  await page.getByTestId("password-input").pressSequentially("cook1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/cook\/home/, { timeout: TIMEOUT });
}

async function loginAsClient(page: Page, email: string) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({
    timeout: TIMEOUT,
  });
  await page.getByTestId("email-input").pressSequentially(email);
  await page.getByTestId("password-input").pressSequentially("client1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/client\/home/, { timeout: TIMEOUT });
}

// ─── Scénario : Cuisinier accepte une proposition ────────────────────────────
// Pierre Martin a une demande PENDING de Lucas Bernard dans le seed.
// Adaptatif : si déjà acceptée, vérifie que le statut "Acceptée" est visible.

test.describe("Accepter une proposition (cuisinier)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCook(page, "pierre.martin@cookus.app");
    await expect(page.getByTestId("cook-request-card").first()).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  test("accepte une proposition en attente ou vérifie le statut accepté", async ({
    page,
  }) => {
    const acceptBtn = page.getByTestId("accept-button").first();
    const hasAcceptButton = await acceptBtn.isVisible().catch(() => false);

    if (hasAcceptButton) {
      // Click opens AcceptPriceModal — fill price and confirm
      await acceptBtn.click();
      await expect(page.getByTestId("price-input")).toBeVisible({
        timeout: TIMEOUT,
      });
      await page.getByTestId("price-input").fill("100");

      const [response] = await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes("/accept") && res.request().method() === "PATCH",
          { timeout: TIMEOUT },
        ),
        page.getByTestId("accept-confirm-button").click(),
      ]);

      expect(
        response.status(),
        `API a répondu ${response.status()}: ${await response.text()}`,
      ).toBe(200);

      const statuses = page.getByTestId("cook-request-status");
      await expect(
        statuses.filter({ hasText: "Acceptée" }).first(),
      ).toBeVisible({
        timeout: TIMEOUT,
      });
    } else {
      // Déjà acceptée lors d'une exécution précédente
      await expect(
        page
          .getByTestId("cook-request-status")
          .filter({ hasText: "Acceptée" })
          .first(),
      ).toBeVisible({ timeout: TIMEOUT });
    }
  });
});

// ─── Scénario : Cuisinier refuse une proposition ──────────────────────────────
// Jean-Baptiste Moreau a une demande PENDING d'Emma Petit dans le seed.
// Adaptatif : si déjà refusée, vérifie que le statut "Refusée" est visible.

test.describe("Refuser une proposition (cuisinier)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCook(page, "jb.moreau@cookus.app");
    await expect(page.getByTestId("cook-request-card").first()).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  test("refuse une proposition en attente ou vérifie le statut refusé", async ({
    page,
  }) => {
    const refuseBtn = page.getByTestId("refuse-button").first();
    const hasRefuseButton = await refuseBtn.isVisible().catch(() => false);

    if (hasRefuseButton) {
      // Click opens RefuseModal — confirm refusal
      await refuseBtn.click();
      await expect(page.getByTestId("refuse-confirm-button")).toBeVisible({
        timeout: TIMEOUT,
      });

      const [response] = await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes("/refuse") && res.request().method() === "PATCH",
          { timeout: TIMEOUT },
        ),
        page.getByTestId("refuse-confirm-button").click(),
      ]);

      expect(
        response.status(),
        `API a répondu ${response.status()}: ${await response.text()}`,
      ).toBe(200);

      await page.getByText("Refusées").click();
      await expect(
        page
          .getByTestId("cook-request-status")
          .filter({ hasText: "Refusée" })
          .first(),
      ).toBeVisible({ timeout: TIMEOUT });
    } else {
      await page.getByText("Refusées").click();
      await expect(
        page
          .getByTestId("cook-request-status")
          .filter({ hasText: "Refusée" })
          .first(),
      ).toBeVisible({ timeout: TIMEOUT });
    }
  });
});

// ─── Scénario : Client annule une réservation ─────────────────────────────────
// Raphaël Marchand a une réservation ACCEPTED avec Antoine Rousseau dans le seed.
// Adaptatif : si déjà annulée, vérifie le statut et le motif dans l'onglet "Terminées".

test.describe("Annuler une réservation (client)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page, "raphael.marchand@cookus.app");
    await page.goto(`${MOBILE_URL}/client/orderHistory`);
    await expect(page.getByText("Terminées")).toBeVisible({ timeout: TIMEOUT });
    // Wait for the list to finish loading before checking for buttons
    await page.waitForLoadState("networkidle", { timeout: TIMEOUT });
  });

  test("annule une réservation ou vérifie le statut annulé avec motif", async ({
    page,
  }) => {
    // Cherche un bouton d'annulation dans l'onglet "À venir" (tab par défaut)
    const cancelBtn = page.locator('[data-testid^="cancel-button"]').first();
    const hasCancelButton = await cancelBtn.isVisible().catch(() => false);

    if (hasCancelButton) {
      await cancelBtn.click();
      await expect(page.getByTestId("cancel-reason-input")).toBeVisible({
        timeout: TIMEOUT,
      });

      await page
        .getByTestId("cancel-reason-input")
        .fill("Changement de plans imprévu");

      const [response] = await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes("/cancel") && res.request().method() === "PATCH",
          { timeout: TIMEOUT },
        ),
        page.getByTestId("cancel-modal-confirm").click(),
      ]);

      expect(
        response.status(),
        `API a répondu ${response.status()}: ${await response.text()}`,
      ).toBe(200);

      // Naviguer vers l'onglet "Terminées" pour vérifier le statut annulé
      await page.getByText("Terminées").click();
      await expect(page.getByTestId("order-item").first()).toBeVisible({
        timeout: TIMEOUT,
      });

      const cancelledItem = page
        .getByTestId("order-item")
        .filter({
          has: page.getByTestId("order-status").filter({ hasText: "Annulée" }),
        })
        .first();

      await expect(cancelledItem).toBeVisible({ timeout: TIMEOUT });
      await expect(
        cancelledItem.getByTestId("cancellation-reason"),
      ).toBeVisible({ timeout: TIMEOUT });
      await expect(
        cancelledItem.getByTestId("cancellation-reason"),
      ).toContainText("Changement de plans imprévu");
    } else {
      // Déjà annulée lors d'une exécution précédente
      await page.getByText("Terminées").click();
      await expect(page.getByTestId("order-item").first()).toBeVisible({
        timeout: TIMEOUT,
      });

      const cancelledItem = page
        .getByTestId("order-item")
        .filter({
          has: page.getByTestId("order-status").filter({ hasText: "Annulée" }),
        })
        .first();

      await expect(cancelledItem).toBeVisible({ timeout: TIMEOUT });
    }
  });
});
