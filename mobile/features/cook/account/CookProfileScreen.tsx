import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";

export function CookProfileScreen() {
  const { user, clearAuth } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
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

  if (!user) return null;

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
        <Text style={styles.userRole}>Cuisinier</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations du compte</Text>
        <Text style={styles.label}>Prénom</Text>
        <Text style={styles.value}>{user.firstName}</Text>
        <Text style={styles.label}>Nom</Text>
        <Text style={styles.value}>{user.lastName}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations cuisinier</Text>
        <Text style={styles.label}>SIRET</Text>
        <Text style={styles.value}>{user.siret ?? "—"}</Text>
      </View>

      <View style={styles.logoutSection}>
        <Button title="Se déconnecter" variant="outline" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  sectionTitle: {
    ...typography.styles.body1Bold,
    color: colors.text,
    marginBottom: 12,
  },
  label: {
    ...typography.styles.body2Regular,
    color: colors.text,
    opacity: 0.6,
    marginTop: 8,
  },
  value: {
    ...typography.styles.body1Regular,
    color: colors.text,
    marginTop: 2,
  },
  notice: {
    ...typography.styles.body2Regular,
    color: colors.text,
    opacity: 0.6,
    fontStyle: "italic",
  },
  logoutSection: {
    marginTop: 8,
    marginBottom: 16,
  },
});
