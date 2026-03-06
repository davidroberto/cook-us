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
  street?: string;
  postalCode?: string;
  city?: string;
  isSentByMe: boolean;
};

export function RequestSummaryCard({ startDate, guestsNumber, mealType, message, street, postalCode, city, isSentByMe }: Props) {
  return (
    <View style={styles.card} testID="request-summary-card">
      <Text style={styles.title}>{isSentByMe ? "Demande envoyée" : "Demande reçue"}</Text>
      <View style={styles.separator} />
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value} testID="request-date">{startDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Convives</Text>
          <Text style={styles.value} testID="request-guests">{guestsNumber}</Text>
        </View>
        {mealType && (
          <View style={styles.row}>
            <Text style={styles.label}>Repas</Text>
            <Text style={styles.value} testID="request-meal-type">{MEAL_TYPE_LABELS[mealType] ?? mealType}</Text>
          </View>
        )}
        {street && postalCode && city && (
          <View style={styles.row}>
            <Text style={styles.label}>Adresse</Text>
            <Text style={[styles.value, styles.addressValue]} testID="request-address">{street}, {postalCode} {city}</Text>
          </View>
        )}
      </View>
      {message && (
        <View style={styles.messageBlock}>
          <Text style={styles.label}>Message</Text>
          <Text style={styles.messageText} testID="request-message">{message}</Text>
        </View>
      )}
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
    opacity: colors.opacity[16],
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
    opacity: colors.opacity[56],
  },
  value: {
    ...typography.styles.body2Bold,
    color: colors.text,
  },
  addressValue: {
    flex: 1,
    textAlign: "right",
    flexShrink: 1,
    marginLeft: 8,
  },
  messageBlock: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(168, 39, 18, 0.16)",
    paddingTop: 10,
  },
  messageText: {
    ...typography.styles.body2Regular,
    color: colors.text,
    marginTop: 4,
  },
});
