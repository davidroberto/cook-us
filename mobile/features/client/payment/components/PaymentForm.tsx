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
import { usePayment } from "../usePayment";
import { OrderSummary } from "./OrderSummary";
import { PaymentSuccess } from "./PaymentSuccess";

type Props = {
  cookRequestId: string;
  amount: number;
  cookFirstName: string;
  cookLastName: string;
  startDate: string;
  endDate: string;
  onGoHome: () => void;
};

export function PaymentForm({
  cookRequestId: _cookRequestId,
  amount,
  cookFirstName,
  cookLastName,
  startDate,
  endDate,
  onGoHome,
}: Props) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const { state, pay } = usePayment();

  if (state.status === "success") {
    return <PaymentSuccess onGoHome={onGoHome} />;
  }

  const isLoading = state.status === "loading";

  const handleCardNumberChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleSubmit = () => {
    pay({ cardNumber, expiryDate, cvv });
  };

  return (
    <ScrollView
      testID="payment-form"
      contentContainerStyle={styles.container}
    >
      <OrderSummary
        amount={amount}
        cookFirstName={cookFirstName}
        cookLastName={cookLastName}
        startDate={startDate}
        endDate={endDate}
      />

      <Text style={styles.title}>Paiement par carte</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Numéro de carte</Text>
        <TextInput
          testID="card-number-input"
          style={styles.input}
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          placeholder="XXXX XXXX XXXX XXXX"
          keyboardType="number-pad"
          maxLength={19}
          autoCorrect={false}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.flex]}>
          <Text style={styles.label}>Expiration</Text>
          <TextInput
            testID="expiry-input"
            style={styles.input}
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="MM/AA"
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            autoCorrect={false}
          />
        </View>

        <View style={styles.spacer} />

        <View style={[styles.inputGroup, styles.flex]}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            testID="cvv-input"
            style={styles.input}
            value={cvv}
            onChangeText={(text) => {
              if (/^\d{0,3}$/.test(text)) setCvv(text);
            }}
            placeholder="123"
            keyboardType="number-pad"
            maxLength={3}
            secureTextEntry
            autoCorrect={false}
          />
        </View>
      </View>

      <TouchableOpacity
        testID="pay-button"
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        accessibilityRole="button"
      >
        {isLoading ? (
          <ActivityIndicator testID="loading-indicator" color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Valider le paiement</Text>
        )}
      </TouchableOpacity>

      {state.status === "error" && (
        <View testID="error-message" style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.message}</Text>
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
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  spacer: {
    width: 12,
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
});
