/**
 * Écran de profil complet assemblant les composants de la slice.
 * Réutilisé par la page Stack (viewProfile/profile.tsx) et l'onglet (tabs/compte.tsx).
 */

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useProfile } from "../useProfile";
import { PasswordForm } from "./PasswordForm";
import { ProfileForm } from "./ProfileForm";

export const ProfileScreen = () => {
  const { user } = useProfile();
  const { clearAuth } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: () => {
          clearAuth();
          router.replace("/login");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>
            {user.firstName[0].toUpperCase()}
            {user.lastName[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.userRole}>
          {user.role === "cook" ? "Cuisinier" : "Client"}
        </Text>
      </View>

      <View style={styles.section}>
        <ProfileForm user={user} />
      </View>

      <View style={styles.section}>
        <PasswordForm />
      </View>

      <View style={styles.historySection}>
        <Button
          title="Voir mon historique de réservations"
          variant="primary"
          onPress={() => router.push("/client/orderHistory")}
        />
      </View>

      <View style={styles.logoutSection}>
        <Button
          title="Se déconnecter"
          variant="outline"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.mainDark,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: colors.main,
    fontWeight: "500",
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: colors.opacity[8],
    shadowRadius: 4,
    elevation: 2,
  },
  historySection: {
    marginBottom: 16,
  },
  logoutSection: {
    marginTop: 8,
    marginBottom: 16,
  },
});
