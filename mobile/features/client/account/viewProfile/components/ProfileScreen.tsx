/**
 * Écran de profil complet assemblant les composants de la slice.
 * Réutilisé par la page Stack (viewProfile/profile.tsx) et l'onglet (tabs/compte.tsx).
 */

import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/colors";
import { useProfile } from "../useProfile";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";
import { OrderHistoryList } from "./OrderHistoryList";

export const ProfileScreen = () => {
  const { user } = useProfile();

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

      <View style={styles.section}>
        <OrderHistoryList />
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
});
