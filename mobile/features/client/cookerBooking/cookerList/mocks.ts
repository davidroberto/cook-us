/**
 * Mock data simulant les relations users ↔ cook ↔ cook_image.
 * Structure identique à la réponse API (GET /cooks).
 * Utilisé pour les tests unitaires (via jest.mock('./repository')).
 */

import type { Cook } from "./types";

export const MOCK_COOKS: Cook[] = [
  {
    id: "cook-1",
    userId: 1,
    description: "Cuisinier indien passionné, spécialiste des currys et biryani.",
    speciality: "indian_cooking",
    hourlyRate: 35,
    photoUrl: null,
    isActive: true,
    user: {
      id: 1,
      firstName: "Arjun",
      lastName: "Sharma",
      email: "arjun.sharma@example.com",
      thumbnail: "https://randomuser.me/api/portraits/men/11.jpg",
      role: "cook",
      createdAt: "2024-01-10T08:00:00.000Z",
      updatedAt: "2024-01-10T08:00:00.000Z",
    },
    images: [
      {
        id: 1,
        cookId: 1,
        imgUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        description: null,
        createdAt: "2024-01-10T08:00:00.000Z",
        updatedAt: "2024-01-10T08:00:00.000Z",
      },
    ],
  },
  {
    id: "cook-2",
    userId: 2,
    description: "Chef français formé à Lyon, expert en cuisine gastronomique.",
    speciality: "french_cooking",
    hourlyRate: 55,
    photoUrl: null,
    isActive: true,
    user: {
      id: 2,
      firstName: "Étienne",
      lastName: "Dupont",
      email: "etienne.dupont@example.com",
      thumbnail: "https://randomuser.me/api/portraits/men/22.jpg",
      role: "cook",
      createdAt: "2024-02-05T09:00:00.000Z",
      updatedAt: "2024-02-05T09:00:00.000Z",
    },
    images: [],
  },
  {
    id: "cook-3",
    userId: 3,
    description:
      "Cuisinière italienne de Naples, spécialiste des pâtes fraîches et pizzas.",
    speciality: "italian_cooking",
    hourlyRate: 42,
    photoUrl: null,
    isActive: true,
    user: {
      id: 3,
      firstName: "Sofia",
      lastName: "Romano",
      email: "sofia.romano@example.com",
      thumbnail: null,
      role: "cook",
      createdAt: "2024-03-01T10:00:00.000Z",
      updatedAt: "2024-03-01T10:00:00.000Z",
    },
    images: [
      {
        id: 3,
        cookId: 3,
        imgUrl: "https://randomuser.me/api/portraits/women/33.jpg",
        description: null,
        createdAt: "2024-03-01T10:00:00.000Z",
        updatedAt: "2024-03-01T10:00:00.000Z",
      },
    ],
  },
  {
    id: "cook-4",
    userId: 4,
    description: "Cuisinier indien végétarien, maître du thali et des dosas.",
    speciality: "indian_cooking",
    hourlyRate: 30,
    photoUrl: null,
    isActive: true,
    user: {
      id: 4,
      firstName: "Priya",
      lastName: "Nair",
      email: "priya.nair@example.com",
      thumbnail: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "cook",
      createdAt: "2024-03-15T11:00:00.000Z",
      updatedAt: "2024-03-15T11:00:00.000Z",
    },
    images: [],
  },
  {
    id: "cook-5",
    userId: 5,
    description:
      "Chef français passionné de terroir, cuisine du marché et recettes de saison.",
    speciality: "french_cooking",
    hourlyRate: 48,
    photoUrl: null,
    isActive: true,
    user: {
      id: 5,
      firstName: "Marie",
      lastName: "Leblanc",
      email: "marie.leblanc@example.com",
      thumbnail: null,
      role: "cook",
      createdAt: "2024-04-01T12:00:00.000Z",
      updatedAt: "2024-04-01T12:00:00.000Z",
    },
    images: [],
  },
];
