import { useOrderHistory, type CookRequestStatus } from "@/features/client/account/viewProfile/useOrderHistory";
import { colors } from "@/styles/colors";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "@/components/ui/Button";

const STATUS_LABEL: Record<CookRequestStatus, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
  cancelled: "Annulée",
};

const STATUS_COLOR: Record<CookRequestStatus, string> = {
  pending: colors.secondary,
  accepted: "#4CAF50",
  refused: colors.mainDark,
  cancelled: "#9E9E9E",
};

export default function OrderHistoryScreen() {
  const { orders, loading, error, refresh } = useOrderHistory();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <View style={{ marginTop: 12 }}>
          <Button title="Réessayer" variant="outline" onPress={refresh} />
        </View>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>Aucune réservation</Text>
        <Text style={styles.emptyText}>
          Vos réservations apparaîtront ici une fois que vous en aurez effectué.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const date = new Date(item.startDate);
        const formattedDate = date.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cookName}>
                {item.cook.firstName} {item.cook.lastName}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: STATUS_COLOR[item.status] },
                ]}
              >
                <Text style={styles.statusText}>
                  {STATUS_LABEL[item.status]}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.detail}>
                {formattedDate}
              </Text>
              <Text style={styles.detail}>
                {item.guestsNumber} convive{item.guestsNumber > 1 ? "s" : ""}
              </Text>
            </View>

            {item.cancellationReason && (
              <Text style={styles.cancellationReason}>
                Motif : {item.cancellationReason}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: colors.opacity[8],
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cookName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detail: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  cancellationReason: {
    marginTop: 8,
    fontSize: 13,
    color: colors.mainDark,
    fontStyle: "italic",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.56,
    textAlign: "center",
    lineHeight: 20,
  },
  errorText: {
    fontSize: 15,
    color: colors.mainDark,
    textAlign: "center",
  },
});
