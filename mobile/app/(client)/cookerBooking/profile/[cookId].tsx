import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { useCookerProfile } from "../../../../features/cookerBooking/cookerProfile/useCookerProfile";

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
        {state.status === "loading" && <SkeletonProfile />}

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
          <CookerProfileCard
            cook={state.cook}
            onProposeCreneau={handleProposeCreneau}
          />
        )}
      </ScrollView>
    </View>
  );
}

// --- Sous-composants ---

type CookerProfileCardProps = {
  cook: {
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    description: string | null;
    speciality: string;
    hourlyRate: number | null;
  };
  onProposeCreneau: () => void;
};

function CookerProfileCard({ cook, onProposeCreneau }: CookerProfileCardProps) {
  const hourlyRateLabel =
    cook.hourlyRate != null ? `${cook.hourlyRate}€/h` : "Tarif sur demande";

  return (
    <View style={styles.profile}>
      <CookerAvatar
        photoUrl={cook.photoUrl}
        firstName={cook.firstName}
        lastName={cook.lastName}
      />
      <Text style={styles.name}>
        {cook.firstName} {cook.lastName}
      </Text>
      <Text style={styles.speciality}>{cook.speciality}</Text>
      <Text style={styles.rate}>{hourlyRateLabel}</Text>
      {cook.description ? (
        <Text style={styles.description}>{cook.description}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onProposeCreneau}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Proposer un créneau</Text>
      </TouchableOpacity>
    </View>
  );
}

function CookerAvatar({
  photoUrl,
  firstName,
  lastName,
}: {
  photoUrl: string | null;
  firstName: string;
  lastName: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (photoUrl && !hasError) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={styles.avatar}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <View style={[styles.avatar, styles.avatarFallback]}>
      <Text style={styles.avatarInitials}>
        {firstName[0]}
        {lastName[0]}
      </Text>
    </View>
  );
}

function SkeletonProfile() {
  return (
    <View style={styles.profile}>
      <SkeletonBox
        style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 16 }}
      />
      <SkeletonBox style={{ width: 180, height: 24, marginBottom: 8 }} />
      <SkeletonBox style={{ width: 120, height: 18, marginBottom: 8 }} />
      <SkeletonBox style={{ width: 80, height: 18, marginBottom: 16 }} />
      <SkeletonBox style={{ width: "100%", height: 72, marginBottom: 32 }} />
      <SkeletonBox style={{ width: 200, height: 48, borderRadius: 12 }} />
    </View>
  );
}

function SkeletonBox({ style }: { style: object }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ backgroundColor: "#e0e0e0", borderRadius: 4 }, style, { opacity }]}
    />
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6E7",
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
    backgroundColor: "#A82712",
    paddingVertical: 14,
    paddingHorizontal: 20,
    zIndex: 100,
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  notFoundText: {
    fontSize: 16,
    color: "#240E0D",
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  retryText: {
    fontSize: 15,
    color: "#240e0d",
  },
  profile: {
    alignItems: "center",
    paddingTop: 24,
    gap: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 8,
  },
  avatarFallback: {
    backgroundColor: "#d7553a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#240e0d",
  },
  speciality: {
    fontSize: 15,
    color: "#240E0D",
  },
  rate: {
    fontSize: 17,
    fontWeight: "600",
    color: "#d7553a",
  },
  description: {
    fontSize: 14,
    color: "#240E0D",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 320,
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: "#d7553a",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
