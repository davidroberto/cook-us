import { colors } from "@/styles/colors";
import { StyleSheet, Text, View } from "react-native";

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
  return (
    <View testID="order-summary" style={styles.container}>
      <Text style={styles.label}>Récapitulatif de la prestation</Text>
      <View style={styles.row}>
        <Text style={styles.key}>Montant</Text>
        <Text testID="order-amount" style={styles.value}>
          {amount} €
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.key}>Cuisinier</Text>
        <Text testID="order-cook" style={styles.value}>
          {cookFirstName} {cookLastName}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.key}>Dates</Text>
        <Text testID="order-dates" style={styles.value}>
          {startDate === endDate ? startDate : `${startDate} → ${endDate}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.tertiary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.main,
  },
  label: {
    fontSize: 11,
    color: colors.mainDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  key: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
});
