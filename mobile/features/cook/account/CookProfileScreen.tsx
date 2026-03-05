import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useUpdateCookProfile } from "./useUpdateCookProfile";
import { changePassword } from "./repository";
import type { CookProfile } from "./repository";

const SPECIALITY_LABELS: Record<string, string> = {
  french_cooking: "Cuisine française",
  italian_cooking: "Cuisine italienne",
  asian_cooking: "Cuisine asiatique",
  mexican_cooking: "Cuisine mexicaine",
  vegetarian_cooking: "Cuisine végétarienne",
  pastry_cooking: "Pâtisserie",
  japanese_cooking: "Cuisine japonaise",
  indian_cooking: "Cuisine indienne",
  autre: "Autre",
};

const SPECIALITY_OPTIONS = Object.keys(SPECIALITY_LABELS);

export function CookProfileScreen() {
  const { user, token, clearAuth } = useAuth();
  const router = useRouter();
  const { isLoading, error, loadProfile, save, upload } =
    useUpdateCookProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<CookProfile | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdNotice, setPwdNotice] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [city, setCity] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    loadProfile().then((p) => {
      if (p) {
        setProfile(p);
        setDescription(p.description ?? "");
        setSpeciality(p.speciality ?? "");
        setHourlyRate(p.hourlyRate != null ? String(p.hourlyRate) : "");
        setCity(p.city ?? "");
        setPhotoUrl(p.photoUrl ?? null);
      }
    });
  }, []);

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

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    let finalPhotoUrl = photoUrl;

    if (photoUri) {
      const uploaded = await upload(photoUri);
      if (uploaded) {
        finalPhotoUrl = uploaded;
        setPhotoUrl(uploaded);
        setPhotoUri(null);
      }
    }

    const updated = await save({
      description: description || undefined,
      speciality: speciality || undefined,
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      city: city || undefined,
      photoUrl: finalPhotoUrl ?? undefined,
    });

    if (updated) {
      setProfile(updated);
      setIsEditing(false);
    }
  };

  const handleChangePassword = async () => {
    if (!token) return;
    setPwdError(null);
    setPwdNotice(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdError("Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword.length < 6) {
      setPwdError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setPwdLoading(true);
    try {
      await changePassword(token, { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPwdNotice("Mot de passe modifié.");
    } catch (e) {
      setPwdError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setDescription(profile.description ?? "");
      setSpeciality(profile.speciality ?? "");
      setHourlyRate(
        profile.hourlyRate != null ? String(profile.hourlyRate) : "",
      );
      setCity(profile.city ?? "");
      setPhotoUrl(profile.photoUrl ?? null);
      setPhotoUri(null);
    }
    setIsEditing(false);
  };

  if (!user) return null;

  const displayPhotoUri = photoUri ?? photoUrl ?? null;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.avatarContainer}>
        {isEditing ? (
          <TouchableOpacity
            onPress={handlePickPhoto}
            style={styles.avatarButton}
          >
            {displayPhotoUri ? (
              <Image
                source={{ uri: displayPhotoUri }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>
                  {user.firstName[0].toUpperCase()}
                  {user.lastName[0].toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.changePhotoText}>Changer la photo</Text>
          </TouchableOpacity>
        ) : (
          <>
            {displayPhotoUri ? (
              <Image
                source={{ uri: displayPhotoUri }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>
                  {user.firstName[0].toUpperCase()}
                  {user.lastName[0].toUpperCase()}
                </Text>
              </View>
            )}
          </>
        )}
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

        {isEditing ? (
          <>
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={styles.textarea}
              placeholder="Décrivez votre expérience..."
            />
            <Text style={styles.label}>Spécialité</Text>
            <View style={styles.chipsContainer}>
              {SPECIALITY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setSpeciality(opt)}
                  style={[
                    styles.chip,
                    speciality === opt && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      speciality === opt && styles.chipTextSelected,
                    ]}
                  >
                    {SPECIALITY_LABELS[opt]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Input
              label="Tarif horaire (€)"
              value={hourlyRate}
              onChangeText={setHourlyRate}
              keyboardType="numeric"
              placeholder="Ex : 25"
            />
            <Input
              label="Ville"
              value={city}
              onChangeText={setCity}
              placeholder="Ex : Paris"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.editActions}>
              <Button
                title="Enregistrer"
                onPress={handleSave}
                loading={isLoading}
                style={styles.saveButton}
              />
              <Button
                title="Annuler"
                variant="outline"
                onPress={handleCancel}
                disabled={isLoading}
                style={styles.cancelButton}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{profile?.description || "—"}</Text>
            <Text style={styles.label}>Spécialité</Text>
            <Text style={styles.value}>
              {profile?.speciality
                ? (SPECIALITY_LABELS[profile.speciality] ?? profile.speciality)
                : "—"}
            </Text>
            <Text style={styles.label}>Tarif horaire</Text>
            <Text style={styles.value}>
              {profile?.hourlyRate != null ? `${profile.hourlyRate} €/h` : "—"}
            </Text>
            <Text style={styles.label}>Ville</Text>
            <Text style={styles.value}>{profile?.city || "—"}</Text>
            <View style={styles.editButtonContainer}>
              <Button
                title="Modifier"
                variant="primary"
                onPress={() => setIsEditing(true)}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Changer de mot de passe</Text>
        <Input
          label="Mot de passe actuel"
          value={currentPassword}
          onChangeText={(v) => { setCurrentPassword(v); setPwdError(null); setPwdNotice(null); }}
          secureTextEntry
        />
        <Input
          label="Nouveau mot de passe"
          value={newPassword}
          onChangeText={(v) => { setNewPassword(v); setPwdError(null); setPwdNotice(null); }}
          secureTextEntry
          hint="6 caractères minimum"
        />
        <Input
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={(v) => { setConfirmPassword(v); setPwdError(null); setPwdNotice(null); }}
          secureTextEntry
          error={pwdError ?? undefined}
        />
        {pwdNotice && <Text style={styles.notice}>{pwdNotice}</Text>}
        <Button
          title="Modifier le mot de passe"
          variant="outline"
          onPress={handleChangePassword}
          loading={pwdLoading}
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
  avatarButton: {
    alignItems: "center",
    marginBottom: 4,
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
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.mainDark,
  },
  changePhotoText: {
    ...typography.styles.body2Regular,
    color: colors.main,
    marginBottom: 8,
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
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.tertiary,
    backgroundColor: colors.white,
  },
  chipSelected: {
    backgroundColor: colors.main,
    borderColor: colors.main,
  },
  chipText: {
    ...typography.styles.body2Regular,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.white,
  },
  editActions: {
    marginTop: 16,
    gap: 10,
  },
  saveButton: {
    width: "100%",
  },
  cancelButton: {
    width: "100%",
  },
  editButtonContainer: {
    marginTop: 16,
  },
  error: {
    ...typography.styles.body2Regular,
    color: colors.mainDark,
    marginTop: 8,
  },
  notice: {
    ...typography.styles.body2Regular,
    color: colors.mainDark,
    marginBottom: 12,
    textAlign: "center",
  },
  logoutSection: {
    marginTop: 8,
    marginBottom: 16,
  },
});
