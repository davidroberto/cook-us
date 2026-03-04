import { useCookerProfile } from "@/features/client/cookerBooking/cookerProfile/useCookerProfile";
import { SendPropositionForm } from "@/features/client/cookerBooking/sendProposition/components/SendPropositionForm";
import { colors } from "@/styles/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookingPage() {
  const { cookId } = useLocalSearchParams<{ cookId: string }>();
  const router = useRouter();
  const { state, retry } = useCookerProfile(cookId ?? "");

  if (state.status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  if (state.status === "not_found") {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>Ce cuisinier est introuvable.</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Une erreur est survenue. Veuillez réessayer.
        </Text>
        <TouchableOpacity onPress={retry} style={styles.retryButton}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SendPropositionForm
        cookId={cookId ?? ""}
        cookUserId={state.cook.userId}
        cookFirstName={state.cook.firstName}
        cookLastName={state.cook.lastName}
        cookSpeciality={state.cook.speciality}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
  errorText: {
    fontSize: 15,
    color: colors.mainDark,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  retryText: {
    fontSize: 15,
    color: colors.text,
  },
});
