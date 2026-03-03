import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSendProposition } from "../useSendProposition";

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

  const router = useRouter();
  const { error, isLoading, sendProposition } = useSendProposition();

  const handleSubmit = async () => {
    const result = await sendProposition({
      cookId,
      cookUserId,
      numberOfGuests: parseInt(numberOfGuests, 10),
      startDate,
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
