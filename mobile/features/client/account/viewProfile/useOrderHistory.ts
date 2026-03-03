/**
 * Hook pour l'historique de commandes du client.
 *
 * Le backend ne propose pas d'endpoint permettant à un client de lister
 * ses propres demandes de prestation (GET /cook-request est réservé aux
 * rôles cook et admin). Ce hook retourne un état "non disponible" en
 * attendant l'implémentation serveur.
 */

export interface UseOrderHistoryResult {
  backendUnavailable: true;
}

export const useOrderHistory = (): UseOrderHistoryResult => {
  return { backendUnavailable: true };
};
