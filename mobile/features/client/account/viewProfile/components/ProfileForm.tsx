import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/colors";
import { useAuth } from "@/features/auth/AuthContext";
import { updateProfile } from "../repository";
import type { ProfileUser } from "../types";

interface ProfileFormProps {
  user: ProfileUser;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const { token, setAuth } = useAuth();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSave = async () => {
    if (!token) return;
    setIsLoading(true);
    setNotice(null);
    try {
      const updatedUser = await updateProfile(token, { firstName, lastName, email });
      setAuth(token, updatedUser);
      setNotice({ text: "Profil mis à jour.", isError: false });
    } catch (e) {
      setNotice({ text: e instanceof Error ? e.message : "Erreur réseau", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Mes informations</Text>

      <Input
        label="Prénom"
        value={firstName}
        onChangeText={(v) => { setFirstName(v); setNotice(null); }}
        autoCapitalize="words"
        testID="profile-firstname"
      />

      <Input
        label="Nom de famille"
        value={lastName}
        onChangeText={(v) => { setLastName(v); setNotice(null); }}
        autoCapitalize="words"
        testID="profile-lastname"
      />

      <Input
        label="Adresse mail"
        value={email}
        onChangeText={(v) => { setEmail(v); setNotice(null); }}
        keyboardType="email-address"
        autoCapitalize="none"
        testID="profile-email"
      />

      {notice && (
        <Text
          style={[styles.notice, notice.isError && styles.noticeError]}
          testID="profile-notice"
        >
          {notice.text}
        </Text>
      )}

      <Button
        title={isLoading ? "Enregistrement..." : "Enregistrer"}
        onPress={handleSave}
        disabled={isLoading}
        testID="profile-save-btn"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  notice: {
    fontSize: 13,
    color: colors.mainDark,
    marginBottom: 12,
    textAlign: "center",
  },
  noticeError: {
    color: colors.error ?? "#e53e3e",
  },
});
