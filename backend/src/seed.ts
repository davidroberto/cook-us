import { Client } from "@src/modules/client/client.entity";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";
import { Message } from "@src/modules/conversation/message.entity";
import {
  CookRequestEntity,
  CookRequestStatus,
  MealType,
} from "@src/modules/cook-request/cookRequest.entity";
import { Review } from "@src/modules/cook-request/review.entity";
import { Cook, CookValidationStatus } from "@src/modules/cook/cook.entity";
import { CookImage } from "@src/modules/cook/cookImage.entity";
import { User, UserRole } from "@src/modules/user/user.entity";
import * as bcrypt from "bcrypt";
import { DataSource } from "typeorm";

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres_password",
  database: process.env.POSTGRES_DB || "cook_us",
  entities: [
    User,
    Cook,
    CookImage,
    Client,
    CookRequestEntity,
    Review,
    Conversation,
    ConversationParticipant,
    Message,
  ],
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
    siret: "44332211500067",
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
    siret: "34567890100125",
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
    thumbnail:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
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
    siret: "13579024600163",
    description:
      "Chef créatif formé dans les grandes maisons alsaciennes, je propose une cuisine contemporaine alliant tradition et innovation. Menus personnalisés.",
  },
];

const CLIENTS_DATA = [
  {
    firstName: "Lucas",
    lastName: "Bernard",
    email: "lucas.bernard@cookus.app",
    thumbnail:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200",
  },
  {
    firstName: "Emma",
    lastName: "Petit",
    email: "emma.petit@cookus.app",
    thumbnail:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  },
  {
    firstName: "Hugo",
    lastName: "Simon",
    email: "hugo.simon@cookus.app",
  },
  {
    firstName: "Chloé",
    lastName: "Dubois",
    email: "chloe.dubois@cookus.app",
    thumbnail:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200",
  },
  {
    firstName: "Nathan",
    lastName: "Leroy",
    email: "nathan.leroy@cookus.app",
  },
  {
    firstName: "Zoé",
    lastName: "Girard",
    email: "zoe.girard@cookus.app",
    thumbnail:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200",
  },
  {
    firstName: "Théo",
    lastName: "Bonnet",
    email: "theo.bonnet@cookus.app",
    thumbnail:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200",
  },
  {
    firstName: "Manon",
    lastName: "Lefebvre",
    email: "manon.lefebvre@cookus.app",
  },
  {
    firstName: "Raphaël",
    lastName: "Marchand",
    email: "raphael.marchand@cookus.app",
    thumbnail:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200",
  },
  {
    firstName: "Inès",
    lastName: "Bertrand",
    email: "ines.bertrand@cookus.app",
    thumbnail:
      "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=200",
  },
  {
    firstName: "Louis",
    lastName: "Dumont",
    email: "louis.dumont@cookus.app",
  },
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
    thumbnail:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
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
    "TRUNCATE TABLE conversation, cook_request, cook_image, client, cook, users RESTART IDENTITY CASCADE"
  );
  console.log("Tables vidées");

  const userRepo = dataSource.getRepository(User);
  const cookRepo = dataSource.getRepository(Cook);
  const cookImageRepo = dataSource.getRepository(CookImage);
  const clientRepo = dataSource.getRepository(Client);
  const cookRequestRepo = dataSource.getRepository(CookRequestEntity);
  const conversationRepo = dataSource.getRepository(Conversation);
  const participantRepo = dataSource.getRepository(ConversationParticipant);
  const messageRepo = dataSource.getRepository(Message);

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
      ...(data.thumbnail ? { thumbnail: data.thumbnail } : {}),
    });
    const cook = await cookRepo.save({
      firstName: data.firstName,
      lastName: data.lastName,
      speciality: data.speciality,
      siret: data.siret,
      hourlyRate: data.hourlyRate,
      city: data.city,
      isActive: true,
      isValidated: data.isValidated,
      validationStatus: data.isValidated
        ? CookValidationStatus.VALIDATED
        : CookValidationStatus.PENDING,
      description: data.description,
      userId: user.id,
    });
    cooks.push(cook);
  }
  console.log(`${cooks.length} cooks créés`);

  // --- Cook images (photos de plats) ---
  const COOK_IMAGES: {
    cookIndex: number;
    description: string;
    imgUrl: string;
  }[] = [
    // Pierre Martin — french_cooking
    {
      cookIndex: 0,
      description: "Bœuf bourguignon traditionnel",
      imgUrl:
        "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600",
    },
    {
      cookIndex: 0,
      description: "Tarte tatin aux pommes caramélisées",
      imgUrl:
        "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=600",
    },
    {
      cookIndex: 0,
      description: "Coq au vin sauce onctueuse",
      imgUrl:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600",
    },
    // Marie Dupont — italian_cooking
    {
      cookIndex: 1,
      description: "Tagliatelles fraîches aux truffes",
      imgUrl: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=600",
    },
    {
      cookIndex: 1,
      description: "Risotto alla milanese au safran",
      imgUrl:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600",
    },
    {
      cookIndex: 1,
      description: "Tiramisu maison au café",
      imgUrl:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600",
    },
    // Jean-Baptiste Moreau — asian_cooking
    {
      cookIndex: 2,
      description: "Pad thaï aux crevettes",
      imgUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600",
    },
    {
      cookIndex: 2,
      description: "Ramen tonkotsu maison",
      imgUrl:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
    },
    {
      cookIndex: 2,
      description: "Rouleaux de printemps frais",
      imgUrl: "https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=600",
    },
    // Maxence Dorizon — vegetarian_cooking
    {
      cookIndex: 3,
      description: "Bowl végétarien quinoa et avocat",
      imgUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    },
    {
      cookIndex: 3,
      description: "Curry de légumes au lait de coco",
      imgUrl:
        "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600",
    },
    {
      cookIndex: 3,
      description: "Lasagnes végétariennes aux épinards",
      imgUrl:
        "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600",
    },
    // Antoine Rousseau — autre (barbecue)
    {
      cookIndex: 4,
      description: "Côte de bœuf grillée au feu de bois",
      imgUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=600",
    },
    {
      cookIndex: 4,
      description: "Brochettes marinées aux herbes",
      imgUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
    },
    // Camille Petit — pastry_cooking
    {
      cookIndex: 5,
      description: "Paris-Brest praliné noisette",
      imgUrl:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
    },
    {
      cookIndex: 5,
      description: "Éclairs au chocolat noir",
      imgUrl:
        "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=600",
    },
    {
      cookIndex: 5,
      description: "Tarte aux fruits rouges",
      imgUrl:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600",
    },
    {
      cookIndex: 5,
      description: "Macarons assortis",
      imgUrl:
        "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600",
    },
    // Nicolas Leblanc — autre (méditerranéen)
    {
      cookIndex: 6,
      description: "Bouillabaisse marseillaise",
      imgUrl:
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600",
    },
    {
      cookIndex: 6,
      description: "Ratatouille provençale",
      imgUrl:
        "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=600",
    },
    // Isabelle Garnier — japanese_cooking
    {
      cookIndex: 7,
      description: "Assortiment de sushis et makis",
      imgUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600",
    },
    {
      cookIndex: 7,
      description: "Tempura de crevettes et légumes",
      imgUrl:
        "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600",
    },
    {
      cookIndex: 7,
      description: "Gyozas porc et gingembre",
      imgUrl:
        "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600",
    },
    // Thomas Mercier — autre (gastronomique)
    {
      cookIndex: 8,
      description: "Foie gras poêlé aux figues",
      imgUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    },
    {
      cookIndex: 8,
      description: "Saint-Jacques snackées au beurre noisette",
      imgUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    },
    {
      cookIndex: 8,
      description: "Soufflé au Grand Marnier",
      imgUrl:
        "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600",
    },
    // Léa Fontaine — french_cooking (provençal)
    {
      cookIndex: 9,
      description: "Aïoli provençal aux légumes du marché",
      imgUrl:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
    },
    {
      cookIndex: 9,
      description: "Tian de légumes du soleil",
      imgUrl:
        "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600",
    },
    // Clara Roux — mexican_cooking
    {
      cookIndex: 11,
      description: "Tacos al pastor maison",
      imgUrl:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600",
    },
    {
      cookIndex: 11,
      description: "Guacamole frais et chips tortilla",
      imgUrl:
        "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=600",
    },
    {
      cookIndex: 11,
      description: "Enchiladas au poulet et mole",
      imgUrl:
        "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=600",
    },
    // Étienne Bernard — autre (world food)
    {
      cookIndex: 12,
      description: "Curry indien butter chicken",
      imgUrl:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600",
    },
    {
      cookIndex: 12,
      description: "Empanadas argentines",
      imgUrl:
        "https://images.unsplash.com/photo-1604467707321-70d009801bf4?w=600",
    },
  ];

  for (const img of COOK_IMAGES) {
    await cookImageRepo.save({
      cookId: cooks[img.cookIndex].id,
      imgUrl: img.imgUrl,
      description: img.description,
    });
  }
  console.log(`${COOK_IMAGES.length} photos de plats créées`);

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
      ...("thumbnail" in data && data.thumbnail
        ? { thumbnail: data.thumbnail }
        : {}),
    });
    const client = await clientRepo.save({ userId: user.id });
    clients.push(client);
  }
  console.log(`${clients.length} clients créés`);

  // --- Cook requests avec conversations ---
  // Reproduit le comportement du backend : chaque cook request a une conversation.
  // Si un même couple client/cook a plusieurs demandes, elles partagent la même conversation.

  function formatDateDDMMYYYY(date: Date): string {
    const d = date.getUTCDate().toString().padStart(2, "0");
    const m = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const y = date.getUTCFullYear();
    return `${d}-${m}-${y}`;
  }

  const conversationMap = new Map<string, number>();

  async function getOrCreateConversation(
    clientUserId: number,
    cookUserId: number
  ): Promise<number> {
    const key = `${clientUserId}-${cookUserId}`;
    if (conversationMap.has(key)) return conversationMap.get(key);

    const conversation = await conversationRepo.save(conversationRepo.create());
    await participantRepo.save([
      participantRepo.create({
        authorId: clientUserId,
        conversationId: conversation.id,
      }),
      participantRepo.create({
        authorId: cookUserId,
        conversationId: conversation.id,
      }),
    ]);
    conversationMap.set(key, conversation.id);
    return conversation.id;
  }

  const requests: Partial<CookRequestEntity>[] = [
    // Passées - accepted
    {
      guestsNumber: 6,
      startDate: new Date("2025-11-10T19:00:00Z"),
      endDate: new Date("2025-11-10T23:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[0].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      message:
        "Bonjour, nous célébrons un anniversaire, menu surprise bienvenu !",
    },
    {
      guestsNumber: 4,
      startDate: new Date("2025-11-22T12:00:00Z"),
      endDate: new Date("2025-11-22T15:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[1].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.LUNCH,
    },
    {
      guestsNumber: 10,
      startDate: new Date("2025-12-01T18:30:00Z"),
      endDate: new Date("2025-12-01T23:30:00Z"),
      cookId: cooks[8].id,
      clientId: clients[2].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      message:
        "Repas d'entreprise, une personne allergique aux fruits à coque.",
    },
    {
      guestsNumber: 8,
      startDate: new Date("2025-12-14T19:00:00Z"),
      endDate: new Date("2025-12-14T22:30:00Z"),
      cookId: cooks[5].id,
      clientId: clients[3].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 3,
      startDate: new Date("2025-12-20T20:00:00Z"),
      endDate: null,
      cookId: cooks[2].id,
      clientId: clients[4].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 12,
      startDate: new Date("2025-12-31T19:00:00Z"),
      endDate: new Date("2026-01-01T01:00:00Z"),
      cookId: cooks[8].id,
      clientId: clients[5].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      message:
        "Soirée du réveillon, nous souhaitons un menu festif avec champagne.",
    },
    {
      guestsNumber: 5,
      startDate: new Date("2026-01-08T19:30:00Z"),
      endDate: new Date("2026-01-08T22:30:00Z"),
      cookId: cooks[6].id,
      clientId: clients[6].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 7,
      startDate: new Date("2026-01-18T12:00:00Z"),
      endDate: new Date("2026-01-18T15:00:00Z"),
      cookId: cooks[3].id,
      clientId: clients[7].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.LUNCH,
    },
    {
      guestsNumber: 2,
      startDate: new Date("2026-02-01T20:00:00Z"),
      endDate: new Date("2026-02-01T22:00:00Z"),
      cookId: cooks[7].id,
      clientId: clients[8].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      message:
        "Dîner romantique pour la Saint-Valentin en avance, ambiance cosy.",
    },
    {
      guestsNumber: 20,
      startDate: new Date("2026-02-14T18:00:00Z"),
      endDate: new Date("2026-02-14T23:00:00Z"),
      cookId: cooks[4].id,
      clientId: clients[9].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
    },
    // Passées - refused
    {
      guestsNumber: 15,
      startDate: new Date("2025-11-05T18:00:00Z"),
      endDate: null,
      cookId: cooks[0].id,
      clientId: clients[2].id,
      status: CookRequestStatus.REFUSED,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 4,
      startDate: new Date("2025-12-07T20:00:00Z"),
      endDate: new Date("2025-12-07T23:00:00Z"),
      cookId: cooks[9].id,
      clientId: clients[10].id,
      status: CookRequestStatus.REFUSED,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-01-12T12:30:00Z"),
      endDate: new Date("2026-01-12T15:30:00Z"),
      cookId: cooks[11].id,
      clientId: clients[11].id,
      status: CookRequestStatus.REFUSED,
      mealType: MealType.LUNCH,
    },
    // Passées - cancelled
    {
      guestsNumber: 8,
      startDate: new Date("2025-11-28T19:00:00Z"),
      endDate: new Date("2025-11-28T22:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[0].id,
      status: CookRequestStatus.CANCELLED,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 5,
      startDate: new Date("2025-12-24T18:00:00Z"),
      endDate: new Date("2025-12-24T23:59:00Z"),
      cookId: cooks[5].id,
      clientId: clients[12].id,
      status: CookRequestStatus.CANCELLED,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 3,
      startDate: new Date("2026-02-10T20:00:00Z"),
      endDate: null,
      cookId: cooks[7].id,
      clientId: clients[13].id,
      status: CookRequestStatus.CANCELLED,
      mealType: MealType.DINNER,
    },
    // À venir - pending
    {
      guestsNumber: 4,
      startDate: new Date("2026-03-15T18:00:00Z"),
      endDate: new Date("2026-03-15T22:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[0].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
      message: "Bonjour, nous sommes 2 végétariens et 2 carnivores.",
    },
    {
      guestsNumber: 8,
      startDate: new Date("2026-03-20T19:00:00Z"),
      endDate: null,
      cookId: cooks[2].id,
      clientId: clients[1].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 2,
      startDate: new Date("2026-03-22T12:00:00Z"),
      endDate: new Date("2026-03-22T14:00:00Z"),
      cookId: cooks[6].id,
      clientId: clients[2].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.LUNCH,
      message: "Déjeuner d'affaires, cuisine légère et raffinée souhaitée.",
    },
    {
      guestsNumber: 14,
      startDate: new Date("2026-03-28T18:30:00Z"),
      endDate: new Date("2026-03-28T23:30:00Z"),
      cookId: cooks[8].id,
      clientId: clients[3].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-04-05T19:00:00Z"),
      endDate: new Date("2026-04-05T22:00:00Z"),
      cookId: cooks[3].id,
      clientId: clients[4].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 10,
      startDate: new Date("2026-04-12T12:00:00Z"),
      endDate: null,
      cookId: cooks[10].id,
      clientId: clients[5].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.LUNCH,
    },
    {
      guestsNumber: 5,
      startDate: new Date("2026-04-18T19:30:00Z"),
      endDate: new Date("2026-04-18T22:30:00Z"),
      cookId: cooks[13].id,
      clientId: clients[6].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 3,
      startDate: new Date("2026-04-25T20:00:00Z"),
      endDate: new Date("2026-04-25T23:00:00Z"),
      cookId: cooks[9].id,
      clientId: clients[7].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
    },
    // À venir - accepted
    {
      guestsNumber: 30,
      startDate: new Date("2026-03-10T18:00:00Z"),
      endDate: new Date("2026-03-10T23:00:00Z"),
      cookId: cooks[4].id,
      clientId: clients[8].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      message: "Événement associatif, budget maîtrisé, cuisine conviviale.",
    },
    {
      guestsNumber: 7,
      startDate: new Date("2026-03-12T19:00:00Z"),
      endDate: new Date("2026-03-12T22:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[9].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 4,
      startDate: new Date("2026-03-18T12:30:00Z"),
      endDate: new Date("2026-03-18T15:00:00Z"),
      cookId: cooks[14].id,
      clientId: clients[10].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.LUNCH,
    },
    {
      guestsNumber: 16,
      startDate: new Date("2026-04-01T18:00:00Z"),
      endDate: null,
      cookId: cooks[5].id,
      clientId: clients[11].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 9,
      startDate: new Date("2026-04-10T19:00:00Z"),
      endDate: new Date("2026-04-10T22:30:00Z"),
      cookId: cooks[11].id,
      clientId: clients[12].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-05-01T12:00:00Z"),
      endDate: new Date("2026-05-01T16:00:00Z"),
      cookId: cooks[2].id,
      clientId: clients[13].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.LUNCH,
    },
    {
      guestsNumber: 12,
      startDate: new Date("2026-05-10T18:30:00Z"),
      endDate: new Date("2026-05-10T23:00:00Z"),
      cookId: cooks[7].id,
      clientId: clients[14].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
    },
  ];

  for (const reqData of requests) {
    const cook = cooks.find((c) => c.id === reqData.cookId);
    const client = clients.find((c) => c.id === reqData.clientId);
    const clientUserId = client.userId;
    const cookUserId = cook.userId;

    const conversationId = await getOrCreateConversation(
      clientUserId,
      cookUserId
    );

    const saved = await cookRequestRepo.save({
      ...reqData,
      conversationId,
    });

    await messageRepo.save(
      messageRepo.create({
        authorId: clientUserId,
        conversationId,
        message: `__COOK_REQUEST__${JSON.stringify({
          startDate: formatDateDDMMYYYY(saved.startDate),
          guestsNumber: saved.guestsNumber,
          mealType: saved.mealType,
          message: saved.message || "",
          cookRequestId: saved.id,
        })}`,
      })
    );
  }
  console.log(
    `${requests.length} demandes de cook créées avec conversations et messages`
  );

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
