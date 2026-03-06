import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { colors, typography } from "@/styles";
import {
  ProfileCard,
  ProfileSkeleton,
  useCookerProfile,
} from "@/features/client/cookerBooking/cookerProfile";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";

export default function CookerProfilePage() {
  const { cookId } = useLocalSearchParams<{ cookId: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const { state, retry } = useCookerProfile(cookId ?? "");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (state.status !== "error") return;
    setToastVisible(true);
    const timer = setTimeout(() => setToastVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [state.status]);

  const handleProposeCreneau = () => {
    if (!token) {
      router.push("/login");
      return;
    }
    router.push(`/client/viewCook/booking/${cookId}`);
  };

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil du cuisinier</Text>
        <View style={styles.headerRight} />
      </View>
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
            <Button
              title="Retour à la liste"
              variant="outline"
              onPress={() => router.push("/client/home")}
            />
          </View>
        )}
        {state.status === "success" && (
          <ProfileCard
            cook={state.cook}
            onProposeCreneau={handleProposeCreneau}
          />
        )}
      </ScrollView>
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
