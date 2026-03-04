/**
 * Types basés sur le schéma backend (source de vérité).
 * Ne pas modifier sans aligner avec le backend.
 */

// ─── Enums (miroir des enums PostgreSQL) ────────────────────────────────────

export type UserRole = "client" | "cook" | "admin";

export type CookSpeciality =
  | "french_cooking"
  | "italian_cooking"
  | "asian_cooking"
  | "mexican_cooking"
  | "vegetarian_cooking"
  | "pastry_cooking"
  | "japanese_cooking"
  | "indian_cooking"
  | "autre";

// ─── Modèles bruts (miroir des tables DB) ───────────────────────────────────

/** Table : users */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  thumbnail: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/** Table : cook_image */
export interface CookImage {
  id: number;
  cookId: number;
  imgUrl: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Table : cook (avec relations jointes telles que retournées par l'API) */
export interface Cook {
  id: string;
  userId: number;
  description: string | null;
  speciality: CookSpeciality;
  hourlyRate: number | null;
  photoUrl: string | null;
  isActive: boolean;
  isValidated: boolean;
  /** Relation : users */
  user: User;
  /** Relation : cook_image[] */
  images: CookImage[];
}

// ─── Modèle UI (après mapping, consommé par les composants) ─────────────────

/** Données aplaties nécessaires pour afficher une CookerCard. */
export interface CookerCardData {
  id: string;
  first_name: string;
  last_name: string;
  speciality: CookSpeciality;
  /** users.thumbnail en priorité, sinon première cook_image, sinon null */
  thumbnail: string | null;
  hourly_rate: number;
  city: string;
}
