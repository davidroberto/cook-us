/**
 * Hook exposant les données du profil connecté.
 * Source : AuthContext (données reçues lors du login/register et stockées en mémoire).
 * Il n'existe pas d'endpoint GET /users/me côté backend.
 */

import { useAuth } from "@/features/auth/AuthContext";
import type { ProfileUser } from "./types";

interface UseProfileResult {
  user: ProfileUser | null;
}

export const useProfile = (): UseProfileResult => {
  const { user } = useAuth();
  return { user };
};
