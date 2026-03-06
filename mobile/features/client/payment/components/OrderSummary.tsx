import { colors } from "@/styles/colors";
import { StyleSheet, Text, View } from "react-native";

const COMMISSION_RATE = 0.3;

type Props = {
  amount: number;
  cookFirstName: string;
  cookLastName: string;
  startDate: string;
  endDate: string;
};

export function OrderSummary({
  amount,
  cookFirstName,
  cookLastName,
  startDate,
  endDate,
}: Props) {
  const cookPrice = Math.round((amount / (1 + COMMISSION_RATE)) * 100) / 100;
  const commission = Math.round((amount - cookPrice) * 100) / 100;

  const formattedStart = startDate
    ? new Date(startDate).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const formattedEnd =
    endDate && endDate !== startDate
      ? new Date(endDate).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  return (
    <View testID="order-summary" style={styles.card}>
      <Text style={styles.title}>Récapitulatif</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Cuisinier</Text>
        <Text testID="order-cook" style={styles.value}>
          {cookFirstName} {cookLastName}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <Text testID="order-dates" style={styles.value}>
          {formattedEnd ? `${formattedStart} → ${formattedEnd}` : formattedStart}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.label}>Prix du cook</Text>
        <Text style={styles.value}>{cookPrice.toFixed(2)} €</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Commission (30%)</Text>
        <Text style={styles.value}>{commission.toFixed(2)} €</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text testID="order-amount" style={styles.totalValue}>
          {amount.toFixed(2)} €
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: colors.text,
    opacity: 0.1,
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
  },
  value: {
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
});
