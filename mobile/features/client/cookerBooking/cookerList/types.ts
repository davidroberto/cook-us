/**
 * Types basés sur le schéma backend (source de vérité).
 * Ne pas modifier sans aligner avec le backend.
 */

// ─── Enums (miroir des enums PostgreSQL) ────────────────────────────────────

export type UserRole = "client" | "cook" | "admin";

export type CookSpeciality =
  | "indian"
  | "french"
  | "italian"
  | "japanese"
  | "mexican";

// ─── Modèles bruts (miroir des tables DB) ───────────────────────────────────

/** Table : users */
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  thumbnail: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

/** Table : cook_image */
export interface CookImage {
  id: string;
  cook_id: string;
  url: string;
  created_at: string;
  updated_at: string;
}

/** Table : cook (avec relations jointes telles que retournées par l'API) */
export interface Cook {
  id: string;
  user_id: string;
  description: string;
  speciality: CookSpeciality;
  hourly_rate: number;
  city: string;
  created_at: string;
  updated_at: string;
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
