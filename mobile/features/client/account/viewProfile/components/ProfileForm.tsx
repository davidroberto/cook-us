/**
 * Formulaire d'affichage et de modification des coordonnées utilisateur.
 *
 * Note backend : Aucun endpoint PATCH /users/me n'est disponible.
 * La sauvegarde affiche un message d'information en attendant l'implémentation.
 */

import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/colors";
import type { ProfileUser } from "../types";

interface ProfileFormProps {
  user: ProfileUser;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = () => {
    // Pas d'endpoint backend disponible pour la mise à jour du profil.
    setNotice("La modification du profil n'est pas encore disponible.");
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Mes informations</Text>

      <Input
        label="Prénom"
        value={firstName}
        onChangeText={(v) => {
          setFirstName(v);
          setNotice(null);
        }}
        autoCapitalize="words"
        testID="profile-firstname"
      />

      <Input
        label="Nom de famille"
        value={lastName}
        onChangeText={(v) => {
          setLastName(v);
          setNotice(null);
        }}
        autoCapitalize="words"
        testID="profile-lastname"
      />

      <Input
        label="Adresse mail"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setNotice(null);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        testID="profile-email"
      />

      {notice && (
        <Text style={styles.notice} testID="profile-notice">
          {notice}
        </Text>
      )}

      <Button
        title="Enregistrer"
        onPress={handleSave}
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
});
