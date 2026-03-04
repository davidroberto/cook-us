import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { StyleSheet, Text, View } from "react-native";

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Petit-déjeuner",
  lunch: "Déjeuner",
  dinner: "Dîner",
};

type Props = {
  startDate: string;
  guestsNumber: number;
  mealType?: string;
  message?: string;
  isSentByMe: boolean;
};

export function RequestSummaryCard({ startDate, guestsNumber, mealType, message, isSentByMe }: Props) {
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
      {mealType && (
        <View style={styles.row}>
          <Text style={styles.label}>Repas</Text>
          <Text style={styles.value}>{MEAL_TYPE_LABELS[mealType] ?? mealType}</Text>
        </View>
      )}
      {message && (
        <View style={styles.row}>
          <Text style={styles.label}>Message</Text>
          <Text style={[styles.value, styles.messageValue]}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    padding: 14,
    maxWidth: "75%",
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
  messageValue: {
    flexShrink: 1,
    textAlign: "right",
  },
});
