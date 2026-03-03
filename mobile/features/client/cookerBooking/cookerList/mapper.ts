/**
 * Couche de mapping : modèle API brut (Cook) → modèle UI (CookerCardData).
 * Centralise la logique de transformation pour éviter de la dupliquer dans les composants.
 */

import type { Cook, CookerCardData } from "./types";

/**
 * Résout la miniature à afficher :
 * - users.thumbnail en priorité
 * - sinon première image de cook_image
 * - sinon null
 */
const resolveThumbnail = (cook: Cook): string | null => {
  if (cook.user.thumbnail) return cook.user.thumbnail;
  if (cook.images.length > 0) return cook.images[0].imgUrl;
  return null;
};

export const mapCookToCardData = (cook: Cook): CookerCardData => ({
  id: cook.id,
  first_name: cook.user.firstName,
  last_name: cook.user.lastName,
  speciality: cook.speciality,
  thumbnail: resolveThumbnail(cook),
  hourly_rate: cook.hourlyRate ?? 0,
  // city n'existe pas encore dans l'entité backend
  city: "",
});

export const mapCooksToCardData = (cooks: Cook[]): CookerCardData[] =>
  cooks.map(mapCookToCardData);
