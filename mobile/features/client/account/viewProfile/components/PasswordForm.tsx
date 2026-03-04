import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/colors";
import { useAuth } from "@/features/auth/AuthContext";
import { changePassword } from "../repository";

export const PasswordForm = () => {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = async () => {
    if (!token) return;
    setError(null);
    setNotice(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(token, { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNotice("Mot de passe modifié.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Changer de mot de passe</Text>

      <Input
        label="Mot de passe actuel"
        value={currentPassword}
        onChangeText={(v) => {
          setCurrentPassword(v);
          setError(null);
          setNotice(null);
        }}
        secureTextEntry
        testID="password-current"
      />

      <Input
        label="Nouveau mot de passe"
        value={newPassword}
        onChangeText={(v) => {
          setNewPassword(v);
          setError(null);
          setNotice(null);
        }}
        secureTextEntry
        hint="6 caractères minimum"
        testID="password-new"
      />

      <Input
        label="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={(v) => {
          setConfirmPassword(v);
          setError(null);
          setNotice(null);
        }}
        secureTextEntry
        error={error ?? undefined}
        testID="password-confirm"
      />

      {notice && (
        <Text style={styles.notice} testID="password-notice">
          {notice}
        </Text>
      )}

      <Button
        title={isLoading ? "Modification..." : "Modifier le mot de passe"}
        variant="outline"
        onPress={handleSave}
        disabled={isLoading}
        testID="password-save-btn"
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
});
