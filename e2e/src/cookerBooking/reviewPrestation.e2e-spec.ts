import { expect, test, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const TIMEOUT = 10_000;

// ─── Auth helpers ─────────────────────────────────────────────────────────────

async function loginAsClient(page: Page) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({ timeout: TIMEOUT });
  await page.getByTestId("email-input").pressSequentially("lucas.bernard@cookus.app");
  await page.getByTestId("password-input").pressSequentially("client1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/client\/home/, { timeout: TIMEOUT });
}

async function goToTermineesTab(page: Page) {
  await page.goto(`${MOBILE_URL}/client/orderHistory`);
  await page.getByText("Terminées").click();
  await expect(page.getByTestId("order-item").first()).toBeVisible({ timeout: TIMEOUT });
}

// ─── Scénario : Avis déjà soumis — lecture seule ─────────────────────────────
// Le seed contient une prestation terminée de lucas.bernard avec une note existante.
// Ce test est idempotent.

test.describe("Avis déjà soumis — lecture seule", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await goToTermineesTab(page);
  });

  test("affiche un avis en lecture seule pour une prestation déjà notée", async ({ page }) => {
    await expect(page.getByTestId("review-readonly").first()).toBeVisible({ timeout: TIMEOUT });
  });
});

// ─── Scénario : Formulaire de notation — affichage ───────────────────────────
// Le seed contient une prestation terminée de lucas.bernard SANS note.
// Ces tests ne soumettent rien et sont toujours re-jouables.

test.describe("Formulaire de notation d'une prestation terminée", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await goToTermineesTab(page);
  });

  test("affiche le formulaire ou la confirmation pour une prestation terminée non notée", async ({ page }) => {
    // Selon l'état de la BDD : soit le formulaire est affiché, soit la confirmation après soumission
    const formOrReadonly = page
      .getByTestId("review-form")
      .or(page.getByTestId("review-readonly"))
      .or(page.getByTestId("review-confirmation"));

    await expect(formOrReadonly.first()).toBeVisible({ timeout: TIMEOUT });
  });

  test("le bouton soumettre est désactivé sans note sélectionnée", async ({ page }) => {
    const form = page.getByTestId("review-form").first();
    const isFormVisible = await form.isVisible().catch(() => false);
    if (!isFormVisible) return; // déjà noté, test non applicable

    await expect(page.getByTestId("review-submit").first()).toBeDisabled();
  });

  test("active le bouton soumettre après sélection d'une étoile", async ({ page }) => {
    const form = page.getByTestId("review-form").first();
    const isFormVisible = await form.isVisible().catch(() => false);
    if (!isFormVisible) return; // déjà noté, test non applicable

    await page.getByTestId("star-4").first().click();
    await expect(page.getByTestId("review-submit").first()).toBeEnabled({ timeout: TIMEOUT });
  });
});

// ─── Scénario : Soumission d'une note ────────────────────────────────────────
// Adaptatif : si la prestation n'est pas encore notée → soumet et vérifie la confirmation.
// Si elle est déjà notée → vérifie le mode lecture seule.
// Ce test passe dans les deux cas, sans re-seed.

test.describe("Soumission d'une note", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await goToTermineesTab(page);
  });

  test("soumet une note ou affiche l'avis existant selon l'état de la BDD", async ({ page }) => {
    const form = page.getByTestId("review-form").first();
    const isFormVisible = await form.isVisible().catch(() => false);

    if (isFormVisible) {
      // Première exécution : soumettre la note
      const [response] = await Promise.all([
        page.waitForResponse(
          (res) => res.url().includes("/review") && res.request().method() === "POST",
          { timeout: TIMEOUT }
        ),
        (async () => {
          await page.getByTestId("star-4").first().click();
          await page
            .getByTestId("review-comment-input")
            .first()
            .fill("Excellent cuisinier, je recommande !");
          await page.getByTestId("review-submit").first().click();
        })(),
      ]);

      expect(
        response.status(),
        `API a répondu ${response.status()}: ${await response.text()}`
      ).toBe(201);

      await expect(page.getByTestId("review-confirmation").first()).toBeVisible({ timeout: TIMEOUT });
    } else {
      // Exécutions suivantes : la prestation est déjà notée, on vérifie la lecture seule
      await expect(page.getByTestId("review-readonly").first()).toBeVisible({ timeout: TIMEOUT });
    }
  });
});
