/**
 * Couche de mapping : modèle API brut (Cook) → modèle UI (CookerCardData).
 * Centralise la logique de transformation pour éviter de la dupliquer dans les composants.
 */

import { getApiUrl } from "@/features/api/getApiUrl";
import type { Cook, CookerCardData } from "./types";

/**
 * Transforme un chemin relatif (/api/uploads/…) en URL absolue.
 */
const toAbsoluteUrl = (path: string): string => {
  if (path.startsWith("http")) return path;
  const baseUrl = getApiUrl().replace(/\/api$/, "");
  return `${baseUrl}${path}`;
};

/**
 * Résout la miniature à afficher :
 * - users.thumbnail en priorité
 * - sinon cook.photoUrl
 * - sinon null (initiales)
 */
const resolveThumbnail = (cook: Cook): string | null => {
  if (cook.user.thumbnail) return toAbsoluteUrl(cook.user.thumbnail);
  if (cook.photoUrl) return toAbsoluteUrl(cook.photoUrl);
  return null;
};

export const mapCookToCardData = (cook: Cook): CookerCardData => ({
  id: cook.id,
  first_name: cook.user.firstName,
  last_name: cook.user.lastName,
  speciality: cook.speciality,
  thumbnail: resolveThumbnail(cook),
  hourly_rate: cook.hourlyRate ?? 0,
  city: cook.city ?? "",
  averageRating: cook.averageRating ?? null,
  reviewCount: cook.reviewCount ?? 0,
});

export const mapCooksToCardData = (cooks: Cook[]): CookerCardData[] =>
  cooks.map(mapCookToCardData);
