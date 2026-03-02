/**
 * Mock data simulant les relations users ↔ cook ↔ cook_image.
 * Structure identique à la réponse API future (GET /cooks).
 * À supprimer et remplacer par un fetch réel quand le backend sera prêt.
 */

import type { Cook } from "./types";

export const MOCK_COOKS: Cook[] = [
  {
    id: "cook-1",
    user_id: "user-1",
    description:
      "Cuisinier indien passionné, spécialiste des currys et biryani.",
    speciality: "indian",
    hourly_rate: 35,
    city: "Paris",
    created_at: "2024-01-10T08:00:00.000Z",
    updated_at: "2024-01-10T08:00:00.000Z",
    user: {
      id: "user-1",
      first_name: "Arjun",
      last_name: "Sharma",
      email: "arjun.sharma@example.com",
      thumbnail: "https://randomuser.me/api/portraits/men/11.jpg",
      role: "cook",
      created_at: "2024-01-10T08:00:00.000Z",
      updated_at: "2024-01-10T08:00:00.000Z",
    },
    images: [
      {
        id: "img-1-1",
        cook_id: "cook-1",
        url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        created_at: "2024-01-10T08:00:00.000Z",
        updated_at: "2024-01-10T08:00:00.000Z",
      },
    ],
  },
  {
    id: "cook-2",
    user_id: "user-2",
    description: "Chef français formé à Lyon, expert en cuisine gastronomique.",
    speciality: "french",
    hourly_rate: 55,
    city: "Lyon",
    created_at: "2024-02-05T09:00:00.000Z",
    updated_at: "2024-02-05T09:00:00.000Z",
    user: {
      id: "user-2",
      first_name: "Étienne",
      last_name: "Dupont",
      email: "etienne.dupont@example.com",
      thumbnail: "https://randomuser.me/api/portraits/men/22.jpg",
      role: "cook",
      created_at: "2024-02-05T09:00:00.000Z",
      updated_at: "2024-02-05T09:00:00.000Z",
    },
    images: [],
  },
  {
    id: "cook-3",
    user_id: "user-3",
    description:
      "Cuisinière italienne de Naples, spécialiste des pâtes fraîches et pizzas.",
    speciality: "italian",
    hourly_rate: 42,
    city: "Marseille",
    created_at: "2024-03-01T10:00:00.000Z",
    updated_at: "2024-03-01T10:00:00.000Z",
    user: {
      id: "user-3",
      first_name: "Sofia",
      last_name: "Romano",
      email: "sofia.romano@example.com",
      thumbnail: null,
      role: "cook",
      created_at: "2024-03-01T10:00:00.000Z",
      updated_at: "2024-03-01T10:00:00.000Z",
    },
    images: [
      {
        id: "img-3-1",
        cook_id: "cook-3",
        url: "https://randomuser.me/api/portraits/women/33.jpg",
        created_at: "2024-03-01T10:00:00.000Z",
        updated_at: "2024-03-01T10:00:00.000Z",
      },
      {
        id: "img-3-2",
        cook_id: "cook-3",
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
        created_at: "2024-03-01T10:00:00.000Z",
        updated_at: "2024-03-01T10:00:00.000Z",
      },
    ],
  },
  {
    id: "cook-4",
    user_id: "user-4",
    description:
      "Cuisinier indien végétarien, maître du thali et des dosas.",
    speciality: "indian",
    hourly_rate: 30,
    city: "Bordeaux",
    created_at: "2024-03-15T11:00:00.000Z",
    updated_at: "2024-03-15T11:00:00.000Z",
    user: {
      id: "user-4",
      first_name: "Priya",
      last_name: "Nair",
      email: "priya.nair@example.com",
      thumbnail: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "cook",
      created_at: "2024-03-15T11:00:00.000Z",
      updated_at: "2024-03-15T11:00:00.000Z",
    },
    images: [],
  },
  {
    id: "cook-5",
    user_id: "user-5",
    description:
      "Chef français passionné de terroir, cuisine du marché et recettes de saison.",
    speciality: "french",
    hourly_rate: 48,
    city: "Nantes",
    created_at: "2024-04-01T12:00:00.000Z",
    updated_at: "2024-04-01T12:00:00.000Z",
    user: {
      id: "user-5",
      first_name: "Marie",
      last_name: "Leblanc",
      email: "marie.leblanc@example.com",
      thumbnail: null,
      role: "cook",
      created_at: "2024-04-01T12:00:00.000Z",
      updated_at: "2024-04-01T12:00:00.000Z",
    },
    images: [],
  },
];
