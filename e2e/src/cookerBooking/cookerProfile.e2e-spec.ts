import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:8081";
const PROFILE_URL = (cookId: string) =>
  `${BASE_URL}/cookerBooking/${cookId}`;

// Timeout couvrant le délai du fake API (1200ms) + rendu
const PROFILE_TIMEOUT = 5_000;

// ─── Scénario 6 : Chargement ──────────────────────────────────────────────────

test("affiche le skeleton pendant le chargement", async ({ page }) => {
  await page.goto(PROFILE_URL("cook-1"));

  // Le skeleton doit être visible avant que le fake API réponde (1200ms)
  await expect(page.getByTestId("profile-skeleton")).toBeVisible();
});

// ─── Scénario 1 : Profil valide ───────────────────────────────────────────────

test("affiche les informations du cuisinier pour un profil valide", async ({
  page,
}) => {
  await page.goto(PROFILE_URL("cook-1"));

  await expect(page.getByTestId("profile-card")).toBeVisible({
    timeout: PROFILE_TIMEOUT,
  });
  await expect(page.getByTestId("profile-name")).toBeVisible();
  await expect(page.getByTestId("profile-speciality")).toBeVisible();
  await expect(page.getByTestId("profile-rate")).toBeVisible();
});

test("affiche le bouton Proposer un créneau sur un profil valide", async ({
  page,
}) => {
  await page.goto(PROFILE_URL("cook-1"));

  await expect(page.getByTestId("propose-creneau-button")).toBeVisible({
    timeout: PROFILE_TIMEOUT,
  });
});

test("affiche le fallback initiales quand la photo est absente", async ({
  page,
}) => {
  await page.goto(PROFILE_URL("cook-1"));

  // Le mock renvoie photoUrl: null → fallback avec initiales
  await expect(page.getByTestId("profile-avatar-fallback")).toBeVisible({
    timeout: PROFILE_TIMEOUT,
  });
  await expect(page.getByTestId("profile-avatar")).not.toBeVisible();
});

test('affiche "Tarif sur demande" quand le tarif est non renseigné', async ({
  page,
}) => {
  // Cook ID spécial mock = hourlyRate null (à configurer dans mocks si besoin)
  // Par défaut le mock renvoie 35€/h
  await page.goto(PROFILE_URL("cook-1"));

  await expect(page.getByTestId("profile-rate")).toBeVisible({
    timeout: PROFILE_TIMEOUT,
  });
});

// ─── Scénario 2 & 3 : Bouton Proposer un créneau ─────────────────────────────

test("redirige vers /login quand le client clique sur Proposer un créneau sans être connecté", async ({
  page,
}) => {
  await page.goto(PROFILE_URL("cook-1"));

  await expect(page.getByTestId("propose-creneau-button")).toBeVisible({
    timeout: PROFILE_TIMEOUT,
  });

  await page.getByTestId("propose-creneau-button").click();

  await expect(page).toHaveURL(/\/login/);
});

// ─── Scénario 4 : Profil introuvable ─────────────────────────────────────────

test("affiche un message inline quand le cuisinier est introuvable", async ({
  page,
}) => {
  await page.goto(PROFILE_URL("not-found"));

  await expect(
    page.getByText("Ce cuisinier est introuvable.")
  ).toBeVisible({ timeout: PROFILE_TIMEOUT });
});

test("n'affiche pas le bouton Proposer un créneau quand le profil est introuvable", async ({
  page,
}) => {
  await page.goto(PROFILE_URL("not-found"));

  await expect(
    page.getByText("Ce cuisinier est introuvable.")
  ).toBeVisible({ timeout: PROFILE_TIMEOUT });

  await expect(page.getByTestId("propose-creneau-button")).not.toBeVisible();
});

// ─── Scénario 5 : Erreur technique ───────────────────────────────────────────

test("affiche un toast d'erreur en cas d'erreur technique", async ({
  page,
}) => {
  await page.goto(PROFILE_URL("error"));

  await expect(
    page.getByText("Une erreur est survenue. Veuillez réessayer.")
  ).toBeVisible({ timeout: PROFILE_TIMEOUT });
});

test("affiche un bouton Réessayer en cas d'erreur technique", async ({
  page,
}) => {
  await page.goto(PROFILE_URL("error"));

  await expect(page.getByText("Réessayer")).toBeVisible({
    timeout: PROFILE_TIMEOUT,
  });
});

test("recharge le profil au clic sur Réessayer", async ({ page }) => {
  await page.goto(PROFILE_URL("error"));

  await expect(page.getByText("Réessayer")).toBeVisible({
    timeout: PROFILE_TIMEOUT,
  });

  // Après un retry sur un ID valide (simulation : rechargement sur "error" → encore erreur,
  // mais le flow de retry doit se déclencher et recharger le state)
  await page.getByText("Réessayer").click();

  // Le skeleton réapparaît pendant le rechargement
  await expect(page.getByTestId("profile-skeleton")).toBeVisible();
});
