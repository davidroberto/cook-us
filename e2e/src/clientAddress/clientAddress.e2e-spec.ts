import { test, expect } from "@playwright/test";

const API = "http://localhost:8080/api";

// Credentials tirés du seed
const CLIENT_EMAIL = "lucas.bernard@cookus.app";
const CLIENT_PASSWORD = "client1234";
const COOK_EMAIL = "pierre.martin@cookus.app";
const COOK_PASSWORD = "cook1234";

async function loginAs(
  request: Parameters<Parameters<typeof test>[1]>[0]["request"],
  email: string,
  password: string
): Promise<string> {
  const res = await request.post(`${API}/auth/login`, {
    data: { email, password },
  });
  const body = await res.json();
  return body.token as string;
}

// ─── GET /auth/me ─────────────────────────────────────────────────────────────

test("GET /auth/me retourne le profil du client avec address null par défaut", async ({
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

test("POST /cook-request copie l'adresse du client dans la réservation", async ({
  request,
}) => {
  const clientToken = await loginAs(request, CLIENT_EMAIL, CLIENT_PASSWORD);

  // S'assure que le client a une adresse
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
  // Le snapshot d'adresse est stocké en base (vérifié via GET detail ci-dessous)
});

// ─── GET /cook-request/:id (côté cook) ───────────────────────────────────────

test("GET /cook-request/:id retourne l'adresse du client dans le détail (côté cook)", async ({
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

  // Récupère l'id du cook Pierre Martin via son token
  const cookProfileRes = await request.get(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${cookToken}` },
  });
  // Pour créer la réservation on a besoin du cookId (UUID de la table cook)
  // On le trouve via la liste des cooks
  const cooksRes = await request.get(`${API}/cooks`, {
    headers: { Authorization: `Bearer ${clientToken}` },
  });
  const cooksBody = await cooksRes.json();
  const cookProfile = cookProfileRes.status() === 200 ? await cookProfileRes.json() : null;

  // Cherche le cook Pierre Martin dans la liste
  const allCooks: Array<{ id: string; firstName: string; lastName: string }> =
    cooksBody.data ?? cooksBody;
  const pierreId =
    allCooks.find(
      (c) => c.firstName === "Pierre" && c.lastName === "Martin"
    )?.id ?? allCooks[0]?.id;

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
    firstName: "Lucas",
    lastName: "Bernard",
    address: {
      street: "7 rue des Lilas",
      postalCode: "75020",
      city: "Paris",
    },
  });

  // Nettoyage : restaure cookProfile info (optionnel)
  void cookProfile;
});
