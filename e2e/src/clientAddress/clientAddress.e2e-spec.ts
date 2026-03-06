import { expect, test, type APIRequestContext } from "@playwright/test";

const API = "http://localhost:8080/api";

// Credentials tirés du seed
const CLIENT_EMAIL = "test.cliaddr.client@cookus.app";
const CLIENT_PASSWORD = "client1234";
const COOK_EMAIL = "pierre.martin@cookus.app";
const COOK_PASSWORD = "cook1234";

async function loginAs(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<string> {
  const res = await request.post(`${API}/auth/login`, {
    data: { email, password },
  });
  const body = await res.json();
  return body.token as string;
}

// ─── GET /auth/me ─────────────────────────────────────────────────────────────

test("GET /auth/me retourne le profil du client avec le champ address", async ({
  request,
}) => {
  const token = await loginAs(request, CLIENT_EMAIL, CLIENT_PASSWORD);

  const res = await request.get(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toMatchObject({
    email: CLIENT_EMAIL,
    role: "client",
  });
  expect(body).toHaveProperty("address");
});

// ─── PATCH /auth/me — sérialisés pour éviter la race condition ────────────────

test.describe.serial("PATCH /auth/me adresse", () => {
  test("met à jour l'adresse du client et la retourne", async ({ request }) => {
    const token = await loginAs(request, CLIENT_EMAIL, CLIENT_PASSWORD);

    const res = await request.patch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        street: "12 rue de la Paix",
        postalCode: "75001",
        city: "Paris",
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.address).toEqual({
      street: "12 rue de la Paix",
      postalCode: "75001",
      city: "Paris",
    });
  });

  test("GET /auth/me retourne l'adresse après mise à jour", async ({
    request,
  }) => {
    const token = await loginAs(request, CLIENT_EMAIL, CLIENT_PASSWORD);

    // Met à jour
    await request.patch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        street: "5 avenue Montaigne",
        postalCode: "75008",
        city: "Paris",
      },
    });

    // Relit le profil
    const res = await request.get(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.address).toMatchObject({
      street: "5 avenue Montaigne",
      postalCode: "75008",
      city: "Paris",
    });
  });
});

// ─── POST /cook-request ──────────────────────────────────────────────────────

test("POST /cook-request utilise l'adresse du profil client en fallback", async ({
  request,
}) => {
  const clientToken = await loginAs(request, CLIENT_EMAIL, CLIENT_PASSWORD);

  // S'assure que le client a une adresse enregistrée sur son profil
  await request.patch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${clientToken}` },
    data: { street: "3 rue du Four", postalCode: "75006", city: "Paris" },
  });

  // Récupère un cuisinier disponible
  const cooksRes = await request.get(`${API}/cooks`, {
    headers: { Authorization: `Bearer ${clientToken}` },
  });
  const cooksBody = await cooksRes.json();
  const cookId = cooksBody.data?.[0]?.id ?? cooksBody[0]?.id;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30);
  tomorrow.setHours(19, 0, 0, 0);

  // Crée une demande sans adresse → le backend utilise l'adresse du profil en fallback
  const res = await request.post(`${API}/cook-request`, {
    headers: { Authorization: `Bearer ${clientToken}` },
    data: {
      cookId,
      guestsNumber: 4,
      startDate: tomorrow.toISOString(),
      mealType: "dinner",
    },
  });

  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body).toHaveProperty("id");
  expect(body).toHaveProperty("clientId");
});

// ─── PATCH /cook-request/:id/address ─────────────────────────────────────────

test("PATCH /cook-request/:id/address met à jour l'adresse de la demande", async ({
  request,
}) => {
  const clientToken = await loginAs(request, CLIENT_EMAIL, CLIENT_PASSWORD);
  const cookToken = await loginAs(request, COOK_EMAIL, COOK_PASSWORD);

  // Récupère Pierre Martin (le cook connecté) via son email
  const cooksRes = await request.get(`${API}/cooks?limit=50`, {
    headers: { Authorization: `Bearer ${clientToken}` },
  });
  const cooksBody = await cooksRes.json();
  const allCooks: Array<{ id: string; user?: { email: string } }> =
    cooksBody.data ?? cooksBody;
  const cookId =
    allCooks.find((c) => c.user?.email === COOK_EMAIL)?.id ?? allCooks[0]?.id;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 60);
  tomorrow.setHours(20, 0, 0, 0);

  // Crée une demande avec adresse initiale
  const createRes = await request.post(`${API}/cook-request`, {
    headers: { Authorization: `Bearer ${clientToken}` },
    data: {
      cookId,
      guestsNumber: 3,
      startDate: tomorrow.toISOString(),
      mealType: "dinner",
      street: "1 rue Initiale",
      postalCode: "75001",
      city: "Paris",
    },
  });
  expect(createRes.status()).toBe(201);
  const created = await createRes.json();
  const requestId = created.id;

  // Met à jour l'adresse
  const patchRes = await request.patch(
    `${API}/cook-request/${requestId}/address`,
    {
      headers: { Authorization: `Bearer ${clientToken}` },
      data: {
        street: "99 rue Modifiée",
        postalCode: "75020",
        city: "Paris",
      },
    },
  );
  expect(patchRes.status()).toBe(200);

  // Vérifie via le détail de la demande côté cook
  const detailRes = await request.get(`${API}/cook-request/${requestId}`, {
    headers: { Authorization: `Bearer ${cookToken}` },
  });
  expect(detailRes.status()).toBe(200);
  const detail = await detailRes.json();
  expect(detail.client.address).toMatchObject({
    street: "99 rue Modifiée",
    postalCode: "75020",
    city: "Paris",
  });
});

// ─── GET /cook-request/:id (côté cook) ───────────────────────────────────────

test("GET /cook-request/:id retourne l'adresse de la prestation dans le détail (côté cook)", async ({
  request,
}) => {
  const clientToken = await loginAs(request, CLIENT_EMAIL, CLIENT_PASSWORD);
  const cookToken = await loginAs(request, COOK_EMAIL, COOK_PASSWORD);

  // Met à jour l'adresse du client
  await request.patch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${clientToken}` },
    data: {
      street: "7 rue des Lilas",
      postalCode: "75020",
      city: "Paris",
    },
  });

  // Récupère Pierre Martin (le cook connecté) via son email
  const cooksRes = await request.get(`${API}/cooks?limit=50`, {
    headers: { Authorization: `Bearer ${clientToken}` },
  });
  const cooksBody = await cooksRes.json();
  const allCooks: Array<{ id: string; user?: { email: string } }> =
    cooksBody.data ?? cooksBody;
  const pierreId =
    allCooks.find((c) => c.user?.email === COOK_EMAIL)?.id ?? allCooks[0]?.id;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 45);
  tomorrow.setHours(20, 0, 0, 0);

  const createRes = await request.post(`${API}/cook-request`, {
    headers: { Authorization: `Bearer ${clientToken}` },
    data: {
      cookId: pierreId,
      guestsNumber: 2,
      startDate: tomorrow.toISOString(),
      mealType: "dinner",
    },
  });

  expect(createRes.status()).toBe(201);
  const created = await createRes.json();
  const requestId = created.id;

  // Le cook consulte la réservation
  const detailRes = await request.get(`${API}/cook-request/${requestId}`, {
    headers: { Authorization: `Bearer ${cookToken}` },
  });

  expect(detailRes.status()).toBe(200);
  const detail = await detailRes.json();

  expect(detail.client).toMatchObject({
    firstName: "Test",
    lastName: "CliAddrClient",
    address: {
      street: "7 rue des Lilas",
      postalCode: "75020",
      city: "Paris",
    },
  });
});
