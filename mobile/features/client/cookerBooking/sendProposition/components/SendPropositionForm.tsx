import { colors } from "@/styles/colors";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Input } from "@/components/ui/Input";
import { useSendProposition } from "../useSendProposition";
import { Button } from "@/components/ui/Button";

type Props = {
  cookId: string;
  cookFirstName: string;
  cookLastName: string;
  cookSpeciality: string;
};

export function SendPropositionForm({
  cookId,
  cookFirstName,
  cookLastName,
  cookSpeciality,
}: Props) {
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { error, isLoading, isSuccess, sendProposition } = useSendProposition();

  const handleSubmit = async () => {
    await sendProposition({
      cookId,
      numberOfGuests: parseInt(numberOfGuests, 10),
      startDate,
      endDate,
    });
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
        onChangeText={setStartDate}
        placeholder="JJ-MM-AAAA"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        autoCorrect={false}
        hint="Ex : 15-06-2026"
      />

      <Input
        testID="end-date-input"
        label="Date de fin"
        value={endDate}
        onChangeText={setEndDate}
        placeholder="JJ-MM-AAAA"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        autoCorrect={false}
        hint="Ex : 15-06-2026"
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

      {isSuccess && (
        <View testID="success-message" style={styles.successContainer}>
          <Text style={styles.successText}>
            Proposition envoyée avec succès !
          </Text>
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
  successContainer: {
    backgroundColor: "#E8F5E9",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  successText: {
    color: "#2E7D32",
    fontSize: 14,
  },
});
