import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/colors";
import { Button } from "@/components/ui/Button";
import type { CookRequestSummary } from "@/features/messaging/useConversationRequests";

type Props = {
  request: CookRequestSummary;
  cookFirstName: string;
  cookLastName: string;
};

export function ClientPayBanner({ request, cookFirstName, cookLastName }: Props) {
  const router = useRouter();

  if (request.status !== "accepted" || request.totalPrice == null) return null;

  const commission = request.price != null
    ? parseFloat((request.totalPrice - request.price).toFixed(2))
    : null;

  const handlePay = () => {
    router.push({
      pathname: `/client/viewCook/payment/${request.id}`,
      params: {
        amount: String(request.totalPrice),
        cookFirstName,
        cookLastName,
        startDate: request.startDate,
        endDate: request.endDate ?? "",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proposition acceptée ✓</Text>
      {request.price != null && (
        <Text style={styles.line}>
          Prix du cuisinier : {request.price} €
        </Text>
      )}
      {commission != null && (
        <Text style={styles.line}>
          Commission app (10%) : {commission} €
        </Text>
      )}
      <Text style={styles.total}>Total à payer : {request.totalPrice} €</Text>
      <View style={styles.buttonWrapper}>
        <Button title="Payer" variant="primary" onPress={handlePay} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.tertiary,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 12,
    padding: 16,
    margin: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  line: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  total: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginTop: 6,
    marginBottom: 12,
  },
  buttonWrapper: {
    alignSelf: "stretch",
  },
});
