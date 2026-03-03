import { colors } from "@/styles/colors";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSendProposition } from "../useSendProposition";

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
  const [date, setDate] = useState("");

  const { error, isLoading, isSuccess, sendProposition } = useSendProposition();

  const handleSubmit = async () => {
    await sendProposition({
      cookId,
      numberOfGuests: parseInt(numberOfGuests, 10),
      date,
      speciality: cookSpeciality,
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre de convives</Text>
        <TextInput
          testID="number-of-guests-input"
          style={styles.input}
          value={numberOfGuests}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setNumberOfGuests(text);
          }}
          placeholder="Ex : 4"
          keyboardType="number-pad"
          maxLength={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          testID="date-input"
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="JJ-MM-AAAA"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          autoCorrect={false}
        />
        <Text style={styles.hint}>Ex : 15-06-2026</Text>
      </View>

      <TouchableOpacity
        testID="submit-button"
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        accessibilityRole="button"
      >
        {isLoading ? (
          <ActivityIndicator testID="loading-indicator" color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Envoyer la proposition</Text>
        )}
      </TouchableOpacity>

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
    color: colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  hint: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.56,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.main,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.tertiary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
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
