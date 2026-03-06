import { Button } from "@/components/ui/Button";
import {
  useOrderHistory,
  type CookRequestStatus,
} from "@/features/client/account/viewProfile/useOrderHistory";
import { CookRequestCard } from "@/features/client/cookRequest/components/CookRequestCard";
import { AddressEditor } from "@/features/client/cookRequest/components/AddressEditor";
import { useAuth } from "@/features/auth/AuthContext";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";

type Tab = "upcoming" | "completed";

const UPCOMING_STATUSES: CookRequestStatus[] = ["pending", "accepted"];
const COMPLETED_STATUSES: CookRequestStatus[] = ["completed", "refused", "cancelled"];
const CANCELLABLE_STATUSES: CookRequestStatus[] = ["pending", "accepted"];
const EDITABLE_STATUSES: CookRequestStatus[] = ["pending", "accepted", "refused", "cancelled"];

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { orders, loading, error, refresh } = useOrderHistory();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

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
      <ScreenBackground>
        {header}
        {tabs}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.main} />
        </View>
      </ScreenBackground>
    );
  }

  if (error) {
    return (
      <ScreenBackground>
        {header}
        {tabs}
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <View style={{ marginTop: 12 }}>
            <Button title="Réessayer" variant="outline" onPress={refresh} />
          </View>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      {header}
      {tabs}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <FlatList
        data={filteredOrders}
        keyboardShouldPersistTaps="handled"
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
        renderItem={({ item }) => (
          <CookRequestCard
            id={item.id}
            startDate={item.startDate}
            status={item.status}
            guestsNumber={item.guestsNumber}
            mealType={item.mealType}
            cancellationReason={item.cancellationReason}
            cookName={`${item.cook.firstName} ${item.cook.lastName}`}
            canCancel={CANCELLABLE_STATUSES.includes(item.status)}
            onCancelSuccess={refresh}
            review={item.review}
            onReviewSubmitted={refresh}
            address={item.street ? `${item.street}, ${item.postalCode} ${item.city}` : null}
          >
            <AddressEditor
              id={item.id}
              street={item.street}
              postalCode={item.postalCode}
              city={item.city}
              token={token}
              canEdit={EDITABLE_STATUSES.includes(item.status)}
              onUpdated={refresh}
            />
          </CookRequestCard>
        )}
      />
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
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
  },
  list: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
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
