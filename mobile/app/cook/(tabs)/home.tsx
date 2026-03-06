import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { colors } from "@/styles/colors";
import { Button } from "@/components/ui/Button";
import { useCookRequests } from "@/features/cook/cookRequests/useCookRequests";
import { AcceptPriceModal } from "@/features/cook/cookRequests/components/AcceptPriceModal";
import { RefuseModal } from "@/features/cook/cookRequests/components/RefuseModal";
import type {
  CookRequestItem,
  CookRequestStatus,
} from "@/features/cook/cookRequests/repository";

const STATUS_LABEL: Record<CookRequestStatus, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
  cancelled: "Annulée",
  paid: "Payée",
  completed: "Terminée",
};

const STATUS_COLOR: Record<CookRequestStatus, string> = {
  pending: colors.secondary,
  accepted: "#4CAF50",
  refused: colors.mainDark,
  cancelled: "#9E9E9E",
  paid: "#2196F3",
  completed: "#607D8B",
};

type Tab = "active" | "completed" | "refused";

const TABS: { key: Tab; label: string }[] = [
  { key: "active", label: "En cours" },
  { key: "completed", label: "Terminées" },
  { key: "refused", label: "Refusées" },
];

const ACTIVE_STATUSES: CookRequestStatus[] = ["pending", "accepted", "paid"];
const COMPLETED_STATUSES: CookRequestStatus[] = ["completed"];
const REFUSED_STATUSES: CookRequestStatus[] = ["refused", "cancelled"];

export default function CookHomeTab() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const {
    requests,
    loading,
    error,
    actionError,
    refresh,
    accept,
    refuse,
    updatePrice,
    actionLoading,
    clearActionError, loadingMore, loadMore
  } = useCookRequests();

  const [selectedRequest, setSelectedRequest] =
    useState<CookRequestItem | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);

  const openAcceptModal = (item: CookRequestItem) => {
    clearActionError();
    setSelectedRequest(item);
    setShowAcceptModal(true);
  };

  const openRefuseModal = (item: CookRequestItem) => {
    clearActionError();
    setSelectedRequest(item);
    setShowRefuseModal(true);
  };

  const openEditPriceModal = (item: CookRequestItem) => {
    clearActionError();
    setSelectedRequest(item);
    setShowEditPriceModal(true);
  };

  const handleAcceptConfirm = async (price: number) => {
    if (!selectedRequest) return;
    const success = await accept(selectedRequest.id, price);
    if (success) {
      setShowAcceptModal(false);
      setSelectedRequest(null);
    }
  };

  const handleRefuseConfirm = async () => {
    if (!selectedRequest) return;
    const success = await refuse(selectedRequest.id);
    if (success) {
      setShowRefuseModal(false);
      setSelectedRequest(null);
    }
  };

  const handleEditPriceConfirm = async (price: number) => {
    if (!selectedRequest) return;
    const success = await updatePrice(selectedRequest.id, price);
    if (success) {
      setShowEditPriceModal(false);
      setSelectedRequest(null);
    }
  };

  const closeModals = () => {
    setShowAcceptModal(false);
    setShowRefuseModal(false);
    setShowEditPriceModal(false);
    setSelectedRequest(null);
    clearActionError();
  };

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

  const filteredRequests = requests.filter((r) => {
    if (activeTab === "active") return ACTIVE_STATUSES.includes(r.status);
    if (activeTab === "completed") return COMPLETED_STATUSES.includes(r.status);
    return REFUSED_STATUSES.includes(r.status);
  });

  const clientName = selectedRequest
    ? `${selectedRequest.client.firstName} ${selectedRequest.client.lastName}`
    : "";

  const renderItem = ({ item }: { item: CookRequestItem }) => {
    const date = new Date(item.startDate).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const isPending = item.status === "pending";
    const isAccepted = item.status === "accepted";
    const canEditPrice =
      isAccepted && item.status !== "paid" && item.status !== "completed";

    return (
      <View style={styles.card} testID="cook-request-card">
        <View style={styles.cardHeader}>
          <Text style={styles.clientName}>
            {item.client.firstName} {item.client.lastName}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLOR[item.status] },
            ]}
          >
            <Text style={styles.statusText} testID="cook-request-status">
              {STATUS_LABEL[item.status]}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.detail}>{date}</Text>
          <Text style={styles.detail}>
            {item.guestsNumber} convive{item.guestsNumber > 1 ? "s" : ""}
          </Text>
        </View>

        {(item.street || item.city) && (
          <Text style={styles.address}>
            {[item.street, item.postalCode, item.city]
              .filter(Boolean)
              .join(", ")}
          </Text>
        )}

        {item.price != null && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Prix fixé</Text>
            <Text style={styles.priceValue}>
              {Number(item.price).toFixed(2)} €
            </Text>
          </View>
        )}

        {isPending && (
          <View style={styles.actions}>
            <View style={styles.actionBtn}>
              <Button
                title="Accepter"
                testID="accept-button"
                variant="primary"
                disabled={actionLoading !== null}
                onPress={() => openAcceptModal(item)}
              />
            </View>
            <View style={styles.actionBtn}>
              <Button
                title="Refuser"
                testID="refuse-button"
                variant="outline"
                disabled={actionLoading !== null}
                onPress={() => openRefuseModal(item)}
              />
            </View>
          </View>
        )}

        {canEditPrice && (
          <View style={styles.actions}>
            <View style={styles.actionBtn}>
              <Button
                title="Modifier le prix"
                variant="outline"
                disabled={actionLoading !== null}
                onPress={() => openEditPriceModal(item)}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  const emptyLabel =
    activeTab === "active"
      ? "Aucune proposition en cours"
      : activeTab === "completed"
        ? "Aucune prestation terminée"
        : "Aucune proposition refusée ou annulée";

  return (
    <ScreenBackground edges={["top"]}>
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>Mes propositions</Text>
            <View style={styles.tabs}>
              {TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    activeTab === tab.key && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab.key && styles.tabTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>{emptyLabel}</Text>
          </View>
        }
        onRefresh={refresh}
        refreshing={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={colors.main}
              style={styles.footerLoader}
            />
          ) : null
        }
      />

      <AcceptPriceModal
        visible={showAcceptModal}
        clientName={clientName}
        isLoading={actionLoading !== null}
        error={actionError}
        onCancel={closeModals}
        onConfirm={handleAcceptConfirm}
      />

      <AcceptPriceModal
        visible={showEditPriceModal}
        clientName={clientName}
        isLoading={actionLoading !== null}
        error={actionError}
        initialPrice={selectedRequest?.price}
        title="Modifier le prix"
        confirmLabel="Modifier"
        onCancel={closeModals}
        onConfirm={handleEditPriceConfirm}
      />

      <RefuseModal
        visible={showRefuseModal}
        clientName={clientName}
        isLoading={actionLoading !== null}
        error={actionError}
        onCancel={closeModals}
        onConfirm={handleRefuseConfirm}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    paddingBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    gap: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: colors.main,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  tabTextActive: {
    color: colors.white,
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
  clientName: {
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
  address: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
    marginTop: 6,
  },
  detail: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.main,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  errorText: {
    fontSize: 15,
    color: colors.mainDark,
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 16,
  },
});
