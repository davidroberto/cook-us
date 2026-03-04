import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  startDate: string;
  guestsNumber: number;
  isSentByMe: boolean;
};

export function RequestSummaryCard({ startDate, guestsNumber, isSentByMe }: Props) {
  return (
    <View style={styles.card} testID="request-summary-card">
      <Text style={styles.title}>{isSentByMe ? "Demande envoyée" : "Demande reçue"}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{startDate}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Convives</Text>
        <Text style={styles.value}>{guestsNumber}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    padding: 14,
    maxWidth: "78%",
  },
  title: {
    ...typography.styles.body2Bold,
    color: colors.mainDark,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  label: {
    ...typography.styles.body2Regular,
    color: colors.text,
    opacity: colors.opacity[56],
  },
  value: {
    ...typography.styles.body2Bold,
    color: colors.text,
  },
});
