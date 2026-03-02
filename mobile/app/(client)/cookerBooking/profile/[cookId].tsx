import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, typography } from "@/styles";
import {
  ProfileCard,
  ProfileSkeleton,
  useCookerProfile,
} from "@/features/client/cookerBooking/cookerProfile";

// TODO: remplacer par le vrai contexte d'authentification
const isAuthenticated = false;

export default function CookerProfilePage() {
  const { cookId } = useLocalSearchParams<{ cookId: string }>();
  const router = useRouter();
  const { state, retry } = useCookerProfile(cookId ?? "");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (state.status !== "error") return;
    setToastVisible(true);
    const timer = setTimeout(() => setToastVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [state.status]);

  const handleProposeCreneau = () => {
    if (!isAuthenticated) {
      // TODO: passer le redirect en param pour revenir après connexion
      router.push("/login");
      return;
    }
    // TODO: naviguer vers le module de proposition de créneau
    router.push(`/cookerBooking/${cookId}/booking` as never);
  };

  return (
    <View style={styles.container}>
      {toastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>
            Une erreur est survenue. Veuillez réessayer.
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        {state.status === "loading" && <ProfileSkeleton />}

        {state.status === "not_found" && (
          <View style={styles.centered}>
            <Text style={styles.notFoundText}>
              Ce cuisinier est introuvable.
            </Text>
          </View>
        )}

        {state.status === "error" && (
          <View style={styles.centered}>
            <TouchableOpacity onPress={retry} style={styles.retryButton}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {state.status === "success" && (
          <ProfileCard
            cook={state.cook}
            onProposeCreneau={handleProposeCreneau}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
  },
  toast: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.mainDark,
    paddingVertical: 14,
    paddingHorizontal: 20,
    zIndex: 100,
  },
  toastText: {
    ...typography.styles.body2Bold,
    color: colors.white,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  notFoundText: {
    ...typography.styles.body1Regular,
    color: colors.text,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.text,
    opacity: colors.opacity[24],
  },
  retryText: {
    ...typography.styles.body1Regular,
    color: colors.text,
  },
});
