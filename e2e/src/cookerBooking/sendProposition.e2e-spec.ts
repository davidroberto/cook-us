import { expect, test, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";
const API_URL = process.env.E2E_API_URL ?? "http://localhost:8080/api";

const FORM_TIMEOUT = 10_000;

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function loginAsClient(page: Page) {
  const response = await page.request.post(`${API_URL}/auth/login`, {
    data: {
      email: process.env.E2E_CLIENT_EMAIL ?? "",
      password: process.env.E2E_CLIENT_PASSWORD ?? "",
    },
  });

  const { token, user } = await response.json();

  await page.goto(MOBILE_URL);
  await page.evaluate(
    ({ token, user }) => {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
    },
    { token, user },
  );
}

// ─── Navigation helper ────────────────────────────────────────────────────────

async function navigateToBookingForm(page: Page) {
  await page.goto(`${MOBILE_URL}/client/home`);
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
        await page.getByTestId("start-date-input").pressSequentially("15062026");
        await page.getByTestId("submit-button").click();
      })(),
    ]);

    expect(response.status(), `API a répondu ${response.status()}: ${await response.text()}`).toBe(201);

    await expect(page).toHaveURL(/\/client\/messaging\//, {
      timeout: FORM_TIMEOUT,
    });
  });
});
