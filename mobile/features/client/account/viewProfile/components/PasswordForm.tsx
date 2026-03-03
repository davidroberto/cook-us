/**
 * Formulaire de changement de mot de passe.
 *
 * Note backend : Aucun endpoint POST /auth/change-password n'est disponible.
 * La validation client-side est implémentée, mais la sauvegarde affiche
 * un message d'information en attendant l'implémentation serveur.
 */

import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/colors";

export const PasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = () => {
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

    // Pas d'endpoint backend disponible pour le changement de mot de passe.
    setNotice("La modification du mot de passe n'est pas encore disponible.");
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
        title="Modifier le mot de passe"
        variant="outline"
        onPress={handleSave}
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
