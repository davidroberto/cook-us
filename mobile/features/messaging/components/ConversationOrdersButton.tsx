import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useAuth } from "@/features/auth/AuthContext";
import { useConversationRequests } from "@/features/messaging/useConversationRequests";
import type { CookRequestSummary } from "@/features/messaging/useConversationRequests";
import {
  CookRequestCard,
  type CookRequestCardStatus,
} from "@/features/client/cookRequest/components/CookRequestCard";
import { AddressEditor } from "@/features/client/cookRequest/components/AddressEditor";
import { useRouter } from "expo-router";

const EDITABLE_STATUSES = ["pending", "accepted", "refused", "cancelled"];
const CANCELLABLE_STATUSES = ["pending", "accepted"];

function RequestItem({
  item,
  cookName,
  cookFirstName,
  cookLastName,
  isClient,
  token,
  onCancelSuccess,
  onAddressUpdated,
  onClose,
}: {
  item: CookRequestSummary;
  cookName?: string;
  cookFirstName?: string;
  cookLastName?: string;
  isClient: boolean;
  token: string | null;
  onCancelSuccess?: () => void;
  onAddressUpdated: () => void;
  onClose?: () => void;
}) {
  const router = useRouter();
  const canCancel = !!cookName && CANCELLABLE_STATUSES.includes(item.status);
  const canEditAddress = isClient && EDITABLE_STATUSES.includes(item.status);
  const showPriceAndAccept =
    isClient && item.status === "accepted" && item.price !== null;
  const address = item.street
    ? `${item.street}, ${item.postalCode} ${item.city}`
    : null;

  const handleAccept = () => {
    onClose?.();
    const total =
      Math.round((item.price! + item.price! * 0.3) * 100) / 100;
    router.push({
      pathname: "/client/viewCook/payment/[cookRequestId]",
      params: {
        cookRequestId: String(item.id),
        amount: String(total),
        cookFirstName: cookFirstName ?? "",
        cookLastName: cookLastName ?? "",
        startDate: item.startDate,
        endDate: item.endDate ?? "",
      },
    });
  };

  const commission = showPriceAndAccept
    ? Math.round(item.price! * 0.3 * 100) / 100
    : 0;
  const total = showPriceAndAccept
    ? Math.round((item.price! + commission) * 100) / 100
    : 0;

  return (
    <CookRequestCard
      id={item.id}
      startDate={item.startDate}
      status={item.status as CookRequestCardStatus}
      guestsNumber={item.guestsNumber}
      mealType={item.mealType}
      cookName={cookName}
      canCancel={canCancel}
      onCancelSuccess={onCancelSuccess}
      address={address}
      beforeCancel={
        showPriceAndAccept ? (
          <>
            <View style={styles.priceSeparator} />
            <Text style={styles.priceTitle}>Prix proposé</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Prix du cook</Text>
              <Text style={styles.priceValue}>{item.price!.toFixed(2)} €</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Commission (30%)</Text>
              <Text style={styles.priceValue}>{commission.toFixed(2)} €</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)} €</Text>
            </View>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}
            >
              <Text style={styles.acceptButtonText}>
                Accepter la prestation
              </Text>
            </TouchableOpacity>
          </>
        ) : undefined
      }
    >
      <AddressEditor
        id={item.id}
        street={item.street}
        postalCode={item.postalCode}
        city={item.city}
        token={token}
        canEdit={canEditAddress}
        onUpdated={onAddressUpdated}
      />
    </CookRequestCard>
  );
}

type Props = {
  conversationId: number;
  cookName?: string;
  cookFirstName?: string;
  cookLastName?: string;
  onClose?: () => void;
};

export function ConversationOrdersButton({
  conversationId,
  cookName,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(false);
  const { state, load } = useConversationRequests(conversationId);
  const { user, token } = useAuth();
  const isClient = user?.role === "client";

  const open = useCallback(() => {
    setVisible(true);
    load();
  }, [load]);

  const close = useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);

  return (
    <>
      <TouchableOpacity
        onPress={open}
        style={styles.button}
        testID="orders-button"
      >
        <Text style={styles.buttonText}>Commandes</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={close}
      >
        <SafeAreaView style={styles.modal}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Commandes</Text>
              <TouchableOpacity onPress={close} style={styles.closeButton}>
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
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.list}
              >
                {state.requests.map((item) => (
                  <RequestItem
                    key={String(item.id)}
                    item={item}
                    cookName={cookName}
                    isClient={isClient}
                    token={token}
                    onCancelSuccess={load}
                    onAddressUpdated={load}
                  />
                ))}
              </ScrollView>
            )}
          </KeyboardAvoidingView>
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
    padding: 16,
    paddingBottom: 32,
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
  priceSeparator: {
    height: 1,
    backgroundColor: colors.text,
    opacity: 0.1,
    marginVertical: 10,
  },
  priceTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.mainDark,
  },
  acceptButton: {
    backgroundColor: colors.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  acceptButtonText: {
    ...typography.styles.body1Bold,
    color: colors.white,
  },
});
