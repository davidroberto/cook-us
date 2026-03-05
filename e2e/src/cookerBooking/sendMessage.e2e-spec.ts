import { expect, test, type Browser, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";

const TIMEOUT = 10_000;

// ─── Auth helpers ─────────────────────────────────────────────────────────────

async function loginAsCook(page: Page) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({ timeout: TIMEOUT });
  await page.getByTestId("email-input").pressSequentially("pierre.martin@cookus.app");
  await page.getByTestId("password-input").pressSequentially("cook1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/cook\/home/, { timeout: TIMEOUT });
}

async function loginAsClient(page: Page) {
  await page.goto(`${MOBILE_URL}/login`);
  await expect(page.getByTestId("login-form")).toBeVisible({ timeout: TIMEOUT });
  await page.getByTestId("email-input").pressSequentially("lucas.bernard@cookus.app");
  await page.getByTestId("password-input").pressSequentially("client1234");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/client\/home/, { timeout: TIMEOUT });
}

// ─── Setup : créer une conversation fraîche ───────────────────────────────────

let clientConversationId: string;

async function createClientConversation(browser: Browser) {
  const page = await browser.newPage();
  await loginAsClient(page);

  await expect(page.getByTestId("cooker-card").first()).toBeVisible({ timeout: TIMEOUT });
  await page.getByTestId("cooker-card").first().click();
  await expect(page.getByTestId("propose-creneau-button")).toBeVisible({ timeout: TIMEOUT });
  await page.getByTestId("propose-creneau-button").click();
  await expect(page).toHaveURL(/\/client\/viewCook\/booking\//, { timeout: TIMEOUT });

  await page.getByTestId("number-of-guests-input").pressSequentially("2");
  await page.getByTestId("start-date-input").fill("20-06-2027");
  await page.getByTestId("meal-type-lunch").click();
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL(/\/client\/messaging\/(\d+)/, { timeout: TIMEOUT });

  const match = page.url().match(/\/client\/messaging\/(\d+)/);
  clientConversationId = match?.[1] ?? "";

  await page.close();
}

// ─── Scénario : Cuisinier envoie un message ───────────────────────────────────

test.describe("Envoi d'un message — Cuisinier", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCook(page);
    await page.goto(`${MOBILE_URL}/cook/messages`);
    await expect(page.getByTestId("conversation-item").first()).toBeVisible({ timeout: TIMEOUT });
    await page.getByTestId("conversation-item").first().click();
    await expect(page).toHaveURL(/\/cook\/messaging\//, { timeout: TIMEOUT });
  });

  test("envoie un message et l'affiche dans la conversation", async ({ page }) => {
    const messageText = "Bonjour, je confirme ma disponibilité.";
    await page.getByTestId("message-text-input").fill(messageText);
    await page.getByTestId("message-send-button").click();
    await expect(page.getByTestId("message-text-input")).toHaveValue("", { timeout: TIMEOUT });
    await expect(
      page.getByTestId("message-bubble-client").filter({ hasText: messageText }).first()
    ).toBeVisible({ timeout: TIMEOUT });
  });

  test("ne peut pas envoyer un message vide", async ({ page }) => {
    await expect(page.getByTestId("message-send-button")).toBeDisabled();
  });
});

// ─── Scénario : Client envoie un message ─────────────────────────────────────

test.describe("Envoi d'un message — Client", () => {
  test.beforeAll(async ({ browser }) => {
    await createClientConversation(browser);
  });

  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
    await page.goto(`${MOBILE_URL}/client/messaging/${clientConversationId}`);
    await expect(page).toHaveURL(/\/client\/messaging\//, { timeout: TIMEOUT });
  });

  test("envoie un message et l'affiche dans la conversation", async ({ page }) => {
    const messageText = "Avez-vous des disponibilités pour le 20 juin ?";
    await page.getByTestId("message-text-input").fill(messageText);
    await page.getByTestId("message-send-button").click();
    await expect(page.getByTestId("message-text-input")).toHaveValue("", { timeout: TIMEOUT });
    await expect(
      page.getByTestId("message-bubble-client").filter({ hasText: messageText }).first()
    ).toBeVisible({ timeout: TIMEOUT });
  });

  test("ne peut pas envoyer un message vide", async ({ page }) => {
    await expect(page.getByTestId("message-send-button")).toBeDisabled();
  });
});
