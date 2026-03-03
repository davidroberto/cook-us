/**
 * Repository pour la slice viewProfile.
 *
 * Endpoints backend disponibles pour le rôle CLIENT :
 *   - POST   /cook-request          → Créer une demande
 *   - PATCH  /cook-request/:id/cancel → Annuler une demande
 *
 * Endpoints NON disponibles (pas implémentés côté serveur) :
 *   - GET    /users/me              → Récupérer son profil
 *   - PATCH  /users/me              → Mettre à jour ses coordonnées
 *   - POST   /auth/change-password  → Changer son mot de passe
 *   - GET    /cook-request?clientId → Lister ses propres commandes
 */

export class BackendNotAvailableError extends Error {
  constructor(feature: string) {
    super(
      `"${feature}" n'est pas encore disponible (endpoint backend manquant).`
    );
  }
}
