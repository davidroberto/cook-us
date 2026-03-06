/**
 * Tests de pagination de la liste des cuisiniers.
 *
 * PRÉREQUIS : Le seed doit être exécuté avec 50 cuisiniers validés avant
 * de lancer cette suite. Sans cela, les tests de scroll/hasMore échoueront.
 *
 *   cd backend && npm run seed
 */

import { expect, test, type Page } from "@playwright/test";

const MOBILE_URL = process.env.E2E_MOBILE_URL ?? "http://localhost:8081";
const TIMEOUT = 15_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  await expect(page.getByTestId("cooker-card").first()).toBeVisible({
    timeout: TIMEOUT,
  });
}

/**
 * Attend la prochaine réponse HTTP de /cooks correspondant à la page demandée.
 * À appeler AVANT l'action qui déclenche la requête.
 */
function waitForCooksResponse(page: Page, pageNum: number) {
  return page.waitForResponse(
    (res) => {
      // Filtre précis pour éviter /cook-request ou /cook/{id}
      if (!res.url().match(/\/cooks(\?|$)/) || res.request().method() !== "GET")
        return false;
      return new URL(res.url()).searchParams.get("page") === String(pageNum);
    },
    { timeout: TIMEOUT },
  );
}

/**
 * Scrolle la FlatList jusqu'en bas pour déclencher onEndReached.
 *
 * Deux stratégies complémentaires :
 * 1. mouse.wheel → évènement natif du navigateur, traduit en scroll réel
 * 2. evaluate → trouve le div scrollable interne et dispatche un scroll event
 */
async function scrollCookerListToBottom(page: Page) {
  // Stratégie 1 : mouse.wheel au centre de la liste
  const box = await page.locator('[data-testid="cooker-list"]').boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 99_999);
  }

  // Stratégie 2 : scroll programmatique sur le conteneur réel (enfant du FlatList)
  await page.evaluate(() => {
    const listEl = document.querySelector('[data-testid="cooker-list"]');
    if (!listEl) return;

    // Parcourt tous les descendants pour trouver celui avec overflow scroll/auto
    // qui déborde (scrollHeight > clientHeight)
    const descendants = Array.from(listEl.querySelectorAll("*"));
    const scrollable = descendants.find((el) => {
      const cs = window.getComputedStyle(el);
      return (
        (cs.overflowY === "scroll" || cs.overflowY === "auto") &&
        el.scrollHeight > el.clientHeight
      );
    }) as HTMLElement | undefined;

    const target = (scrollable ?? listEl) as HTMLElement;
    target.scrollTop = target.scrollHeight;
    // Dispatch explicite pour que React Native Web recalcule onEndReached
    target.dispatchEvent(new Event("scroll", { bubbles: true }));
  });

  // Petite pause pour que React traite l'événement de scroll
  await page.waitForTimeout(200);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe("Pagination — liste des cuisiniers", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClient(page);
  });

  // ── 1. Paramètres API du chargement initial ─────────────────────────────────

  test("l'API est appelée avec page=1 et limit=20 au chargement initial", async ({
    page,
  }) => {
    const responsePromise = waitForCooksResponse(page, 1);
    // Navigation fraîche pour capturer la requête initiale
    await page.goto(`${MOBILE_URL}/client/home`);

    const response = await responsePromise;
    const params = new URL(response.url()).searchParams;

    expect(params.get("page")).toBe("1");
    expect(params.get("limit")).toBe("20");
  });

  test("la première page retourne 20 cuisiniers avec hasMore=true", async ({
    page,
  }) => {
    const responsePromise = waitForCooksResponse(page, 1);
    await page.goto(`${MOBILE_URL}/client/home`);
    await expect(page.getByTestId("cooker-card").first()).toBeVisible({
      timeout: TIMEOUT,
    });

    const body = await (await responsePromise).json();

    expect(body.data).toHaveLength(20);
    expect(body.total).toBeGreaterThan(20);
    expect(body.hasMore).toBe(true);
  });

  test("le spinner initial disparaît une fois la liste chargée", async ({
    page,
  }) => {
    await expect(page.getByTestId("loading-indicator")).not.toBeVisible();
    await expect(page.getByTestId("cooker-card").first()).toBeVisible({
      timeout: TIMEOUT,
    });
  });

  // ── 2. Scroll → chargement de la page suivante ──────────────────────────────

  test("le scroll en bas envoie une requête avec page=2 et limit=20", async ({
    page,
  }) => {
    const page2Promise = waitForCooksResponse(page, 2);
    await scrollCookerListToBottom(page);

    const response = await page2Promise;
    const params = new URL(response.url()).searchParams;

    expect(params.get("page")).toBe("2");
    expect(params.get("limit")).toBe("20");
  });

  test("la réponse page=2 contient des cuisiniers supplémentaires avec hasMore=true", async ({
    page,
  }) => {
    const page2Promise = waitForCooksResponse(page, 2);
    await scrollCookerListToBottom(page);

    const body = await (await page2Promise).json();

    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.length).toBeLessThanOrEqual(20);
    expect(body.hasMore).toBe(true);
  });

  test("l'indicateur de chargement supplémentaire s'affiche puis disparaît", async ({
    page,
  }) => {
    // Ralentir la réponse page=2 pour avoir le temps d'observer l'indicateur
    await page.route("**/cooks**", async (route) => {
      if (new URL(route.request().url()).searchParams.get("page") === "2") {
        await new Promise((r) => setTimeout(r, 600));
      }
      await route.continue();
    });

    await scrollCookerListToBottom(page);

    await expect(page.getByTestId("loading-more-indicator")).toBeVisible({
      timeout: TIMEOUT,
    });
    await expect(page.getByTestId("loading-more-indicator")).not.toBeVisible({
      timeout: TIMEOUT,
    });
  });

  // ── 3. Chargement complet de toutes les pages ────────────────────────────────

  test("le scroll successif charge toutes les pages (page 3 a hasMore=false)", async ({
    page,
  }) => {
    // Page 2
    const page2Promise = waitForCooksResponse(page, 2);
    await scrollCookerListToBottom(page);
    const page2Body = await (await page2Promise).json();
    expect(page2Body.hasMore).toBe(true);

    // Page 3 (les 10 derniers avec 50 cooks au total)
    const page3Promise = waitForCooksResponse(page, 3);
    await scrollCookerListToBottom(page);
    const page3Body = await (await page3Promise).json();

    expect(page3Body.data.length).toBeGreaterThan(0);
    expect(page3Body.hasMore).toBe(false);
  });

  test("aucune requête /cooks n'est émise après la dernière page", async ({
    page,
  }) => {
    // Charger toutes les pages
    const p2Promise = waitForCooksResponse(page, 2);
    await scrollCookerListToBottom(page);
    const p2 = await (await p2Promise).json();

    if (p2.hasMore) {
      const p3Promise = waitForCooksResponse(page, 3);
      await scrollCookerListToBottom(page);
      await p3Promise;
    }

    // Surveiller toute nouvelle requête
    let extraRequests = 0;
    page.on("request", (req) => {
      if (req.url().match(/\/cooks(\?|$)/) && req.method() === "GET")
        extraRequests++;
    });

    await scrollCookerListToBottom(page);
    await page.waitForLoadState("networkidle");

    expect(extraRequests).toBe(0);
  });

  // ── 4. Réinitialisation par les filtres ──────────────────────────────────────
  //
  // Ces tests vérifient que tout changement de filtre relance la requête
  // depuis page=1 avec les bons paramètres, indépendamment de la page actuelle.

  test("un filtre de recherche envoie une requête page=1 avec search=<valeur>", async ({
    page,
  }) => {
    const filterRespPromise = waitForCooksResponse(page, 1);
    await page.getByTestId("search-input").fill("Marie");

    const params = new URL((await filterRespPromise).url()).searchParams;

    expect(params.get("page")).toBe("1");
    expect(params.get("search")).toBe("Marie");
  });

  test("un filtre de spécialité envoie une requête page=1 avec speciality=<valeur>", async ({
    page,
  }) => {
    const filterRespPromise = waitForCooksResponse(page, 1);
    await page.getByTestId("speciality-chip-french_cooking").click();

    const params = new URL((await filterRespPromise).url()).searchParams;

    expect(params.get("page")).toBe("1");
    expect(params.get("speciality")).toBe("french_cooking");
  });

  test("effacer le filtre de recherche relance page=1 sans paramètre search", async ({
    page,
  }) => {
    // Appliquer un filtre
    await page.getByTestId("search-input").fill("Marie");
    await waitForCooksResponse(page, 1);

    // Effacer → nouvelle requête page=1 sans search
    const clearRespPromise = waitForCooksResponse(page, 1);
    await page.getByTestId("search-clear-btn").click();

    const params = new URL((await clearRespPromise).url()).searchParams;

    expect(params.get("page")).toBe("1");
    expect(params.has("search")).toBe(false);
  });

  test("changer de filtre depuis la page 2 repart de page=1", async ({
    page,
  }) => {
    // Charger page 2 d'abord
    const page2Promise = waitForCooksResponse(page, 2);
    await scrollCookerListToBottom(page);
    await page2Promise;

    // Appliquer un filtre → doit relancer depuis page=1
    const filterRespPromise = waitForCooksResponse(page, 1);
    await page.getByTestId("search-input").fill("Marie");

    const params = new URL((await filterRespPromise).url()).searchParams;

    expect(params.get("page")).toBe("1");
    expect(params.get("search")).toBe("Marie");
  });
});
