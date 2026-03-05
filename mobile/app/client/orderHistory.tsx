import { useState } from "react";
import { useOrderHistory, type CookRequestStatus, type OrderHistoryItem } from "@/features/client/account/viewProfile/useOrderHistory";
import { useCancelBooking } from "@/features/client/cancelBooking/useCancelBooking";
import { CancelBookingModal } from "@/features/client/cancelBooking/components/CancelBookingModal";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";

const STATUS_LABEL: Record<CookRequestStatus, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
  cancelled: "Annulée",
  paid: "Payée",
};

const STATUS_COLOR: Record<CookRequestStatus, string> = {
  pending: colors.secondary,
  accepted: "#4CAF50",
  refused: colors.mainDark,
  cancelled: "#9E9E9E",
  paid: "#2196F3",
};

const CANCELLABLE_STATUSES: CookRequestStatus[] = ["pending", "accepted"];

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { orders, loading, error, refresh } = useOrderHistory();
  const [cancelTarget, setCancelTarget] = useState<OrderHistoryItem | null>(null);

  const { cancelBooking, isLoading: cancelLoading, error: cancelError, clearError } = useCancelBooking(() => {
    setCancelTarget(null);
    refresh();
  });

  const handleCancelPress = (order: OrderHistoryItem) => {
    clearError();
    setCancelTarget(order);
  };

  const handleConfirmCancel = (reason: string) => {
    if (cancelTarget) {
      cancelBooking(cancelTarget.id, reason);
    }
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Historique de réservations</Text>
      <View style={styles.headerRight} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.main} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {header}
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <View style={{ marginTop: 12 }}>
            <Button title="Réessayer" variant="outline" onPress={refresh} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {header}
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Aucune réservation</Text>
          <Text style={styles.emptyText}>
            Vos réservations apparaîtront ici une fois que vous en aurez effectué.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {header}
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

          const canCancel = CANCELLABLE_STATUSES.includes(item.status);

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
                <Text style={styles.detail}>{formattedDate}</Text>
                <Text style={styles.detail}>
                  {item.guestsNumber} convive{item.guestsNumber > 1 ? "s" : ""}
                </Text>
              </View>

              {item.cancellationReason && (
                <Text style={styles.cancellationReason}>
                  Motif : {item.cancellationReason}
                </Text>
              )}

              {canCancel && (
                <View style={styles.cancelButtonContainer}>
                  <Button
                    testID={`cancel-button-${item.id}`}
                    title="Annuler la réservation"
                    variant="outline"
                    onPress={() => handleCancelPress(item)}
                    style={styles.cancelButton}
                  />
                </View>
              )}
            </View>
          );
        }}
      />

      <CancelBookingModal
        visible={cancelTarget !== null}
        cookName={
          cancelTarget
            ? `${cancelTarget.cook.firstName} ${cancelTarget.cook.lastName}`
            : ""
        }
        isLoading={cancelLoading}
        error={cancelError}
        onCancel={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
  backButton: { padding: 4 },
  backText: {
    ...typography.styles.body1Regular,
    color: colors.main,
  },
  headerTitle: {
    ...typography.styles.body1Bold,
    color: colors.text,
  },
  headerRight: { width: 60 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.background,
    flexGrow: 1,
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
  cancelButtonContainer: {
    marginTop: 12,
  },
  cancelButton: {
    borderColor: colors.mainDark,
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
