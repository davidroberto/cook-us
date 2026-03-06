import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { StyleSheet, Text, View } from "react-native";

const COMMISSION_RATE = 0.3;

type Props = {
  price: number;
  isSentByMe: boolean;
};

export function AcceptSummaryCard({ price, isSentByMe }: Props) {
  const commission = Math.round(price * COMMISSION_RATE * 100) / 100;
  const total = Math.round((price + commission) * 100) / 100;

  return (
    <View style={styles.card} testID="accept-summary-card">
      <Text style={styles.title}>
        {isSentByMe ? "Prix fixé" : "Prix proposé"}
      </Text>
      <View style={styles.separator} />
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>Prix du cook</Text>
          <Text style={styles.value}>{price.toFixed(2)} €</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Commission (30%)</Text>
          <Text style={styles.value}>{commission.toFixed(2)} €</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total client</Text>
        <Text style={styles.totalValue}>{total.toFixed(2)} €</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    padding: 16,
    width: "75%",
  },
  title: {
    ...typography.styles.body1Bold,
    color: colors.mainDark,
  },
  separator: {
    height: 1,
    backgroundColor: colors.mainDark,
    opacity: 0.16,
    marginVertical: 10,
  },
  details: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    ...typography.styles.body2Regular,
    color: colors.text,
    opacity: 0.56,
  },
  value: {
    ...typography.styles.body2Bold,
    color: colors.text,
  },
  totalLabel: {
    ...typography.styles.body1Bold,
    color: colors.text,
  },
  totalValue: {
    ...typography.styles.body1Bold,
    color: colors.mainDark,
  },
});
