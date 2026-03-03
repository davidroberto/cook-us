/**
 * Liste de l'historique de commandes du client.
 *
 * Note backend : Aucun endpoint GET /cook-request accessible aux clients
 * n'est disponible (le rôle requis est cook ou admin). Ce composant affiche
 * un état vide en attendant l'implémentation d'un endpoint dédié.
 */

import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/colors";

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
  cancelled: "Annulée",
};

export const OrderHistoryList = () => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Historique de commandes</Text>

      <View style={styles.emptyContainer} testID="order-history-empty">
        <Text style={styles.emptyTitle}>Aucune commande disponible</Text>
        <Text style={styles.emptyText}>
          L'historique de vos réservations sera disponible prochainement.
        </Text>
      </View>
    </View>
  );
};

export { STATUS_LABEL };

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  emptyContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.56,
    textAlign: "center",
    lineHeight: 18,
  },
});
