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
const DEMO_PASSWORD = "demo1234";

const COOKS_DATA = [
  {
    firstName: "Pierre",
    lastName: "Martin",
    email: "pierre.martin@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 45,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "52384710900041",
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "78234501200082",
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "31928456700013",
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "66172839400057",
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
    validationStatus: CookValidationStatus.VALIDATED,
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "49038271500029",
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "83920165400074",
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "27463801900048",
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "61583920700061",
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "94712038300036",
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
    validationStatus: CookValidationStatus.VALIDATED,
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "38201947600019",
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "72094831500053",
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "55318264900087",
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
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "13579024600163",
    description:
      "Chef créatif formé dans les grandes maisons alsaciennes, je propose une cuisine contemporaine alliant tradition et innovation. Menus personnalisés.",
  },
  // ─── Compte dédié aux tests e2e (sendMessage) ───
  {
    firstName: "Test",
    lastName: "Cook",
    email: "test.msg.cook@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 40,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "11122233300044",
    description: "Compte dédié aux tests e2e."},
  {
    firstName: "Sophie",
    lastName: "Blanc",
    email: "sophie.blanc@cookus.app",
    speciality: "indian_cooking",
    hourlyRate: 44,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "21349876500028",
    description:
      "Après 3 ans passés à Mumbai et Chennai, je maîtrise les épices indiennes comme personne. Tandooris, biryanis et currys parfumés pour des soirées exotiques.",
  },
  {
    firstName: "Hugo",
    lastName: "Morvan",
    email: "hugo.morvan@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 50,
    city: "Bordeaux",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "67832104900051",
    description:
      "Passionné de cuisine du Sud-Ouest, je travaille avec les producteurs locaux de la région. Canard, foie gras et vins de Bordeaux sont mes alliés.",
  },
  {
    firstName: "Lucie",
    lastName: "Perrin",
    email: "lucie.perrin@cookus.app",
    speciality: "vegetarian_cooking",
    hourlyRate: 38,
    city: "Montpellier",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "54219038700042",
    description:
      "Chef végétarienne certifiée, je crée des menus colorés et savoureux sans viande ni poisson. Cuisine crudivore, fermentée et végane sur demande.",
  },
  {
    firstName: "Alexis",
    lastName: "Faure",
    email: "alexis.faure@cookus.app",
    speciality: "asian_cooking",
    hourlyRate: 46,
    city: "Lyon",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "38920147600073",
    description:
      "Amoureux des cuisines coréenne et japonaise, je propose bibimbap, bulgogi et ramen maison. Produits importés directement d'Asie pour une authenticité maximale.",
  },
  {
    firstName: "Mélanie",
    lastName: "Caron",
    email: "melanie.caron@cookus.app",
    speciality: "pastry_cooking",
    hourlyRate: 57,
    city: "Nantes",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "72018394500064",
    description:
      "Pâtissière MOF (Meilleure Ouvrière de France) en chocolaterie, je sublime vos événements avec des créations en chocolat et entremets sur mesure.",
  },
  {
    firstName: "David",
    lastName: "Nguyen",
    email: "david.nguyen@cookus.app",
    speciality: "asian_cooking",
    hourlyRate: 42,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "89301274600037",
    description:
      "Franco-vietnamien, je perpétue les recettes familiales : phở, bún bò huế et bánh mì. Une cuisine fraîche, légère et pleine de parfums du Vietnam.",
  },
  {
    firstName: "Cécile",
    lastName: "Hubert",
    email: "cecile.hubert@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 53,
    city: "Lille",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "43892016500089",
    description:
      "Spécialiste de la cuisine nordiste, je propose carbonade flamande, potjevleesch et gaufres de Liège. Le terroir ch'ti revisité avec modernité.",
  },
  {
    firstName: "Julien",
    lastName: "Dupuis",
    email: "julien.dupuis@cookus.app",
    speciality: "italian_cooking",
    hourlyRate: 47,
    city: "Marseille",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "16274039800015",
    description:
      "Demi-finaliste Top Chef 2022, je propose une cuisine italienne créative loin des clichés. Pasta fraîche, ossobuco revisité et desserts siciliens inédits.",
  },
  {
    firstName: "Nathalie",
    lastName: "Vidal",
    email: "nathalie.vidal@cookus.app",
    speciality: "mexican_cooking",
    hourlyRate: 40,
    city: "Toulouse",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "57193048200026",
    description:
      "Mexicaine d'adoption, je prépare pozole, mole negro et tamales comme une grand-mère de Oaxaca. Piments, maïs et citron vert au cœur de chaque plat.",
  },
  {
    firstName: "Sébastien",
    lastName: "Lemaire",
    email: "sebastien.lemaire@cookus.app",
    speciality: "autre",
    hourlyRate: 75,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "30481957200058",
    description:
      "Spécialiste de la cuisine fusion franco-asiatique, j'ai officié dans des restaurants 2 étoiles à Paris et Hong Kong. Accords audacieux et présentation artistique.",
  },
  {
    firstName: "Laure",
    lastName: "Benoit",
    email: "laure.benoit@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 49,
    city: "Strasbourg",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "91837264500031",
    description:
      "Alsacienne de cœur, je cuisine la choucroute, le baeckeoffe et la flammekueche comme ma grand-mère. Un héritage culinaire transmis avec amour.",
  },
  {
    firstName: "Karim",
    lastName: "Meziani",
    email: "karim.meziani@cookus.app",
    speciality: "autre",
    hourlyRate: 43,
    city: "Lyon",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "62748013900047",
    description:
      "Passionné de cuisine méditerranéenne et du Maghreb, je propose couscous, tajines et mezze. Des recettes familiales transmises de génération en génération.",
  },
  {
    firstName: "Virginie",
    lastName: "Roussel",
    email: "virginie.roussel@cookus.app",
    speciality: "pastry_cooking",
    hourlyRate: 60,
    city: "Bordeaux",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "47219380600062",
    description:
      "Ancienne cheffe pâtissière du Grand Hôtel de Bordeaux, je crée des desserts gastronomiques pour vos dîners. Wedding cakes et pièces sculptées sur commande.",
  },
  {
    firstName: "Thibault",
    lastName: "Gros",
    email: "thibault.gros@cookus.app",
    speciality: "japanese_cooking",
    hourlyRate: 65,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "28394710500083",
    description:
      "Itamae certifié après 4 ans à Tokyo, je prépare des omakase sushi de haute qualité. Poissons travaillés à la minute, riz vinaigrés à la tradition japonaise.",
  },
  {
    firstName: "Aurélie",
    lastName: "Collet",
    email: "aurelie.collet@cookus.app",
    speciality: "vegetarian_cooking",
    hourlyRate: 41,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "63901847200019",
    description:
      "Ancienne diététicienne reconvertie en cheffe végé, je concocte des menus sains et gourmands. Spécialiste des superaliments, farines alternatives et substituts créatifs.",
  },
  {
    firstName: "Benoît",
    lastName: "Pichon",
    email: "benoit.pichon@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 55,
    city: "Rennes",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "14829036700074",
    description:
      "Breton passionné, je cuisine les crustacés, fruits de mer et galettes au sarrasin avec des produits de la criée de Quimper. La Bretagne dans votre assiette.",
  },
  {
    firstName: "Yasmine",
    lastName: "Touati",
    email: "yasmine.touati@cookus.app",
    speciality: "indian_cooking",
    hourlyRate: 46,
    city: "Nice",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "50738294100038",
    description:
      "Cheffe franco-tunisienne formée à Delhi, je mêle les épices du Maghreb et de l'Inde. Mes currys et biryanis d'inspiration fusion ravissent les papilles les plus exigeantes.",
  },
  {
    firstName: "Grégoire",
    lastName: "Masson",
    email: "gregoire.masson@cookus.app",
    speciality: "autre",
    hourlyRate: 85,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "76019283400055",
    description:
      "Chef consultant ex-Robuchon, je propose des menus de chef à domicile à partir de 6 convives. Technique classique, produits d'exception, service discret et professionnel.",
  },
  {
    firstName: "Marion",
    lastName: "Fleury",
    email: "marion.fleury@cookus.app",
    speciality: "italian_cooking",
    hourlyRate: 51,
    city: "Aix-en-Provence",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "31847590200066",
    description:
      "Revenue de Florence après un stage chez Cibrèo, je prépare une cuisine toscane authentique. Ribollita, bistecca fiorentina et panna cotta selon les saisons.",
  },
  {
    firstName: "Christophe",
    lastName: "Aubert",
    email: "christophe.aubert@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 48,
    city: "Montpellier",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "82946031500021",
    description:
      "Chef du terroir languedocien, je travaille avec les vignerons et producteurs locaux. Tielle sétoise, bourride et fromages de brebis sublimés par nos vins du Languedoc.",
  },
  {
    firstName: "Elodie",
    lastName: "Marchal",
    email: "elodie.marchal@cookus.app",
    speciality: "asian_cooking",
    hourlyRate: 39,
    city: "Lille",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "49038176200093",
    description:
      "Passionnée de street food asiatique, je reproduis les saveurs des marchés de Bangkok et Taipei. Som tam, laksa et char siu bao faits maison avec authenticité.",
  },
  {
    firstName: "Florian",
    lastName: "Tessier",
    email: "florian.tessier@cookus.app",
    speciality: "autre",
    hourlyRate: 54,
    city: "Nantes",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "65103928400044",
    description:
      "Spécialiste des cuisines du monde, j'ai travaillé sur des yachts privés en Méditerranée. Menus thématiques : soirée grecque, espagnole, libanaise ou marocaine.",
  },
  {
    firstName: "Sandrine",
    lastName: "Breton",
    email: "sandrine.breton@cookus.app",
    speciality: "pastry_cooking",
    hourlyRate: 59,
    city: "Lyon",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "27490163800056",
    description:
      "Pâtissière lyonnaise formée chez Bernachon, je travaille exclusivement le chocolat grand cru. Ganaches, mousses et pralinés d'une finesse inégalée pour vos occasions.",
  },
  {
    firstName: "Patrick",
    lastName: "Jourdain",
    email: "patrick.jourdain@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 45,
    city: "Toulouse",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "93712048600012",
    description:
      "Gascon de souche, je cuisine le cassoulet, le confit de canard et le magret comme un art de vivre. Produits du Gers, recettes ancestrales, convivialité garantie.",
  },
  {
    firstName: "Aline",
    lastName: "Renaud",
    email: "aline.renaud@cookus.app",
    speciality: "vegetarian_cooking",
    hourlyRate: 37,
    city: "Bordeaux",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "58302941700069",
    description:
      "Militante du bien-manger, je propose une cuisine végétale locale et de saison. Zéro déchet, circuits courts et saveurs intenses pour prendre soin de vous et la planète.",
  },
  {
    firstName: "Rémi",
    lastName: "Guilbert",
    email: "remi.guilbert@cookus.app",
    speciality: "japanese_cooking",
    hourlyRate: 72,
    city: "Bordeaux",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "40281937600035",
    description:
      "Amoureux du Japon depuis l'enfance, je réalise des kaiseki selon les saisons. Chaque plat est un équilibre entre goût, couleur et texture, inspiré de la philosophie zen.",
  },
  {
    firstName: "Paulette",
    lastName: "Savary",
    email: "paulette.savary@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 35,
    city: "Clermont-Ferrand",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "71493028500077",
    description:
      "Cuisinière du Massif Central, je propose potée auvergnate, truffade et pounti. Des recettes robustes et chaleureuses transmises par ma grand-mère, à partager en famille.",
  },
  {
    firstName: "Baptiste",
    lastName: "Coste",
    email: "baptiste.coste@cookus.app",
    speciality: "italian_cooking",
    hourlyRate: 44,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "36720419800048",
    description:
      "Passé par plusieurs trattorias romaines, je maîtrise les sauces mères italiennes sur le bout des doigts. Carbonara à l'œuf frais, cacio e pepe et supplì di riso.",
  },
  {
    firstName: "Delphine",
    lastName: "Guérin",
    email: "delphine.guerin@cookus.app",
    speciality: "indian_cooking",
    hourlyRate: 48,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "84031976200023",
    description:
      "Formatrice en cuisine indienne pour l'école Ritz Escoffier, je propose des cours et prestations à domicile. Du masala chai aux biryani, l'Inde dans votre cuisine.",
  },
  {
    firstName: "Mathieu",
    lastName: "Picard",
    email: "mathieu.picard@cookus.app",
    speciality: "autre",
    hourlyRate: 62,
    city: "Rennes",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "59214830700081",
    description:
      "Chef aventurier et globe-trotter, je propose des dîners immersifs : un pays, une musique, une cuisine. Pérou, Éthiopie, Géorgie... dépaysement total garanti.",
  },
  {
    firstName: "Hélène",
    lastName: "Carrier",
    email: "helene.carrier@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 56,
    city: "Nice",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "20948371600054",
    description:
      "Sommelière et cheffe, je compose des menus avec accords mets et vins. Chaque plat est pensé pour mettre en valeur un vin d'exception de ma cave personnelle.",
  },
  {
    firstName: "Franck",
    lastName: "Delmas",
    email: "franck.delmas@cookus.app",
    speciality: "asian_cooking",
    hourlyRate: 43,
    city: "Marseille",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "73819204500016",
    description:
      "Spécialiste de la cuisine sino-cantonaise après 2 ans à Guangzhou, je reproduis les dim sum, canard laqué et riz sauté wok comme dans les grandes brasseries de Canton.",
  },
  {
    firstName: "Céline",
    lastName: "Ferrand",
    email: "celine.ferrand@cookus.app",
    speciality: "pastry_cooking",
    hourlyRate: 63,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "61037492800087",
    description:
      "Cheffe pâtissière et blogueuse culinaire avec 200k abonnés, je crée des pâtisseries aussi belles que bonnes. Entremets, layer cakes et viennoiseries beurre pur.",
  },
  {
    firstName: "Olivier",
    lastName: "Charpentier",
    email: "olivier.charpentier@cookus.app",
    speciality: "french_cooking",
    hourlyRate: 66,
    city: "Lyon",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "48291063700032",
    description:
      "Ancien chef de partie chez Paul Bocuse, je perpétue la grande tradition lyonnaise. Quenelles, volaille de Bresse et tarte praline pour honorer la capitale de la gastronomie.",
  },
  {
    firstName: "Julien",
    lastName: "Lacroix",
    email: "julien.lacroix@cookus.app",
    speciality: "autre",
    hourlyRate: 47,
    city: "Paris",
    validationStatus: CookValidationStatus.VALIDATED,
    siret: "19283746500092",
    description:
      "Chef polyvalent avec 15 ans d'expérience en restauration collective et événementielle. Je m'adapte à tous les goûts et toutes les occasions.",
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
  // ─── Comptes dédiés aux tests e2e ───────────────
  {
    firstName: "Test",
    lastName: "MsgClient",
    email: "test.msg.client@cookus.app",
  },
  {
    firstName: "Test",
    lastName: "PropClient",
    email: "test.prop.client@cookus.app",
  },
  {
    firstName: "Test",
    lastName: "ReviewClient",
    email: "test.review.client@cookus.app",
  },
  {
    firstName: "Test",
    lastName: "AddrClient",
    email: "test.addr.client@cookus.app",
  },
  {
    firstName: "Test",
    lastName: "ProfileClient",
    email: "test.profile.client@cookus.app",
  },
  {
    firstName: "Test",
    lastName: "CliAddrClient",
    email: "test.cliaddr.client@cookus.app",
  },
];

async function seed() {
  await dataSource.initialize();
  console.log("Connecté à la base de données");

  await dataSource.query(
    "TRUNCATE TABLE review, conversation, cook_request, cook_image, client, cook, users RESTART IDENTITY CASCADE"
  );
  console.log("Tables vidées");

  const userRepo = dataSource.getRepository(User);
  const cookRepo = dataSource.getRepository(Cook);
  const cookImageRepo = dataSource.getRepository(CookImage);
  const clientRepo = dataSource.getRepository(Client);
  const cookRequestRepo = dataSource.getRepository(CookRequestEntity);
  const reviewRepo = dataSource.getRepository(Review);
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
      validationStatus: data.validationStatus ?? CookValidationStatus.PENDING,
      description: data.description,
      userId: user.id,
    });
    cooks.push(cook);
  }
  console.log(`${cooks.length} cooks créés`);

  // --- Demo cook: Sophie Lambert (index 15) ---
  const demoHashedCookPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const demoSophieUser = await userRepo.save({
    firstName: "Sophie",
    lastName: "Lambert",
    email: "sophie.lambert@demo.cookus.app",
    role: UserRole.COOK,
    password: demoHashedCookPassword,
    thumbnail:
      "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200",
  });
  const demoSophieCook = await cookRepo.save({
    firstName: "Sophie",
    lastName: "Lambert",
    speciality: "french_cooking",
    siret: "89234701500012",
    hourlyRate: 58,
    city: "Paris",
    isActive: true,
    validationStatus: CookValidationStatus.VALIDATED,
    description:
      "Passée par les cuisines du Bristol et de Taillevent, je propose une cuisine française gastronomique à domicile. Produits de saison, vins sélectionnés, service raffiné.",
    photoUrl:
      "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=200",
    userId: demoSophieUser.id,
  });
  cooks.push(demoSophieCook); // index 15

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
    // Sophie Blanc — indian_cooking
    {
      cookIndex: 15,
      description: "Biryani de poulet aux épices",
      imgUrl:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
    },
    {
      cookIndex: 15,
      description: "Naan au beurre et à l'ail",
      imgUrl:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600",
    },
    {
      cookIndex: 15,
      description: "Thali végétarien aux multiples chutneys",
      imgUrl:
        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600",
    },
    // Hugo Morvan — french_cooking (Sud-Ouest)
    {
      cookIndex: 16,
      description: "Confit de canard aux pommes sarladaises",
      imgUrl:
        "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=600",
    },
    {
      cookIndex: 16,
      description: "Soupe à l'oignon gratinée",
      imgUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600",
    },
    {
      cookIndex: 16,
      description: "Entrecôte bordelaise sauce à l'échalote",
      imgUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
    },
    // Lucie Perrin — vegetarian_cooking
    {
      cookIndex: 17,
      description: "Buddha bowl coloré et nourrissant",
      imgUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
    },
    {
      cookIndex: 17,
      description: "Tarte aux légumes de saison",
      imgUrl:
        "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600",
    },
    {
      cookIndex: 17,
      description: "Risotto crémeux aux champignons des bois",
      imgUrl:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600",
    },
    // Alexis Faure — asian_cooking (coréen/japonais)
    {
      cookIndex: 18,
      description: "Bibimbap traditionnel aux légumes",
      imgUrl:
        "https://images.unsplash.com/photo-1617196034096-e8c58b2dc7e6?w=600",
    },
    {
      cookIndex: 18,
      description: "Bulgogi de bœuf mariné au sésame",
      imgUrl:
        "https://images.unsplash.com/photo-1583032015879-e4022bd87cc7?w=600",
    },
    {
      cookIndex: 18,
      description: "Kimchi maison fermenté",
      imgUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600",
    },
    // Mélanie Caron — pastry_cooking (chocolat)
    {
      cookIndex: 19,
      description: "Entremets chocolat praliné noisette",
      imgUrl:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
    },
    {
      cookIndex: 19,
      description: "Croissants pur beurre feuilletés",
      imgUrl:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600",
    },
    {
      cookIndex: 19,
      description: "Gâteau d'anniversaire au chocolat",
      imgUrl:
        "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600",
    },
    // David Nguyen — asian_cooking (vietnamien)
    {
      cookIndex: 20,
      description: "Phở bò traditionnel de Hanoï",
      imgUrl:
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600",
    },
    {
      cookIndex: 20,
      description: "Bánh mì crevettes grillées",
      imgUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600",
    },
    {
      cookIndex: 20,
      description: "Bún bò huế épicé aux herbes fraîches",
      imgUrl:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
    },
    // Cécile Hubert — french_cooking (nordiste)
    {
      cookIndex: 21,
      description: "Carbonade flamande aux bières du Nord",
      imgUrl:
        "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600",
    },
    {
      cookIndex: 21,
      description: "Welsh rarebit et frites maison",
      imgUrl: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600",
    },
    // Julien Dupuis — italian_cooking (créatif)
    {
      cookIndex: 22,
      description: "Pasta fraîche au homard et bisque",
      imgUrl:
        "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600",
    },
    {
      cookIndex: 22,
      description: "Pizza napolitaine aux tomates San Marzano",
      imgUrl:
        "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600",
    },
    {
      cookIndex: 22,
      description: "Ossobuco alla milanese avec gremolata",
      imgUrl:
        "https://images.unsplash.com/photo-1598866594230-a7c00e8d8152?w=600",
    },
    // Nathalie Vidal — mexican_cooking
    {
      cookIndex: 23,
      description: "Mole negro de Oaxaca au chocolat",
      imgUrl:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600",
    },
    {
      cookIndex: 23,
      description: "Pozole rojo aux hominy et épices",
      imgUrl:
        "https://images.unsplash.com/photo-1570461226513-e08b58a52a21?w=600",
    },
    {
      cookIndex: 23,
      description: "Tamales de maïs à la vapeur",
      imgUrl:
        "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=600",
    },
    // Sébastien Lemaire — autre (fusion franco-asiatique)
    {
      cookIndex: 24,
      description: "Saint-Jacques laquées au miso",
      imgUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    },
    {
      cookIndex: 24,
      description: "Canard confit au jus de yuzu",
      imgUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    },
    // Laure Benoit — french_cooking (alsacienne)
    {
      cookIndex: 25,
      description: "Choucroute garnie aux saucisses d'Alsace",
      imgUrl:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600",
    },
    {
      cookIndex: 25,
      description: "Flammekueche crème fraîche et lardons",
      imgUrl:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600",
    },
    {
      cookIndex: 25,
      description: "Baeckeoffe de veau au riesling",
      imgUrl:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
    },
    // Karim Meziani — autre (maghrébin/méditerranéen)
    {
      cookIndex: 26,
      description: "Tajine d'agneau aux pruneaux et amandes",
      imgUrl:
        "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600",
    },
    {
      cookIndex: 26,
      description: "Couscous royal à la merguez",
      imgUrl:
        "https://images.unsplash.com/photo-1585325701956-60dd9c8399b6?w=600",
    },
    {
      cookIndex: 26,
      description: "Mezze libanais assortis",
      imgUrl:
        "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=600",
    },
    // Virginie Roussel — pastry_cooking
    {
      cookIndex: 27,
      description: "Opéra au café et chocolat noir",
      imgUrl:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
    },
    {
      cookIndex: 27,
      description: "Wedding cake floral en fondant",
      imgUrl:
        "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600",
    },
    {
      cookIndex: 27,
      description: "Mille-feuille crème vanille bourbon",
      imgUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600",
    },
    // Thibault Gros — japanese_cooking (omakase)
    {
      cookIndex: 28,
      description: "Omakase sushi plateau 12 pièces",
      imgUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600",
    },
    {
      cookIndex: 28,
      description: "Sashimi de thon rouge et daurade",
      imgUrl:
        "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600",
    },
    {
      cookIndex: 28,
      description: "Chirashi bowl au riz vinaigré",
      imgUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600",
    },
    // Aurélie Collet — vegetarian_cooking (superaliments)
    {
      cookIndex: 29,
      description: "Açaï bowl aux fruits tropicaux",
      imgUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    },
    {
      cookIndex: 29,
      description: "Tartines avocat et graines germées",
      imgUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
    },
    // Benoît Pichon — french_cooking (breton)
    {
      cookIndex: 30,
      description: "Plateau de fruits de mer breton",
      imgUrl:
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600",
    },
    {
      cookIndex: 30,
      description: "Galette sarrasin jambon-fromage",
      imgUrl:
        "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=600",
    },
    {
      cookIndex: 30,
      description: "Bisque de homard à la crème",
      imgUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600",
    },
    // Yasmine Touati — indian_cooking (fusion maghreb-inde)
    {
      cookIndex: 31,
      description: "Curry de crevettes coco et citronnelle",
      imgUrl:
        "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600",
    },
    {
      cookIndex: 31,
      description: "Samosas frits aux légumes épicés",
      imgUrl:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600",
    },
    // Grégoire Masson — autre (gastronomique)
    {
      cookIndex: 32,
      description: "Homard bleu rôti au beurre clarifié",
      imgUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    },
    {
      cookIndex: 32,
      description: "Foie gras poêlé aux figues de Solliès",
      imgUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    },
    {
      cookIndex: 32,
      description: "Soufflé chaud au Grand Marnier",
      imgUrl:
        "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600",
    },
    // Marion Fleury — italian_cooking (toscane)
    {
      cookIndex: 33,
      description: "Ribollita toscane aux légumes d'hiver",
      imgUrl:
        "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600",
    },
    {
      cookIndex: 33,
      description: "Bistecca alla fiorentina saignante",
      imgUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=600",
    },
    {
      cookIndex: 33,
      description: "Panna cotta aux fruits rouges",
      imgUrl:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600",
    },
    // Christophe Aubert — french_cooking (languedocien)
    {
      cookIndex: 34,
      description: "Tielle sétoise aux poulpes",
      imgUrl:
        "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=600",
    },
    {
      cookIndex: 34,
      description: "Bourride de lotte à l'aïoli",
      imgUrl:
        "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600",
    },
    // Elodie Marchal — asian_cooking (street food)
    {
      cookIndex: 35,
      description: "Som tam thaï papaye verte et crevettes",
      imgUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600",
    },
    {
      cookIndex: 35,
      description: "Char siu bao vapeur au porc",
      imgUrl:
        "https://images.unsplash.com/photo-1583032015879-e4022bd87cc7?w=600",
    },
    {
      cookIndex: 35,
      description: "Laksa malaisien aux nouilles de riz",
      imgUrl: "https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=600",
    },
    // Florian Tessier — autre (world food)
    {
      cookIndex: 36,
      description: "Soirée grecque : mezze et moussaka",
      imgUrl:
        "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=600",
    },
    {
      cookIndex: 36,
      description: "Paella valenciana aux fruits de mer",
      imgUrl:
        "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=600",
    },
    // Sandrine Breton — pastry_cooking (chocolat)
    {
      cookIndex: 37,
      description: "Tablette de chocolat noir grand cru",
      imgUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600",
    },
    {
      cookIndex: 37,
      description: "Fondant coulant chocolat Valrhona",
      imgUrl:
        "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600",
    },
    {
      cookIndex: 37,
      description: "Truffes chocolat noir et fleur de sel",
      imgUrl:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
    },
    // Patrick Jourdain — french_cooking (gascon)
    {
      cookIndex: 38,
      description: "Cassoulet au canard confit de Castelnaudary",
      imgUrl:
        "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600",
    },
    {
      cookIndex: 38,
      description: "Magret de canard aux cerises",
      imgUrl:
        "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=600",
    },
    {
      cookIndex: 38,
      description: "Armagnac et pastis gascon en dessert",
      imgUrl:
        "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600",
    },
    // Aline Renaud — vegetarian_cooking (zéro déchet)
    {
      cookIndex: 39,
      description: "Curry de légumes racines et lentilles",
      imgUrl:
        "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600",
    },
    {
      cookIndex: 39,
      description: "Soupe de saison au pain grillé maison",
      imgUrl:
        "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600",
    },
    // Rémi Guilbert — japanese_cooking (kaiseki)
    {
      cookIndex: 40,
      description: "Kaiseki printanier en 8 services",
      imgUrl:
        "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600",
    },
    {
      cookIndex: 40,
      description: "Wagyu japonais A5 grillé au charbon",
      imgUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600",
    },
    {
      cookIndex: 40,
      description: "Mochi glacés aux parfums du Japon",
      imgUrl:
        "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600",
    },
    // Paulette Savary — french_cooking (auvergnate)
    {
      cookIndex: 41,
      description: "Truffade auvergnate au lard et tomme",
      imgUrl:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600",
    },
    {
      cookIndex: 41,
      description: "Potée auvergnate aux choux d'hiver",
      imgUrl:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600",
    },
    // Baptiste Coste — italian_cooking (romain)
    {
      cookIndex: 42,
      description: "Cacio e pepe à la romaine",
      imgUrl: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=600",
    },
    {
      cookIndex: 42,
      description: "Carbonara traditionnelle sans crème",
      imgUrl:
        "https://images.unsplash.com/photo-1598866594230-a7c00e8d8152?w=600",
    },
    {
      cookIndex: 42,
      description: "Supplì di riso au jus de viande",
      imgUrl:
        "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600",
    },
    // Delphine Guérin — indian_cooking
    {
      cookIndex: 43,
      description: "Dhal makhani aux lentilles noires",
      imgUrl:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600",
    },
    {
      cookIndex: 43,
      description: "Palak paneer aux épinards et fromage frais",
      imgUrl:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
    },
    {
      cookIndex: 43,
      description: "Lassi mangue et cardamome",
      imgUrl:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600",
    },
    // Mathieu Picard — autre (world food immersif)
    {
      cookIndex: 44,
      description: "Ceviche péruvien tigre de lait",
      imgUrl:
        "https://images.unsplash.com/photo-1604467707321-70d009801bf4?w=600",
    },
    {
      cookIndex: 44,
      description: "Injera éthiopien aux wots colorés",
      imgUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
    },
    // Hélène Carrier — french_cooking (accord mets et vins)
    {
      cookIndex: 45,
      description: "Turbot rôti aux légumes primeurs",
      imgUrl:
        "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600",
    },
    {
      cookIndex: 45,
      description: "Plateau de fromages affinés sélectionnés",
      imgUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600",
    },
    {
      cookIndex: 45,
      description: "Ris de veau aux morilles et vin jaune",
      imgUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    },
    // Franck Delmas — asian_cooking (cantonais)
    {
      cookIndex: 46,
      description: "Canard laqué pékinois aux crêpes",
      imgUrl:
        "https://images.unsplash.com/photo-1617196034096-e8c58b2dc7e6?w=600",
    },
    {
      cookIndex: 46,
      description: "Dim sum vapeur assortis",
      imgUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600",
    },
    {
      cookIndex: 46,
      description: "Riz cantonais au wok, crevettes et œufs",
      imgUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600",
    },
    // Céline Ferrand — pastry_cooking (blogueuse)
    {
      cookIndex: 47,
      description: "Layer cake vanille fraise en hauteur",
      imgUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600",
    },
    {
      cookIndex: 47,
      description: "Kouign-amann breton au beurre salé",
      imgUrl:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600",
    },
    {
      cookIndex: 47,
      description: "Tarte au citron meringuée italienne",
      imgUrl:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600",
    },
    // Olivier Charpentier — french_cooking (lyonnais)
    {
      cookIndex: 48,
      description: "Quenelles de brochet sauce Nantua",
      imgUrl:
        "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=600",
    },
    {
      cookIndex: 48,
      description: "Volaille de Bresse à la crème et morilles",
      imgUrl:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600",
    },
    {
      cookIndex: 48,
      description: "Tarte praline rose lyonnaise",
      imgUrl:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
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

  // --- Photos de plats Sophie Lambert (démo) ---
  for (const [description, imgUrl] of [
    [
      "Sole meunière au beurre clarifié",
      "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=600",
    ],
    [
      "Filet de bœuf Wellington",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
    ],
    [
      "Soufflé au fromage de Comté",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
    ],
    [
      "Mille-feuille à la vanille Bourbon",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
    ],
  ]) {
    await cookImageRepo.save({
      cookId: demoSophieCook.id,
      imgUrl,
      description,
    });
  }

  // --- Clients ---
  const hashedClientPassword = await bcrypt.hash(CLIENT_PASSWORD, 10);
  const clients: Client[] = [];

  // Adresses de profil pour certains clients (pré-remplissage du formulaire de demande)
  const CLIENT_PROFILE_ADDRESSES: Record<
    string,
    { street: string; postalCode: string; city: string }
  > = {
    "lucas.bernard@cookus.app": {
      street: "15 rue de Rivoli",
      postalCode: "75001",
      city: "Paris",
    },
    "emma.petit@cookus.app": {
      street: "8 avenue Jean Jaurès",
      postalCode: "69007",
      city: "Lyon",
    },
    "hugo.simon@cookus.app": {
      street: "22 boulevard de la Canebière",
      postalCode: "13001",
      city: "Marseille",
    },
    "raphael.marchand@cookus.app": {
      street: "25 avenue de la Liberté",
      postalCode: "06000",
      city: "Nice",
    },
    // Comptes dédiés aux tests e2e
    "test.msg.client@cookus.app": {
      street: "15 rue de Rivoli",
      postalCode: "75001",
      city: "Paris",
    },
    "test.prop.client@cookus.app": {
      street: "15 rue de Rivoli",
      postalCode: "75001",
      city: "Paris",
    },
    "test.review.client@cookus.app": {
      street: "15 rue de Rivoli",
      postalCode: "75001",
      city: "Paris",
    },
    "test.addr.client@cookus.app": {
      street: "15 rue de Rivoli",
      postalCode: "75001",
      city: "Paris",
    },
    "test.profile.client@cookus.app": {
      street: "15 rue de Rivoli",
      postalCode: "75001",
      city: "Paris",
    },
    "test.cliaddr.client@cookus.app": {
      street: "15 rue de Rivoli",
      postalCode: "75001",
      city: "Paris",
    },
  };

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
    const profileAddress = CLIENT_PROFILE_ADDRESSES[data.email] ?? {};
    const client = await clientRepo.save({
      userId: user.id,
      ...profileAddress,
    });
    clients.push(client);
  }
  console.log(`${clients.length} clients créés`);

  // --- Demo client: Alexis Martin (index 15) ---
  const demoHashedClientPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const demoAlexisUser = await userRepo.save({
    firstName: "Alexis",
    lastName: "Martin",
    email: "alexis.martin@demo.cookus.app",
    role: UserRole.CLIENT,
    password: demoHashedClientPassword,
    thumbnail:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  });
  const demoAlexisClient = await clientRepo.save({
    userId: demoAlexisUser.id,
    street: "25 rue du Faubourg Saint-Antoine",
    postalCode: "75011",
    city: "Paris",
  });
  clients.push(demoAlexisClient); // index 15

  // --- Cook requests avec conversations ---
  // Reproduit le comportement du backend : chaque cook request a une conversation.
  // Si un même couple client/cook a plusieurs demandes, elles partagent la même conversation.

  // Adresses des clients (indexées comme clients[]) — utilisées sur les cook requests
  const CLIENT_ADDRESSES = [
    { street: "15 rue de Rivoli", postalCode: "75001", city: "Paris" },
    { street: "8 avenue Jean Jaurès", postalCode: "69007", city: "Lyon" },
    {
      street: "22 boulevard de la Canebière",
      postalCode: "13001",
      city: "Marseille",
    },
    { street: "5 place Bellecour", postalCode: "69002", city: "Lyon" },
    {
      street: "12 rue du Faubourg Saint-Honoré",
      postalCode: "75008",
      city: "Paris",
    },
    { street: "3 rue de la République", postalCode: "33000", city: "Bordeaux" },
    { street: "18 rue Alsace-Lorraine", postalCode: "31000", city: "Toulouse" },
    { street: "7 rue de Siam", postalCode: "29200", city: "Brest" },
    { street: "25 avenue de la Liberté", postalCode: "06000", city: "Nice" },
    { street: "10 rue Nationale", postalCode: "59000", city: "Lille" },
    { street: "14 quai des Chartrons", postalCode: "33000", city: "Bordeaux" },
    { street: "6 rue Kléber", postalCode: "67000", city: "Strasbourg" },
    { street: "20 rue Crébillon", postalCode: "44000", city: "Nantes" },
    { street: "9 place du Capitole", postalCode: "31000", city: "Toulouse" },
    {
      street: "11 cours Mirabeau",
      postalCode: "13100",
      city: "Aix-en-Provence",
    },
    // Adresses pour comptes e2e dédiés (indices 15-20)
    { street: "15 rue de Rivoli", postalCode: "75001", city: "Paris" }, // 15 test.msg.client
    { street: "15 rue de Rivoli", postalCode: "75001", city: "Paris" }, // 16 test.prop.client
    { street: "15 rue de Rivoli", postalCode: "75001", city: "Paris" }, // 17 test.review.client
    { street: "15 rue de Rivoli", postalCode: "75001", city: "Paris" }, // 18 test.addr.client
    { street: "15 rue de Rivoli", postalCode: "75001", city: "Paris" }, // 19 test.profile.client
    { street: "15 rue de Rivoli", postalCode: "75001", city: "Paris" }, // 20 test.cliaddr.client
    // Alexis Martin — démo (index 15)
    {
      street: "25 rue du Faubourg Saint-Antoine",
      postalCode: "75011",
      city: "Paris",
    },
  ];

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

  const addr = (i: number) => CLIENT_ADDRESSES[i];

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
      price: 270,
      ...addr(0),
    },
    {
      guestsNumber: 4,
      startDate: new Date("2025-11-22T12:00:00Z"),
      endDate: new Date("2025-11-22T15:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[1].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.LUNCH,
      price: 165,
      ...addr(1),
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
      price: 475,
      ...addr(2),
    },
    {
      guestsNumber: 8,
      startDate: new Date("2025-12-14T19:00:00Z"),
      endDate: new Date("2025-12-14T22:30:00Z"),
      cookId: cooks[5].id,
      clientId: clients[3].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      price: 217,
      ...addr(3),
    },
    {
      guestsNumber: 3,
      startDate: new Date("2025-12-20T20:00:00Z"),
      endDate: null,
      cookId: cooks[2].id,
      clientId: clients[4].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      price: 120,
      ...addr(4),
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
      price: 570,
      ...addr(5),
    },
    {
      guestsNumber: 5,
      startDate: new Date("2026-01-08T19:30:00Z"),
      endDate: new Date("2026-01-08T22:30:00Z"),
      cookId: cooks[6].id,
      clientId: clients[6].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      price: 240,
      ...addr(6),
    },
    {
      guestsNumber: 7,
      startDate: new Date("2026-01-18T12:00:00Z"),
      endDate: new Date("2026-01-18T15:00:00Z"),
      cookId: cooks[3].id,
      clientId: clients[7].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.LUNCH,
      price: 350,
      ...addr(7),
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
      price: 140,
      ...addr(8),
    },
    {
      guestsNumber: 20,
      startDate: new Date("2026-02-14T18:00:00Z"),
      endDate: new Date("2026-02-14T23:00:00Z"),
      cookId: cooks[4].id,
      clientId: clients[9].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      price: 380,
      ...addr(9),
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
      ...addr(2),
    },
    {
      guestsNumber: 4,
      startDate: new Date("2025-12-07T20:00:00Z"),
      endDate: new Date("2025-12-07T23:00:00Z"),
      cookId: cooks[9].id,
      clientId: clients[10].id,
      status: CookRequestStatus.REFUSED,
      mealType: MealType.DINNER,
      ...addr(10),
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-01-12T12:30:00Z"),
      endDate: new Date("2026-01-12T15:30:00Z"),
      cookId: cooks[11].id,
      clientId: clients[11].id,
      status: CookRequestStatus.REFUSED,
      mealType: MealType.LUNCH,
      ...addr(11),
    },
    // Passées - cancelled
    {
      guestsNumber: 8,
      startDate: new Date("2025-11-28T19:00:00Z"),
      endDate: new Date("2025-11-28T22:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[0].id,
      status: CookRequestStatus.CANCELLED,
      cancellationReason: "Changement de plans de dernière minute",
      mealType: MealType.DINNER,
      ...addr(0),
    },
    {
      guestsNumber: 5,
      startDate: new Date("2025-12-24T18:00:00Z"),
      endDate: new Date("2025-12-24T23:59:00Z"),
      cookId: cooks[5].id,
      clientId: clients[12].id,
      status: CookRequestStatus.CANCELLED,
      cancellationReason: "Problème personnel",
      mealType: MealType.DINNER,
      ...addr(12),
    },
    {
      guestsNumber: 3,
      startDate: new Date("2026-02-10T20:00:00Z"),
      endDate: null,
      cookId: cooks[7].id,
      clientId: clients[13].id,
      status: CookRequestStatus.CANCELLED,
      cancellationReason: "Modification du nombre d'invités",
      mealType: MealType.DINNER,
      ...addr(13),
    },
    {
      guestsNumber: 10,
      startDate: new Date("2026-01-15T19:00:00Z"),
      endDate: new Date("2026-01-15T22:00:00Z"),
      cookId: cooks[4].id,
      clientId: clients[8].id,
      status: CookRequestStatus.CANCELLED,
      mealType: MealType.DINNER,
      cancellationReason: "Changement de plans imprévu",
      ...addr(8),
    },
    // Terminées - completed (pour tester la notation)
    {
      guestsNumber: 4,
      startDate: new Date("2025-10-05T19:00:00Z"),
      endDate: new Date("2025-10-05T22:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[0].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      message: "Super soirée, cuisine française excellente.",
      price: 180,
      ...addr(0),
    },
    {
      guestsNumber: 6,
      startDate: new Date("2025-09-14T12:00:00Z"),
      endDate: new Date("2025-09-14T15:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[0].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.LUNCH,
      price: 165,
      ...addr(0),
    },
    {
      guestsNumber: 8,
      startDate: new Date("2025-08-20T19:00:00Z"),
      endDate: new Date("2025-08-20T23:00:00Z"),
      cookId: cooks[5].id,
      clientId: clients[1].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      price: 248,
      ...addr(1),
    },
    // --- Pierre Martin — données stats ---
    // Complétées sur 12 mois
    {
      guestsNumber: 6,
      startDate: new Date("2025-03-12T19:00:00Z"),
      endDate: new Date("2025-03-12T22:30:00Z"),
      cookId: cooks[0].id,
      clientId: clients[3].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      ...addr(3),
    },
    {
      guestsNumber: 4,
      startDate: new Date("2025-04-08T12:00:00Z"),
      endDate: new Date("2025-04-08T15:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[4].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.LUNCH,
      ...addr(4),
    },
    {
      guestsNumber: 8,
      startDate: new Date("2025-05-17T19:00:00Z"),
      endDate: new Date("2025-05-17T23:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[5].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      ...addr(5),
    },
    {
      guestsNumber: 2,
      startDate: new Date("2025-06-21T09:00:00Z"),
      endDate: new Date("2025-06-21T11:30:00Z"),
      cookId: cooks[0].id,
      clientId: clients[6].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.BREAKFAST,
      ...addr(6),
    },
    {
      guestsNumber: 10,
      startDate: new Date("2025-07-05T19:30:00Z"),
      endDate: new Date("2025-07-05T23:30:00Z"),
      cookId: cooks[0].id,
      clientId: clients[7].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      ...addr(7),
    },
    {
      guestsNumber: 6,
      startDate: new Date("2025-09-06T12:00:00Z"),
      endDate: new Date("2025-09-06T15:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[9].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.LUNCH,
      ...addr(9),
    },
    {
      guestsNumber: 8,
      startDate: new Date("2025-10-11T19:00:00Z"),
      endDate: new Date("2025-10-11T22:30:00Z"),
      cookId: cooks[0].id,
      clientId: clients[10].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      ...addr(10),
    },
    {
      guestsNumber: 5,
      startDate: new Date("2025-11-15T19:00:00Z"),
      endDate: new Date("2025-11-15T22:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[11].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      ...addr(11),
    },
    {
      guestsNumber: 6,
      startDate: new Date("2025-12-08T19:00:00Z"),
      endDate: new Date("2025-12-08T22:30:00Z"),
      cookId: cooks[0].id,
      clientId: clients[1].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      ...addr(1),
    },
    {
      guestsNumber: 4,
      startDate: new Date("2025-12-19T12:00:00Z"),
      endDate: new Date("2025-12-19T15:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[12].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.LUNCH,
      ...addr(12),
    },
    {
      guestsNumber: 8,
      startDate: new Date("2026-01-11T19:00:00Z"),
      endDate: new Date("2026-01-11T22:30:00Z"),
      cookId: cooks[0].id,
      clientId: clients[3].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      ...addr(3),
    },
    {
      guestsNumber: 2,
      startDate: new Date("2026-01-22T09:30:00Z"),
      endDate: new Date("2026-01-22T11:30:00Z"),
      cookId: cooks[0].id,
      clientId: clients[13].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.BREAKFAST,
      ...addr(13),
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-01-30T19:30:00Z"),
      endDate: new Date("2026-01-30T22:30:00Z"),
      cookId: cooks[0].id,
      clientId: clients[14].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      ...addr(14),
    },
    {
      guestsNumber: 10,
      startDate: new Date("2026-02-08T19:00:00Z"),
      endDate: new Date("2026-02-08T23:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[6].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      ...addr(6),
    },
    {
      guestsNumber: 5,
      startDate: new Date("2026-02-22T12:00:00Z"),
      endDate: new Date("2026-02-22T15:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[7].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.LUNCH,
      ...addr(7),
    },
    {
      guestsNumber: 4,
      startDate: new Date("2026-03-01T19:00:00Z"),
      endDate: new Date("2026-03-01T22:00:00Z"),
      cookId: cooks[0].id,
      clientId: clients[8].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      ...addr(8),
    },
    // Refusées / annulées Pierre Martin
    {
      guestsNumber: 12,
      startDate: new Date("2025-12-03T18:00:00Z"),
      endDate: null,
      cookId: cooks[0].id,
      clientId: clients[12].id,
      status: CookRequestStatus.REFUSED,
      mealType: MealType.DINNER,
      ...addr(12),
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-01-05T19:00:00Z"),
      endDate: null,
      cookId: cooks[0].id,
      clientId: clients[13].id,
      status: CookRequestStatus.REFUSED,
      mealType: MealType.DINNER,
      ...addr(13),
    },
    {
      guestsNumber: 4,
      startDate: new Date("2026-02-14T20:00:00Z"),
      endDate: null,
      cookId: cooks[0].id,
      clientId: clients[14].id,
      status: CookRequestStatus.CANCELLED,
      cancellationReason: "Annulation de l'événement",
      mealType: MealType.DINNER,
      ...addr(14),
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
      ...addr(0),
    },
    {
      guestsNumber: 8,
      startDate: new Date("2026-03-20T19:00:00Z"),
      endDate: null,
      cookId: cooks[2].id,
      clientId: clients[1].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
      ...addr(1),
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
      ...addr(2),
    },
    {
      guestsNumber: 14,
      startDate: new Date("2026-03-28T18:30:00Z"),
      endDate: new Date("2026-03-28T23:30:00Z"),
      cookId: cooks[8].id,
      clientId: clients[3].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
      ...addr(3),
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-04-05T19:00:00Z"),
      endDate: new Date("2026-04-05T22:00:00Z"),
      cookId: cooks[3].id,
      clientId: clients[4].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
      ...addr(4),
    },
    {
      guestsNumber: 10,
      startDate: new Date("2026-04-12T12:00:00Z"),
      endDate: null,
      cookId: cooks[10].id,
      clientId: clients[5].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.LUNCH,
      ...addr(5),
    },
    {
      guestsNumber: 5,
      startDate: new Date("2026-04-18T19:30:00Z"),
      endDate: new Date("2026-04-18T22:30:00Z"),
      cookId: cooks[13].id,
      clientId: clients[6].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
      ...addr(6),
    },
    {
      guestsNumber: 3,
      startDate: new Date("2026-04-25T20:00:00Z"),
      endDate: new Date("2026-04-25T23:00:00Z"),
      cookId: cooks[9].id,
      clientId: clients[7].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
      ...addr(7),
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
      price: 450,
      ...addr(8),
    },
    {
      guestsNumber: 7,
      startDate: new Date("2026-03-12T19:00:00Z"),
      endDate: new Date("2026-03-12T22:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[9].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      price: 385,
      ...addr(9),
    },
    {
      guestsNumber: 4,
      startDate: new Date("2026-03-18T12:30:00Z"),
      endDate: new Date("2026-03-18T15:00:00Z"),
      cookId: cooks[14].id,
      clientId: clients[10].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.LUNCH,
      price: 145,
      ...addr(10),
    },
    {
      guestsNumber: 16,
      startDate: new Date("2026-04-01T18:00:00Z"),
      endDate: null,
      cookId: cooks[5].id,
      clientId: clients[11].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      price: 496,
      ...addr(11),
    },
    {
      guestsNumber: 9,
      startDate: new Date("2026-04-10T19:00:00Z"),
      endDate: new Date("2026-04-10T22:30:00Z"),
      cookId: cooks[11].id,
      clientId: clients[12].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      price: 324,
      ...addr(12),
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-05-01T12:00:00Z"),
      endDate: new Date("2026-05-01T16:00:00Z"),
      cookId: cooks[2].id,
      clientId: clients[13].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.LUNCH,
      price: 240,
      ...addr(13),
    },
    {
      guestsNumber: 12,
      startDate: new Date("2026-05-10T18:30:00Z"),
      endDate: new Date("2026-05-10T23:00:00Z"),
      cookId: cooks[7].id,
      clientId: clients[14].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      price: 420,
      ...addr(14),
    },
    // ─── Données dédiées aux tests e2e parallèles ───────────────────────────
    // test.msg.client (15) ↔ test.msg.cook (15) — sendMessage
    {
      guestsNumber: 4,
      startDate: new Date("2026-07-01T19:00:00Z"),
      endDate: null,
      cookId: cooks[15].id,
      clientId: clients[15].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
      ...addr(15),
    },
    // test.review.client (17) ↔ Marie Dupont (1) — reviewPrestation : avec avis
    {
      guestsNumber: 4,
      startDate: new Date("2025-10-15T19:00:00Z"),
      endDate: new Date("2025-10-15T22:00:00Z"),
      cookId: cooks[1].id,
      clientId: clients[17].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      price: 160,
      ...addr(17),
    },
    // test.review.client (17) ↔ Léa Fontaine (9) — reviewPrestation : sans avis
    {
      guestsNumber: 2,
      startDate: new Date("2025-11-20T12:00:00Z"),
      endDate: new Date("2025-11-20T15:00:00Z"),
      cookId: cooks[9].id,
      clientId: clients[17].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.LUNCH,
      price: 90,
      ...addr(17),
    },
    // test.addr.client (18) ↔ Camille Petit (5) — updateCookRequestAddress : demande éditable
    {
      guestsNumber: 6,
      startDate: new Date("2026-08-15T19:00:00Z"),
      endDate: null,
      cookId: cooks[5].id,
      clientId: clients[18].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      price: 220,
      ...addr(18),
    },
    // ---- Demo requests ----

    // Alexis (demoAlexisClient) → Sophie (demoSophieCook)
    {
      guestsNumber: 4,
      startDate: new Date("2025-10-18T19:00:00Z"),
      endDate: new Date("2025-10-18T22:30:00Z"),
      cookId: demoSophieCook.id,
      clientId: demoAlexisClient.id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      message:
        "Diner d'anniversaire de ma femme, merci pour cette soiree memorable.",
      price: 232,
      street: "25 rue du Faubourg Saint-Antoine",
      postalCode: "75011",
      city: "Paris",
    },
    {
      guestsNumber: 6,
      startDate: new Date("2025-12-06T19:30:00Z"),
      endDate: new Date("2025-12-06T23:00:00Z"),
      cookId: demoSophieCook.id,
      clientId: demoAlexisClient.id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      message: "Repas de Noel en avance, parfaitement execute.",
      price: 348,
      street: "25 rue du Faubourg Saint-Antoine",
      postalCode: "75011",
      city: "Paris",
    },
    {
      guestsNumber: 8,
      startDate: new Date("2026-03-22T19:00:00Z"),
      endDate: new Date("2026-03-22T23:00:00Z"),
      cookId: demoSophieCook.id,
      clientId: demoAlexisClient.id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      message: "Soiree entre amis, quelques vegetariens parmi nous.",
      price: 464,
      street: "25 rue du Faubourg Saint-Antoine",
      postalCode: "75011",
      city: "Paris",
    },
    {
      guestsNumber: 4,
      startDate: new Date("2026-04-20T12:00:00Z"),
      endDate: new Date("2026-04-20T14:30:00Z"),
      cookId: demoSophieCook.id,
      clientId: demoAlexisClient.id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.LUNCH,
      message: "Dejeuner professionnel, cuisine raffinee souhaitee.",
      street: "25 rue du Faubourg Saint-Antoine",
      postalCode: "75011",
      city: "Paris",
    },
    {
      guestsNumber: 10,
      startDate: new Date("2025-11-15T19:00:00Z"),
      endDate: new Date("2025-11-15T23:00:00Z"),
      cookId: demoSophieCook.id,
      clientId: demoAlexisClient.id,
      status: CookRequestStatus.CANCELLED,
      mealType: MealType.DINNER,
      cancellationReason:
        "Changement de planning de derniere minute, toutes mes excuses.",
      street: "25 rue du Faubourg Saint-Antoine",
      postalCode: "75011",
      city: "Paris",
    },

    // Alexis (demoAlexisClient) → cooks existants
    {
      guestsNumber: 4,
      startDate: new Date("2026-04-05T19:30:00Z"),
      endDate: new Date("2026-04-05T22:30:00Z"),
      cookId: cooks[1].id,
      clientId: demoAlexisClient.id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
      message:
        "Soiree italienne pour 4, des pates fraiches maison s'il vous plait !",
      street: "25 rue du Faubourg Saint-Antoine",
      postalCode: "75011",
      city: "Paris",
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-03-28T19:00:00Z"),
      endDate: new Date("2026-03-28T23:00:00Z"),
      cookId: cooks[7].id,
      clientId: demoAlexisClient.id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      message: "Soiree japonaise pour l'anniversaire de mon fils.",
      price: 420,
      street: "25 rue du Faubourg Saint-Antoine",
      postalCode: "75011",
      city: "Paris",
    },
    {
      guestsNumber: 12,
      startDate: new Date("2025-09-20T18:00:00Z"),
      endDate: new Date("2025-09-20T23:00:00Z"),
      cookId: cooks[5].id,
      clientId: demoAlexisClient.id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      message: "Buffet de desserts pour un mariage civil.",
      price: 744,
      street: "25 rue du Faubourg Saint-Antoine",
      postalCode: "75011",
      city: "Paris",
    },

    // Clients existants → Sophie (demoSophieCook)
    {
      guestsNumber: 4,
      startDate: new Date("2026-04-12T19:00:00Z"),
      endDate: new Date("2026-04-12T22:30:00Z"),
      cookId: demoSophieCook.id,
      clientId: clients[0].id,
      status: CookRequestStatus.PENDING,
      mealType: MealType.DINNER,
      message:
        "Bonjour Sophie, j'ai entendu beaucoup de bien de vous. Soiree pour 4 personnes.",
      ...addr(0),
    },
    {
      guestsNumber: 8,
      startDate: new Date("2026-03-20T19:00:00Z"),
      endDate: new Date("2026-03-20T23:00:00Z"),
      cookId: demoSophieCook.id,
      clientId: clients[2].id,
      status: CookRequestStatus.ACCEPTED,
      mealType: MealType.DINNER,
      price: 464,
      ...addr(2),
    },
    {
      guestsNumber: 6,
      startDate: new Date("2026-01-18T19:30:00Z"),
      endDate: new Date("2026-01-18T23:00:00Z"),
      cookId: demoSophieCook.id,
      clientId: clients[4].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      price: 348,
      ...addr(4),
    },
    {
      guestsNumber: 4,
      startDate: new Date("2025-11-08T19:00:00Z"),
      endDate: new Date("2025-11-08T22:30:00Z"),
      cookId: demoSophieCook.id,
      clientId: clients[6].id,
      status: CookRequestStatus.COMPLETED,
      mealType: MealType.DINNER,
      price: 232,
      ...addr(6),
    },
  ];

  const savedRequests: CookRequestEntity[] = [];

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
    savedRequests.push(saved);

    await messageRepo.save(
      messageRepo.create({
        authorId: clientUserId,
        conversationId,
        message: `__COOK_REQUEST__${JSON.stringify({
          startDate: formatDateDDMMYYYY(saved.startDate),
          guestsNumber: saved.guestsNumber,
          mealType: saved.mealType,
          message: saved.message || "",
          street: saved.street ?? "",
          postalCode: saved.postalCode ?? "",
          city: saved.city ?? "",
          cookRequestId: saved.id,
        })}`,
      })
    );
  }
  console.log(
    `${requests.length} demandes de cook créées avec conversations et messages`
  );

  // --- Messages texte dans la conversation démo Alexis ↔ Sophie ---
  const demoConvId = conversationMap.get(
    `${demoAlexisUser.id}-${demoSophieUser.id}`
  );
  if (demoConvId) {
    await messageRepo.save(
      messageRepo.create({
        authorId: demoSophieUser.id,
        conversationId: demoConvId,
        message:
          "Bonjour Alexis, j'ai bien reçu votre demande. Avez-vous des contraintes alimentaires à me préciser ?",
      })
    );
    await messageRepo.save(
      messageRepo.create({
        authorId: demoAlexisUser.id,
        conversationId: demoConvId,
        message:
          "Bonjour Sophie ! Un invité est intolérant au gluten, les autres n'ont pas de contraintes particulières.",
      })
    );
    await messageRepo.save(
      messageRepo.create({
        authorId: demoSophieUser.id,
        conversationId: demoConvId,
        message:
          "Parfait, je préparerai un menu entièrement sans gluten qui ravira tout le monde. À très bientôt !",
      })
    );
  }

  // --- Reviews ---

  // Marie Dupont — 1 avis existant
  const completedWithReview = savedRequests.find(
    (r) =>
      r.cookId === cooks[1].id &&
      r.clientId === clients[0].id &&
      r.status === CookRequestStatus.COMPLETED
  );
  if (completedWithReview) {
    await reviewRepo.save({
      rating: 5,
      comment:
        "Marie est une cuisinière exceptionnelle, les pâtes fraîches étaient divines !",
      clientId: clients[0].id,
      cookId: cooks[1].id,
      cookRequestId: completedWithReview.id,
    });
  }

  // test.review.client — 1 avis existant (pour le test lecture seule)
  const reviewClientCompleted = savedRequests.find(
    (r) =>
      r.cookId === cooks[1].id &&
      r.clientId === clients[17].id &&
      r.status === CookRequestStatus.COMPLETED
  );
  if (reviewClientCompleted) {
    await reviewRepo.save({
      rating: 4,
      comment: "Excellente prestation, je recommande vivement.",
      clientId: clients[17].id,
      cookId: cooks[1].id,
      cookRequestId: reviewClientCompleted.id,
    });
  }

  // Pierre Martin — avis sur ses prestations complétées
  const pierreReviews: {
    clientIndex: number;
    rating: number;
    comment: string;
  }[] = [
    {
      clientIndex: 3,
      rating: 5,
      comment:
        "Cuisine française authentique, Pierre est un chef exceptionnel ! Nos invités étaient bluffés.",
    },
    {
      clientIndex: 4,
      rating: 4,
      comment:
        "Très bon repas, produits frais de qualité. Je recommande vivement.",
    },
    {
      clientIndex: 5,
      rating: 5,
      comment:
        "Pierre a su s'adapter à nos contraintes alimentaires. Une soirée magnifique.",
    },
    {
      clientIndex: 6,
      rating: 3,
      comment: "Correct mais sans plus, le service était un peu lent.",
    },
    {
      clientIndex: 7,
      rating: 5,
      comment:
        "Le meilleur dîner qu'on ait jamais organisé à la maison. Merci Pierre !",
    },
    {
      clientIndex: 9,
      rating: 4,
      comment: "Très professionnel, cuisine de qualité. On refera appel à lui.",
    },
    {
      clientIndex: 10,
      rating: 5,
      comment: "Incroyable talent, le bœuf bourguignon était parfait.",
    },
    {
      clientIndex: 11,
      rating: 4,
      comment: "Belle soirée, Pierre est ponctuel et très agréable.",
    },
  ];

  for (const { clientIndex, rating, comment } of pierreReviews) {
    const req = savedRequests.find(
      (r) =>
        r.cookId === cooks[0].id &&
        r.clientId === clients[clientIndex].id &&
        r.status === CookRequestStatus.COMPLETED
    );
    if (req) {
      await reviewRepo.save({
        rating,
        comment,
        clientId: clients[clientIndex].id,
        cookId: cooks[0].id,
        cookRequestId: req.id,
      });
    }
  }

  console.log("Reviews créées");

  // --- Reviews démo ---
  const alexisSophieCompleted = savedRequests.filter(
    (r) =>
      r.cookId === demoSophieCook.id &&
      r.clientId === demoAlexisClient.id &&
      r.status === CookRequestStatus.COMPLETED
  );
  const alexisSophieComments = [
    "Sophie a cree une atmosphere magique tout en nous regalant. Une adresse a garder precieusement.",
    "Notre meilleure table de l'annee, et c'etait chez nous ! Bravo Sophie.",
  ];
  for (
    let i = 0;
    i < alexisSophieCompleted.length && i < alexisSophieComments.length;
    i++
  ) {
    await reviewRepo.save({
      rating: 5,
      comment: alexisSophieComments[i],
      clientId: demoAlexisClient.id,
      cookId: demoSophieCook.id,
      cookRequestId: alexisSophieCompleted[i].id,
    });
  }

  const alexisCamilleCompleted = savedRequests.find(
    (r) =>
      r.cookId === cooks[5].id &&
      r.clientId === demoAlexisClient.id &&
      r.status === CookRequestStatus.COMPLETED
  );
  if (alexisCamilleCompleted) {
    await reviewRepo.save({
      rating: 5,
      comment:
        "Des desserts absolument somptueux, tous nos invites etaient enchantes !",
      clientId: demoAlexisClient.id,
      cookId: cooks[5].id,
      cookRequestId: alexisCamilleCompleted.id,
    });
  }

  const nathanSophieCompleted = savedRequests.find(
    (r) =>
      r.cookId === demoSophieCook.id &&
      r.clientId === clients[4].id &&
      r.status === CookRequestStatus.COMPLETED
  );
  if (nathanSophieCompleted) {
    await reviewRepo.save({
      rating: 5,
      comment:
        "Sophie est une cuisiniere hors pair, ses preparations etaient dignes d'un restaurant etoile !",
      clientId: clients[4].id,
      cookId: demoSophieCook.id,
      cookRequestId: nathanSophieCompleted.id,
    });
  }

  const theoSophieCompleted = savedRequests.find(
    (r) =>
      r.cookId === demoSophieCook.id &&
      r.clientId === clients[6].id &&
      r.status === CookRequestStatus.COMPLETED
  );
  if (theoSophieCompleted) {
    await reviewRepo.save({
      rating: 4,
      comment: "Tres belle soiree, cuisine delicate et service impeccable.",
      clientId: clients[6].id,
      cookId: demoSophieCook.id,
      cookRequestId: theoSophieCompleted.id,
    });
  }

  console.log("Reviews démo créées");

  await dataSource.destroy();
  console.log("\nSeed terminé avec succès !");
  console.log("──────────────────────────────────────");
  console.log(`Admin    : admin@cookus.app / admin1234`);
  console.log(`Cooks    : *@cookus.app    / ${COOK_PASSWORD}`);
  console.log(`Clients  : *@cookus.app    / ${CLIENT_PASSWORD}`);
  console.log(`Démo cook: sophie.lambert@demo.cookus.app / ${DEMO_PASSWORD}`);
  console.log(`Démo client: alexis.martin@demo.cookus.app / ${DEMO_PASSWORD}`);
  console.log("──────────────────────────────────────");
}

seed().catch((error) => {
  console.error("Seed échoué :", error);
  process.exit(1);
});
