import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useConversationRequests } from "@/features/messaging/useConversationRequests";
import type { CookRequestSummary } from "@/features/messaging/useConversationRequests";

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
  cancelled: "Annulée",
};

const STATUS_COLOR: Record<string, string> = {
  pending: colors.secondary,
  accepted: "#4CAF50",
  refused: colors.mainDark,
  cancelled: "#9E9E9E",
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  dinner: "Dîner",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RequestItem({ item }: { item: CookRequestSummary }) {
  const statusColor = STATUS_COLOR[item.status] ?? "#9E9E9E";
  const statusLabel = STATUS_LABEL[item.status] ?? item.status;
  return (
    <View style={styles.requestItem}>
      <View style={styles.requestRow}>
        <Text style={styles.requestDate}>{formatDate(item.startDate)}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{statusLabel}</Text>
        </View>
      </View>
      <Text style={styles.requestDetail}>
        {item.guestsNumber} convive{item.guestsNumber > 1 ? "s" : ""}
        {item.mealType
          ? ` · ${MEAL_TYPE_LABELS[item.mealType] ?? item.mealType}`
          : ""}
      </Text>
    </View>
  );
}

type Props = {
  conversationId: number;
};

export function ConversationOrdersButton({ conversationId }: Props) {
  const [visible, setVisible] = useState(false);
  const { state, load } = useConversationRequests(conversationId);

  const open = useCallback(() => {
    setVisible(true);
    load();
  }, [load]);

  return (
    <>
      <TouchableOpacity onPress={open} style={styles.button}>
        <Text style={styles.buttonText}>Commandes</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Commandes</Text>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Fermer</Text>
            </TouchableOpacity>
          </View>

          {state.status === "loading" && (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.main} />
            </View>
          )}

          {state.status === "error" && (
            <View style={styles.centered}>
              <Text style={styles.errorText}>
                Impossible de charger les commandes.
              </Text>
              <TouchableOpacity onPress={load} style={styles.retryButton}>
                <Text style={styles.retryText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          )}

          {state.status === "success" && state.requests.length === 0 && (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                Aucune commande pour l'instant.
              </Text>
            </View>
          )}

          {state.status === "success" && state.requests.length > 0 && (
            <FlatList
              data={state.requests}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <RequestItem item={item} />}
              contentContainerStyle={styles.list}
            />
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  buttonText: {
    ...typography.styles.body2Regular,
    color: colors.main,
  },
  modal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
  modalTitle: {
    ...typography.styles.body1Bold,
    color: colors.text,
  },
  closeButton: { padding: 4 },
  closeText: {
    ...typography.styles.body1Regular,
    color: colors.main,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  requestItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  requestDate: {
    ...typography.styles.body2Bold,
    color: colors.text,
  },
  requestDetail: {
    ...typography.styles.body2Regular,
    color: colors.text,
    opacity: 0.6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.white,
  },
  errorText: {
    ...typography.styles.body1Regular,
    color: colors.mainDark,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  retryText: {
    ...typography.styles.body1Regular,
    color: colors.text,
  },
  emptyText: {
    ...typography.styles.body1Regular,
    color: colors.text,
    opacity: 0.5,
    textAlign: "center",
  },
});
