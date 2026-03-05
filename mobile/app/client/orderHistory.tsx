import { Button } from "@/components/ui/Button";
import {
  useOrderHistory,
  type CookRequestStatus,
  type OrderHistoryItem,
} from "@/features/client/account/viewProfile/useOrderHistory";
import { CancelBookingModal } from "@/features/client/cancelBooking/components/CancelBookingModal";
import { useCancelBooking } from "@/features/client/cancelBooking/useCancelBooking";
import { ReviewSection } from "@/features/client/review/ReviewSection";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tab = "upcoming" | "completed";

const UPCOMING_STATUSES: CookRequestStatus[] = ["pending", "accepted"];
const COMPLETED_STATUSES: CookRequestStatus[] = ["completed", "refused", "cancelled"];

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  dinner: "Dîner",
};

const STATUS_LABEL: Record<CookRequestStatus, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
  cancelled: "Annulée",
  completed: "Terminée",
};

const STATUS_COLOR: Record<CookRequestStatus, string> = {
  pending: colors.secondary,
  accepted: "#4CAF50",
  refused: colors.mainDark,
  cancelled: "#9E9E9E",
  completed: "#607D8B",
};

const CANCELLABLE_STATUSES: CookRequestStatus[] = ["pending", "accepted"];

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { orders, loading, error, refresh } = useOrderHistory();
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [cancelTarget, setCancelTarget] = useState<OrderHistoryItem | null>(
    null,
  );

  const {
    cancelBooking,
    isLoading: cancelLoading,
    error: cancelError,
    clearError,
  } = useCancelBooking(() => {
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

  const filteredOrders = orders.filter((o) =>
    activeTab === "upcoming"
      ? UPCOMING_STATUSES.includes(o.status)
      : COMPLETED_STATUSES.includes(o.status)
  );

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Historique de réservations</Text>
      <View style={styles.headerRight} />
    </View>
  );

  const tabs = (
    <View style={styles.tabsRow}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "upcoming" && styles.tabActive]}
        onPress={() => setActiveTab("upcoming")}
      >
        <Text style={[styles.tabText, activeTab === "upcoming" && styles.tabTextActive]}>
          À venir
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "completed" && styles.tabActive]}
        onPress={() => setActiveTab("completed")}
      >
        <Text style={[styles.tabText, activeTab === "completed" && styles.tabTextActive]}>
          Terminées
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {header}
        {tabs}
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
        {tabs}
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <View style={{ marginTop: 12 }}>
            <Button title="Réessayer" variant="outline" onPress={refresh} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {header}
      {tabs}
      <FlatList
        data={filteredOrders}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>Aucune réservation</Text>
            <Text style={styles.emptyText}>
              {activeTab === "upcoming"
                ? "Vous n'avez pas de réservations à venir."
                : "Vous n'avez pas encore de réservations terminées."}
            </Text>
          </View>
        }
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
            <View style={styles.card} testID="order-item">
              <View style={styles.cardHeader}>
                <Text style={styles.cookName} testID="order-cook-name">
                  {item.cook.firstName} {item.cook.lastName}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_COLOR[item.status] },
                  ]}
                >
                  <Text style={styles.statusText} testID="order-status">
                    {STATUS_LABEL[item.status]}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.detail} testID="order-date">
                  {formattedDate}
                </Text>
                <Text style={styles.detail} testID="order-guests">
                  {item.guestsNumber} convive{item.guestsNumber > 1 ? "s" : ""}
                </Text>
              </View>
              <Text style={styles.detail} testID="order-meal-type">
                {MEAL_TYPE_LABELS[item.mealType] ?? item.mealType}
              </Text>

              {item.cancellationReason && (
                <Text style={styles.cancellationReason} testID="cancellation-reason">
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

              {item.status === "completed" && (
                <ReviewSection
                  cookRequestId={item.id}
                  existingReview={item.review}
                  cookName={`${item.cook.firstName} ${item.cook.lastName}`}
                  onReviewSubmitted={refresh}
                />
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
  tabsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  tabActive: {
    backgroundColor: colors.main,
    borderColor: colors.main,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  tabTextActive: {
    color: colors.white,
  },
});
