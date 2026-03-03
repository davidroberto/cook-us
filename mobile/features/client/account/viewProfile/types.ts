/**
 * Types pour la slice viewProfile.
 *
 * Analyse backend :
 * - Aucun endpoint PATCH /users/me → modification de profil non disponible côté serveur.
 * - Aucun endpoint POST /auth/change-password → changement de mot de passe non disponible.
 * - Aucun endpoint GET /cook-request pour les clients → historique de commandes non disponible.
 * - Les données utilisateur (firstName, lastName, email) proviennent du token de connexion
 *   stocké dans AuthContext.
 */

export type { AuthUser as ProfileUser } from "@/features/auth/login/types";

export interface PasswordChangeValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type CookRequestStatus =
  | "pending"
  | "accepted"
  | "refused"
  | "cancelled";

/** Placeholder en attente d'un endpoint backend dédié aux clients. */
export interface OrderHistoryItem {
  id: number;
  cookFirstName: string;
  cookLastName: string;
  startDate: string;
  guestsNumber: number;
  status: CookRequestStatus;
}
