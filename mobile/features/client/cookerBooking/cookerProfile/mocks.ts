/**
 * Mock data simulant la réponse API (GET /cook/:id).
 * À supprimer et remplacer par un fetch réel quand le backend sera prêt.
 */

import type { CookerProfile } from "./types";

export const MOCK_COOKER_PROFILE: CookerProfile = {
  id: "cook-1",
  firstName: "Marie",
  lastName: "Dupont",
  photoUrl: null,
  description:
    "Cuisinière passionnée spécialisée dans la gastronomie française traditionnelle. 10 ans d'expérience en restauration étoilée.",
  speciality: "Gastronomie française",
  hourlyRate: 35,
};
