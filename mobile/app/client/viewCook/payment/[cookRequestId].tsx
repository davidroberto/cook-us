import { PaymentForm } from "@/features/client/payment/components/PaymentForm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.container}>
      <PaymentForm
        cookRequestId={cookRequestId ?? ""}
        amount={parseFloat(amount ?? "0")}
        cookFirstName={cookFirstName ?? ""}
        cookLastName={cookLastName ?? ""}
        startDate={startDate ?? ""}
        endDate={endDate ?? ""}
        onGoHome={() => router.replace("/client")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
