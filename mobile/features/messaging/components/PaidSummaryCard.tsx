import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  total: number;
  isSentByMe: boolean;
};

export function PaidSummaryCard({ total, isSentByMe }: Props) {
  return (
    <View style={styles.card} testID="paid-summary-card">
      <Text style={styles.title}>
        {isSentByMe ? "Prestation payée" : "Prestation payée"}
      </Text>
      <View style={styles.separator} />
      <View style={styles.row}>
        <Text style={styles.label}>Total payé</Text>
        <Text style={styles.value}>{total.toFixed(2)} €</Text>
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
    ...typography.styles.body1Bold,
    color: colors.mainDark,
  },
});
