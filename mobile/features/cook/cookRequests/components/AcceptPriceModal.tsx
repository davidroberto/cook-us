import { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/styles/colors";

const COMMISSION_RATE = 0.3;

type Props = {
  visible: boolean;
  clientName: string;
  isLoading: boolean;
  error: string | null;
  initialPrice?: number | null;
  title?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: (price: number) => void;
};

export function AcceptPriceModal({
  visible,
  clientName,
  isLoading,
  error,
  initialPrice,
  title = "Accepter",
  confirmLabel = "Accepter",
  onCancel,
  onConfirm,
}: Props) {
  const [priceText, setPriceText] = useState(
    initialPrice ? String(initialPrice) : "",
  );

  const price = parseFloat(priceText);
  const isValidPrice = !isNaN(price) && price > 0;
  const commission = isValidPrice
    ? Math.round(price * COMMISSION_RATE * 100) / 100
    : 0;
  const total = isValidPrice ? Math.round((price + commission) * 100) / 100 : 0;

  const handleClose = () => {
    setPriceText(initialPrice ? String(initialPrice) : "");
    onCancel();
  };

  const handleConfirm = () => {
    if (isValidPrice) onConfirm(price);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Proposition de {clientName}</Text>

          <Input
            label="Prix de la prestation (€)"
            required
            value={priceText}
            onChangeText={setPriceText}
            placeholder="Ex : 150"
            keyboardType="numeric"
          />

          {isValidPrice && (
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Votre prix</Text>
                <Text style={styles.summaryValue}>{price.toFixed(2)} €</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Commission (30%)</Text>
                <Text style={styles.summaryValue}>
                  {commission.toFixed(2)} €
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Total client</Text>
                <Text style={styles.summaryTotalValue}>
                  {total.toFixed(2)} €
                </Text>
              </View>
            </View>
          )}

          {error !== null && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.actions}>
            <Button
              title="Annuler"
              variant="outline"
              onPress={handleClose}
              disabled={isLoading}
              style={styles.actionButton}
            />
            <Button
              title={confirmLabel}
              onPress={handleConfirm}
              loading={isLoading}
              disabled={!isValidPrice}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 20,
  },
  summary: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.tertiary,
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  summaryTotalValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.main,
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.mainDark,
  },
  errorText: {
    color: colors.mainDark,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
