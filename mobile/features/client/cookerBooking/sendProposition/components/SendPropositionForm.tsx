import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { MealType } from "../types";
import { useSendProposition } from "../useSendProposition";

const MEAL_TYPE_OPTIONS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Petit-déjeuner" },
  { value: "lunch", label: "Déjeuner" },
  { value: "dinner", label: "Dîner" },
];

function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

type Props = {
  cookId: string;
  cookUserId: number;
  cookFirstName: string;
  cookLastName: string;
  cookSpeciality: string;
};

export function SendPropositionForm({
  cookId,
  cookUserId,
  cookFirstName,
  cookLastName,
  cookSpeciality,
}: Props) {
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [startDate, setStartDate] = useState("");
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const { error, isLoading, sendProposition } = useSendProposition();

  const handleSubmit = async () => {
    const result = await sendProposition({
      cookId,
      cookUserId,
      numberOfGuests: parseInt(numberOfGuests, 10),
      startDate,
      mealType: mealType!,
      message,
    });

    if (result) {
      router.replace({
        pathname: "/client/messaging/[requestId]",
        params: {
          requestId: String(result.conversationId),
          cookFirstName,
          cookLastName,
          startDate,
          guestsNumber: numberOfGuests,
        },
      } as never);
    }
  };

  return (
    <ScrollView
      testID="send-proposition-form"
      contentContainerStyle={styles.container}
    >
      <View style={styles.cookerHeader}>
        <Text style={styles.cookerLabel}>Cuisinier sélectionné</Text>
        <Text testID="cook-name" style={styles.cookerName}>
          {cookFirstName} {cookLastName}
        </Text>
        <Text testID="cook-speciality" style={styles.cookerSpeciality}>
          {cookSpeciality}
        </Text>
      </View>

      <Text style={styles.title}>Envoyer une proposition</Text>

      <Input
        testID="number-of-guests-input"
        label="Nombre de convives"
        value={numberOfGuests}
        onChangeText={(text) => {
          if (/^\d*$/.test(text)) setNumberOfGuests(text);
        }}
        placeholder="Ex : 4"
        keyboardType="number-pad"
        maxLength={3}
      />

      <Input
        testID="start-date-input"
        label="Date de début"
        value={startDate}
        onChangeText={(text) => setStartDate(formatDateInput(text))}
        placeholder="JJMMAAAA"
        keyboardType="number-pad"
        maxLength={10}
      />

      <View style={styles.mealTypeContainer}>
        <Text style={styles.mealTypeLabel}>Type de repas</Text>
        <View style={styles.mealTypeOptions}>
          {MEAL_TYPE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              testID={`meal-type-${option.value}`}
              style={[
                styles.mealTypeOption,
                mealType === option.value && styles.mealTypeOptionSelected,
              ]}
              onPress={() => setMealType(option.value)}
            >
              <Text
                style={[
                  styles.mealTypeOptionText,
                  mealType === option.value &&
                    styles.mealTypeOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        testID="message-input"
        label="Message au cuisinier"
        value={message}
        onChangeText={setMessage}
        placeholder="Précisez vos attentes, allergies, préférences..."
        multiline
        numberOfLines={4}
        style={styles.messageInput}
      />

      <Button
        testID="submit-button"
        title="Envoyer la proposition"
        onPress={handleSubmit}
        loading={isLoading}
        accessibilityRole="button"
      />

      {error !== null && (
        <View testID="error-message" style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: colors.background,
  },
  cookerHeader: {
    backgroundColor: colors.tertiary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.main,
  },
  cookerLabel: {
    fontSize: 11,
    color: colors.mainDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: "600",
  },
  cookerName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  cookerSpeciality: {
    fontSize: 13,
    color: colors.main,
    marginTop: 2,
    fontWeight: "500",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.main,
    marginBottom: 24,
    textAlign: "center",
  },
  mealTypeContainer: {
    marginBottom: 20,
  },
  mealTypeLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.main,
    marginBottom: 8,
  },
  mealTypeOptions: {
    flexDirection: "row",
    gap: 10,
  },
  mealTypeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tertiary,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  mealTypeOptionSelected: {
    borderColor: colors.main,
    backgroundColor: colors.main,
    borderWidth: 2,
  },
  mealTypeOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  mealTypeOptionTextSelected: {
    color: colors.white,
    fontWeight: "700",
  },
  messageInput: {
    height: 100,
    textAlignVertical: "top",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.mainDark,
  },
  errorText: {
    color: colors.mainDark,
    fontSize: 14,
  },
});
