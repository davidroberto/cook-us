import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useAuth } from "@/features/auth/AuthContext";
import { getApiUrl } from "@/features/api/getApiUrl";
import { useConversationRequests } from "@/features/messaging/useConversationRequests";
import type { CookRequestSummary } from "@/features/messaging/useConversationRequests";
import { CancelBookingButton } from "@/features/client/cancelBooking/components/CancelBookingButton";

const EDITABLE_STATUSES = ["pending", "accepted", "refused", "cancelled"];

async function updateRequestAddress(
  token: string,
  requestId: number,
  address: { street: string; postalCode: string; city: string }
): Promise<void> {
  const res = await fetch(`${getApiUrl()}/cook-request/${requestId}/address`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Erreur réseau");
  }
}

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

const CANCELLABLE_STATUSES = ["pending", "accepted"];

function RequestItem({
  item,
  cookName,
  isClient,
  token,
  onCancelSuccess,
  onAddressUpdated,
}: {
  item: CookRequestSummary;
  cookName?: string;
  isClient: boolean;
  token: string | null;
  onCancelSuccess?: () => void;
  onAddressUpdated: () => void;
}) {
  const statusColor = STATUS_COLOR[item.status] ?? "#9E9E9E";
  const statusLabel = STATUS_LABEL[item.status] ?? item.status;
  const canCancel = !!cookName && CANCELLABLE_STATUSES.includes(item.status);
  const canEditAddress = isClient && EDITABLE_STATUSES.includes(item.status);

  const [editing, setEditing] = useState(false);
  const [street, setStreet] = useState(item.street ?? "");
  const [postalCode, setPostalCode] = useState(item.postalCode ?? "");
  const [city, setCity] = useState(item.city ?? "");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!street.trim() || !postalCode.trim() || !city.trim()) {
      setEditError("Tous les champs sont requis.");
      return;
    }
    if (!token) return;
    setSaving(true);
    setEditError(null);
    try {
      await updateRequestAddress(token, item.id, {
        street: street.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
      });
      setEditing(false);
      onAddressUpdated();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  const address = item.street
    ? `${item.street}, ${item.postalCode} ${item.city}`
    : null;

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
      {address && !editing && (
        <Text style={styles.requestAddress}>{address}</Text>
      )}
      {canCancel && (
        <CancelBookingButton
          requestId={item.id}
          cookName={cookName!}
          onSuccess={onCancelSuccess ?? (() => {})}
        />
      )}
      {editing && (
        <View style={styles.editForm}>
          <TextInput
            style={styles.editInput}
            value={street}
            onChangeText={setStreet}
            placeholder="Rue"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
          <TextInput
            style={styles.editInput}
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="Code postal"
            keyboardType="numeric"
            autoCorrect={false}
          />
          <TextInput
            style={styles.editInput}
            value={city}
            onChangeText={setCity}
            placeholder="Ville"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {editError && <Text style={styles.editError}>{editError}</Text>}
          <View style={styles.editActions}>
            <TouchableOpacity
              onPress={() => { setEditing(false); setEditError(null); }}
              style={styles.editCancel}
              disabled={saving}
            >
              <Text style={styles.editCancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.editSave, saving && styles.editSaveDisabled]}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.editSaveText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

type Props = {
  conversationId: number;
  cookName?: string;
};

export function ConversationOrdersButton({ conversationId, cookName }: Props) {
  const [visible, setVisible] = useState(false);
  const { state, load } = useConversationRequests(conversationId);
  const { user, token } = useAuth();
  const isClient = user?.role === "client";

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
              renderItem={({ item }) => (
                <RequestItem
                  item={item}
                  cookName={cookName}
                  onCancelSuccess={load}
                  isClient={isClient}
                  token={token}
                  onAddressUpdated={load}
                />
              )}
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
  requestAddress: {
    ...typography.styles.body2Regular,
    color: colors.text,
    opacity: 0.6,
    marginTop: 4,
  },
  editForm: {
    marginTop: 8,
    gap: 6,
  },
  editInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
  },
  editError: {
    fontSize: 12,
    color: colors.mainDark,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 4,
  },
  editCancel: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  editCancelText: {
    ...typography.styles.body2Regular,
    color: colors.text,
  },
  editSave: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.main,
  },
  editSaveDisabled: {
    opacity: 0.6,
  },
  editSaveText: {
    ...typography.styles.body2Bold,
    color: colors.white,
  },
});
