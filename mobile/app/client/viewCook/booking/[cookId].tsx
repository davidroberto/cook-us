import { useCookerProfile } from "@/features/client/cookerBooking/cookerProfile/useCookerProfile";
import { SendPropositionForm } from "@/features/client/cookerBooking/sendProposition/components/SendPropositionForm";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";

export default function BookingPage() {
  const { cookId } = useLocalSearchParams<{ cookId: string }>();
  const router = useRouter();
  const { state, retry } = useCookerProfile(cookId ?? "");

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Réserver</Text>
      <View style={styles.headerRight} />
    </View>
  );

  if (state.status === "loading") {
    return (
      <ScreenBackground>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.main} />
        </View>
      </ScreenBackground>
    );
  }

  if (state.status === "not_found") {
    return (
      <ScreenBackground>
        {header}
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Ce cuisinier est introuvable.</Text>
        </View>
      </ScreenBackground>
    );
  }

  if (state.status === "error") {
    return (
      <ScreenBackground>
        {header}
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Une erreur est survenue. Veuillez réessayer.
          </Text>
          <TouchableOpacity onPress={retry} style={styles.retryButton}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      {header}
      <SendPropositionForm
        cookId={cookId ?? ""}
        cookUserId={state.cook.userId}
        cookFirstName={state.cook.firstName}
        cookLastName={state.cook.lastName}
        cookSpeciality={state.cook.speciality}
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
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
