import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "@src/modules/user/user.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { CookImage } from "@src/modules/cook/cookImage.entity";
import { Client } from "@src/modules/client/client.entity";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres_password",
  database: process.env.POSTGRES_DB || "cook_us",
  entities: [User, Cook, CookImage, Client, CookRequestEntity],
  synchronize: true,
});

const COOK_PASSWORD = "cook1234";
const CLIENT_PASSWORD = "client1234";

const COOKS_DATA = [
  {
    firstName: "Pierre",
    lastName: "Martin",
    email: "pierre.martin@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 45,
    city: "Paris",
    isValidated: true,
    description:
      "Chef formé à l'École Ferrandi, spécialisé dans la bistronomy moderne. Je cuisine des plats du terroir revisités avec des produits de saison.",
  },
  {
    firstName: "Marie",
    lastName: "Dupont",
    email: "marie.dupont@cookus.app",
    speciality: "italian_cooking",
    hourlyRate: 55,
    city: "Lyon",
    isValidated: true,
    description:
      "Passionnée par la cuisine italienne authentique, j'ai vécu 5 ans à Rome et Florence. Pâtes fraîches, risottos et tiramisu maison sont mes spécialités.",
  },
  {
    firstName: "Jean-Baptiste",
    lastName: "Moreau",
    email: "jb.moreau@cookus.app",
    speciality: "asian_cooking",
    hourlyRate: 40,
    city: "Marseille",
    isValidated: true,
    description:
      "Autodidacte passionné par l'Asie du Sud-Est. Je propose des menus thaïlandais, vietnamiens et japonais avec des produits frais et authentiques.",
  },
  {
    firstName: "Maxence",
    lastName: "Dorizon",
    email: "maxence.dorizon@cookus.app",
    speciality: "vegetarian_cooking",
    hourlyRate: 1000000,
    city: "Bordeaux",
    isValidated: true,
    description:
      "Diététicien et chef cuisinier, je crée des menus végétariens et vegan gourmands et équilibrés. La preuve que manger sain peut être délicieux.",
  },
  {
    firstName: "Antoine",
    lastName: "Rousseau",
    email: "antoine.rousseau@cookus.app",
    speciality: "autre",
    hourlyRate: 38,
    city: "Toulouse",
    isValidated: true,
    description:
      "Champion régional de barbecue 2023. Viandes, poissons et légumes sur le grill, marinades maison et sauces artisanales. L'été à volonté.",
  },
  {
    firstName: "Camille",
    lastName: "Petit",
    email: "camille.petit@cookus.app",
    speciality: "pastry_cooking",
    hourlyRate: 62,
    city: "Paris",
    isValidated: true,
    description:
      "Ancienne pâtissière dans un palace parisien, je propose des buffets de desserts et des pièces montées pour vos événements. Créations sur mesure.",
  },
  {
    firstName: "Nicolas",
    lastName: "Leblanc",
    email: "nicolas.leblanc@cookus.app",
    speciality: "autre",
    hourlyRate: 48,
    city: "Nice",
    isValidated: true,
    description:
      "Né à Nice, je cuisine la Méditerranée : bouillabaisse, socca, ratatouille et mezze. Des saveurs solaires pour vos repas en famille ou entre amis.",
  },
  {
    firstName: "Isabelle",
    lastName: "Garnier",
    email: "isabelle.garnier@cookus.app",
    speciality: "japanese_cooking",
    hourlyRate: 70,
    city: "Paris",
    isValidated: true,
    description:
      "Formée à Paris et Tokyo, je propose une cuisine fusion qui marie techniques françaises et saveurs japonaises. Une expérience gastronomique unique.",
  },
  {
    firstName: "Thomas",
    lastName: "Mercier",
    email: "thomas.mercier@cookus.app",
    speciality: "autre",
    hourlyRate: 95,
    city: "Paris",
    isValidated: true,
    description:
      "Étoilé Michelin pendant 3 ans, je propose une expérience gastronomique à domicile. Menus dégustation 7 ou 9 services avec accords mets et vins.",
  },
  {
    firstName: "Léa",
    lastName: "Fontaine",
    email: "lea.fontaine@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 42,
    city: "Aix-en-Provence",
    isValidated: true,
    description:
      "Fille de restaurateurs provençaux, je transmets la chaleur de la cuisine du Sud. Produits du marché, herbes fraîches et huile d'olive de qualité.",
  },
  {
    firstName: "Maxime",
    lastName: "Chevalier",
    email: "maxime.chevalier@cookus.app",
    speciality: "japanese_cooking",
    hourlyRate: 68,
    city: "Paris",
    isValidated: false,
    description:
      "Formé au Japon pendant 2 ans, je prépare sushis, sashimis et yakitoris devant vos invités. Poissons sourcés directement chez les pêcheurs.",
  },
  {
    firstName: "Clara",
    lastName: "Roux",
    email: "clara.roux@cookus.app",
    speciality: "mexican_cooking",
    hourlyRate: 36,
    city: "Nantes",
    isValidated: true,
    description:
      "Revenue du Mexique après 18 mois d'immersion, je propose des tacos, enchiladas et guacamole authentiques. Épices et piments sélectionnés avec soin.",
  },
  {
    firstName: "Étienne",
    lastName: "Bernard",
    email: "etienne.bernard@cookus.app",
    speciality: "autre",
    hourlyRate: 32,
    city: "Lille",
    isValidated: true,
    description:
      "Globe-trotter culinaire, j'ai voyagé dans 30 pays et rapporté leurs recettes authentiques. Curry indien, pad thaï, shawarma et empanadas au programme.",
  },
  {
    firstName: "Amandine",
    lastName: "Leclerc",
    email: "amandine.leclerc@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 52,
    city: "Rennes",
    isValidated: false,
    description:
      "Originaire de Bretagne, je travaille avec les pêcheurs locaux pour vous proposer des fruits de mer ultra-frais. Plateaux, bisques et crepes salées.",
  },
  {
    firstName: "Romain",
    lastName: "Girard",
    email: "romain.girard@cookus.app",
    speciality: "autre",
    hourlyRate: 58,
    city: "Strasbourg",
    isValidated: true,
    description:
      "Chef créatif formé dans les grandes maisons alsaciennes, je propose une cuisine contemporaine alliant tradition et innovation. Menus personnalisés.",
  },
];

const CLIENTS_DATA = [
  {
    firstName: "Lucas",
    lastName: "Bernard",
    email: "lucas.bernard@cookus.app",
  },
  { firstName: "Emma", lastName: "Petit", email: "emma.petit@cookus.app" },
  { firstName: "Hugo", lastName: "Simon", email: "hugo.simon@cookus.app" },
  { firstName: "Chloé", lastName: "Dubois", email: "chloe.dubois@cookus.app" },
  { firstName: "Nathan", lastName: "Leroy", email: "nathan.leroy@cookus.app" },
  { firstName: "Zoé", lastName: "Girard", email: "zoe.girard@cookus.app" },
  { firstName: "Théo", lastName: "Bonnet", email: "theo.bonnet@cookus.app" },
  {
    firstName: "Manon",
    lastName: "Lefebvre",
    email: "manon.lefebvre@cookus.app",
  },
  {
    firstName: "Raphaël",
    lastName: "Marchand",
    email: "raphael.marchand@cookus.app",
  },
  {
    firstName: "Inès",
    lastName: "Bertrand",
    email: "ines.bertrand@cookus.app",
  },
  { firstName: "Louis", lastName: "Dumont", email: "louis.dumont@cookus.app" },
  {
    firstName: "Alice",
    lastName: "Renard",
    email: "alice.renard@cookus.app",
  },
  {
    firstName: "Valentin",
    lastName: "Morin",
    email: "valentin.morin@cookus.app",
  },
  {
    firstName: "Pauline",
    lastName: "Simon",
    email: "pauline.simon@cookus.app",
  },
  {
    firstName: "Clément",
    lastName: "Laurent",
    email: "clement.laurent@cookus.app",
  },
];

async function seed() {
  await dataSource.initialize();
  console.log("Connecté à la base de données");

  await dataSource.query(
    "TRUNCATE TABLE cook_request, cook_image, client, cook, users RESTART IDENTITY CASCADE",
  );
  console.log("Tables vidées");

  const userRepo = dataSource.getRepository(User);
  const cookRepo = dataSource.getRepository(Cook);
  const clientRepo = dataSource.getRepository(Client);
  const cookRequestRepo = dataSource.getRepository(CookRequestEntity);

  // --- Admin ---
  await userRepo.save({
    firstName: "Admin",
    lastName: "Cook-Us",
    email: "admin@cookus.app",
    role: UserRole.ADMIN,
    password: await bcrypt.hash("admin1234", 10),
  });
  console.log("Admin créé");

  // --- Cooks ---
  const hashedCookPassword = await bcrypt.hash(COOK_PASSWORD, 10);
  const cooks: Cook[] = [];

  for (const data of COOKS_DATA) {
    const user = await userRepo.save({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: UserRole.COOK,
      password: hashedCookPassword,
    });
    const cook = await cookRepo.save({
      firstName: data.firstName,
      lastName: data.lastName,
      speciality: data.speciality,
      hourlyRate: data.hourlyRate,
      city: data.city,
      isActive: true,
      isValidated: data.isValidated,
      description: data.description,
      userId: user.id,
    });
    cooks.push(cook);
  }
  console.log(`${cooks.length} cooks créés`);

  // --- Clients ---
  const hashedClientPassword = await bcrypt.hash(CLIENT_PASSWORD, 10);
  const clients: Client[] = [];

  for (const data of CLIENTS_DATA) {
    const user = await userRepo.save({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: UserRole.CLIENT,
      password: hashedClientPassword,
    });
    const client = await clientRepo.save({ userId: user.id });
    clients.push(client);
  }
  console.log(`${clients.length} clients créés`);

  // --- Cook requests ---
  const requests: Partial<CookRequestEntity>[] = [
    // Passées - accepted
    {
      guestsNumber: 6,
      startDate: new Date("2025-11-10T19:00:00Z"),
      endDate: new Date("2025-11-10T23:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[0].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 4,
      startDate: new Date("2025-11-22T12:00:00Z"),
      endDate: new Date("2025-11-22T15:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[1].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 10,
      startDate: new Date("2025-12-01T18:30:00Z"),
      endDate: new Date("2025-12-01T23:30:00Z"),
      cookId: cooks[8].id,
      clientId: clients[2].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 8,
      startDate: new Date("2025-12-14T19:00:00Z"),
      endDate: new Date("2025-12-14T22:30:00Z"),
      cookId: cooks[5].id,
      clientId: clients[3].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 3,
      startDate: new Date("2025-12-20T20:00:00Z"),
      endDate: null,
      cookId: cooks[2].id,
      clientId: clients[4].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 12,
      startDate: new Date("2025-12-31T19:00:00Z"),
      endDate: new Date("2026-01-01T01:00:00Z"),
      cookId: cooks[8].id,
      clientId: clients[5].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 5,
      startDate: new Date("2026-01-08T19:30:00Z"),
      endDate: new Date("2026-01-08T22:30:00Z"),
      cookId: cooks[6].id,
      clientId: clients[6].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 7,
      startDate: new Date("2026-01-18T12:00:00Z"),
      endDate: new Date("2026-01-18T15:00:00Z"),
      cookId: cooks[3].id,
      clientId: clients[7].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 2,
      startDate: new Date("2026-02-01T20:00:00Z"),
      endDate: new Date("2026-02-01T22:00:00Z"),
      cookId: cooks[7].id,
      clientId: clients[8].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 20,
      startDate: new Date("2026-02-14T18:00:00Z"),
      endDate: new Date("2026-02-14T23:00:00Z"),
      cookId: cooks[4].id,
      clientId: clients[9].id,
      status: CookRequestStatus.ACCEPTED,
    },
    // Passées - refused
    {
      guestsNumber: 15,
      startDate: new Date("2025-11-05T18:00:00Z"),
      endDate: null,
      cookId: cooks[0].id,
      clientId: clients[2].id,
      status: CookRequestStatus.REFUSED,
    },
    {
      guestsNumber: 4,
      startDate: new Date("2025-12-07T20:00:00Z"),
      endDate: new Date("2025-12-07T23:00:00Z"),
      cookId: cooks[9].id,
      clientId: clients[10].id,
      status: CookRequestStatus.REFUSED,
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-01-12T12:30:00Z"),
      endDate: new Date("2026-01-12T15:30:00Z"),
      cookId: cooks[11].id,
      clientId: clients[11].id,
      status: CookRequestStatus.REFUSED,
    },
    // Passées - cancelled
    {
      guestsNumber: 8,
      startDate: new Date("2025-11-28T19:00:00Z"),
      endDate: new Date("2025-11-28T22:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[0].id,
      status: CookRequestStatus.CANCELLED,
    },
    {
      guestsNumber: 5,
      startDate: new Date("2025-12-24T18:00:00Z"),
      endDate: new Date("2025-12-24T23:59:00Z"),
      cookId: cooks[5].id,
      clientId: clients[12].id,
      status: CookRequestStatus.CANCELLED,
    },
    {
      guestsNumber: 3,
      startDate: new Date("2026-02-10T20:00:00Z"),
      endDate: null,
      cookId: cooks[7].id,
      clientId: clients[13].id,
      status: CookRequestStatus.CANCELLED,
    },
    // À venir - pending
    {
      guestsNumber: 4,
      startDate: new Date("2026-03-15T18:00:00Z"),
      endDate: new Date("2026-03-15T22:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[0].id,
      status: CookRequestStatus.PENDING,
    },
    {
      guestsNumber: 8,
      startDate: new Date("2026-03-20T19:00:00Z"),
      endDate: null,
      cookId: cooks[2].id,
      clientId: clients[1].id,
      status: CookRequestStatus.PENDING,
    },
    {
      guestsNumber: 2,
      startDate: new Date("2026-03-22T12:00:00Z"),
      endDate: new Date("2026-03-22T14:00:00Z"),
      cookId: cooks[6].id,
      clientId: clients[2].id,
      status: CookRequestStatus.PENDING,
    },
    {
      guestsNumber: 14,
      startDate: new Date("2026-03-28T18:30:00Z"),
      endDate: new Date("2026-03-28T23:30:00Z"),
      cookId: cooks[8].id,
      clientId: clients[3].id,
      status: CookRequestStatus.PENDING,
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-04-05T19:00:00Z"),
      endDate: new Date("2026-04-05T22:00:00Z"),
      cookId: cooks[3].id,
      clientId: clients[4].id,
      status: CookRequestStatus.PENDING,
    },
    {
      guestsNumber: 10,
      startDate: new Date("2026-04-12T12:00:00Z"),
      endDate: null,
      cookId: cooks[10].id,
      clientId: clients[5].id,
      status: CookRequestStatus.PENDING,
    },
    {
      guestsNumber: 5,
      startDate: new Date("2026-04-18T19:30:00Z"),
      endDate: new Date("2026-04-18T22:30:00Z"),
      cookId: cooks[13].id,
      clientId: clients[6].id,
      status: CookRequestStatus.PENDING,
    },
    {
      guestsNumber: 3,
      startDate: new Date("2026-04-25T20:00:00Z"),
      endDate: new Date("2026-04-25T23:00:00Z"),
      cookId: cooks[9].id,
      clientId: clients[7].id,
      status: CookRequestStatus.PENDING,
    },
    // À venir - accepted
    {
      guestsNumber: 30,
      startDate: new Date("2026-03-10T18:00:00Z"),
      endDate: new Date("2026-03-10T23:00:00Z"),
      cookId: cooks[4].id,
      clientId: clients[8].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 7,
      startDate: new Date("2026-03-12T19:00:00Z"),
      endDate: new Date("2026-03-12T22:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[9].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 4,
      startDate: new Date("2026-03-18T12:30:00Z"),
      endDate: new Date("2026-03-18T15:00:00Z"),
      cookId: cooks[14].id,
      clientId: clients[10].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 16,
      startDate: new Date("2026-04-01T18:00:00Z"),
      endDate: null,
      cookId: cooks[5].id,
      clientId: clients[11].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 9,
      startDate: new Date("2026-04-10T19:00:00Z"),
      endDate: new Date("2026-04-10T22:30:00Z"),
      cookId: cooks[11].id,
      clientId: clients[12].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-05-01T12:00:00Z"),
      endDate: new Date("2026-05-01T16:00:00Z"),
      cookId: cooks[2].id,
      clientId: clients[13].id,
      status: CookRequestStatus.ACCEPTED,
    },
    {
      guestsNumber: 12,
      startDate: new Date("2026-05-10T18:30:00Z"),
      endDate: new Date("2026-05-10T23:00:00Z"),
      cookId: cooks[7].id,
      clientId: clients[14].id,
      status: CookRequestStatus.ACCEPTED,
    },
  ];

  await cookRequestRepo.save(requests);
  console.log(`${requests.length} demandes de cook créées`);

  await dataSource.destroy();
  console.log("\nSeed terminé avec succès !");
  console.log("──────────────────────────────────────");
  console.log(`Admin    : admin@cookus.app / admin1234`);
  console.log(`Cooks    : *@cookus.app    / ${COOK_PASSWORD}`);
  console.log(`Clients  : *@cookus.app    / ${CLIENT_PASSWORD}`);
  console.log("──────────────────────────────────────");
}

seed().catch((error) => {
  console.error("Seed échoué :", error);
  process.exit(1);
});
