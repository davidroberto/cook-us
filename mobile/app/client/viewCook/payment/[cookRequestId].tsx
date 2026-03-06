import { PaymentForm } from "@/features/client/payment/components/PaymentForm";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";

export default function PaymentPage() {
  const router = useRouter();
  const {
    cookRequestId,
    amount,
    cookFirstName,
    cookLastName,
    startDate,
    endDate,
  } = useLocalSearchParams<{
    cookRequestId: string;
    amount: string;
    cookFirstName: string;
    cookLastName: string;
    startDate: string;
    endDate: string;
  }>();

  return (
    <ScreenBackground edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement de la prestation</Text>
        <View style={styles.headerRight} />
      </View>
      <PaymentForm
        cookRequestId={cookRequestId ?? ""}
        amount={parseFloat(amount ?? "0")}
        cookFirstName={cookFirstName ?? ""}
        cookLastName={cookLastName ?? ""}
        startDate={startDate ?? ""}
        endDate={endDate ?? ""}
        onGoBack={() => router.back()}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
  backButton: { padding: 4 },
  backText: {
    ...typography.styles.body1Regular,
    color: colors.main,
  },
  headerTitle: {
    ...typography.styles.body1Bold,
    color: colors.text,
  },
  headerRight: { width: 60 },
});
