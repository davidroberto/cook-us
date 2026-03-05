/**
 * Écran de profil complet assemblant les composants de la slice.
 * Réutilisé par la page Stack (viewProfile/profile.tsx) et l'onglet (tabs/compte.tsx).
 */

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/auth/AuthContext";
import { colors } from "@/styles/colors";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile } from "../useProfile";
import { PasswordForm } from "./PasswordForm";
import { ProfileForm } from "./ProfileForm";
import { uploadProfileThumbnail, updateProfile } from "../repository";
import { getApiUrl } from "@/features/api/getApiUrl";

function toAbsoluteUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${getApiUrl().replace(/\/api$/, "")}${url}`;
}

export const ProfileScreen = () => {
  const { user, token, updateUser, clearAuth } = useAuth();
  const { user: profileUser } = useProfile();
  const router = useRouter();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const [addressOpen, setAddressOpen] = useState(false);
  const [street, setStreet] = useState(user?.address?.street ?? "");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode ?? "");
  const [city, setCity] = useState(user?.address?.city ?? "");
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressNotice, setAddressNotice] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSaveAddress = async () => {
    if (!token) return;
    if (!street.trim() || !postalCode.trim() || !city.trim()) {
      setAddressNotice({ text: "Tous les champs sont requis.", isError: true });
      return;
    }
    setAddressSaving(true);
    setAddressNotice(null);
    try {
      const updated = await updateProfile(token, {
        street: street.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
      });
      updateUser(updated);
      setAddressNotice({ text: "Adresse enregistrée.", isError: false });
    } catch (e) {
      setAddressNotice({ text: e instanceof Error ? e.message : "Erreur réseau", isError: true });
    } finally {
      setAddressSaving(false);
    }
  };

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !token) return;

    setIsUploadingPhoto(true);
    try {
      const url = await uploadProfileThumbnail(result.assets[0].uri);
      const updatedUser = await updateProfile(token, { thumbnail: url });
      updateUser(updatedUser);
      setThumbnailError(false);
    } catch {
      Alert.alert("Erreur", "Impossible de mettre à jour la photo de profil.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
        clearAuth();
        router.replace("/login");
      }
      return;
    }

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

  if (!profileUser) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  const showThumbnail = !!user?.thumbnail && !thumbnailError;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={handlePickPhoto}
          disabled={isUploadingPhoto}
          style={styles.avatarWrapper}
          testID="avatar-picker"
        >
          {showThumbnail ? (
            <Image
              source={{ uri: toAbsoluteUrl(user!.thumbnail!) }}
              style={styles.avatarImage}
              onError={() => setThumbnailError(true)}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>
                {profileUser.firstName[0].toUpperCase()}
                {profileUser.lastName[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.avatarEditBadge}>
            {isUploadingPhoto ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Ionicons name="camera" size={14} color={colors.white} />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>
          {profileUser.firstName} {profileUser.lastName}
        </Text>
        <Text style={styles.userRole}>
          {profileUser.role === "cook" ? "Cuisinier" : "Client"}
        </Text>
      </View>

      <View style={styles.section}>
        <ProfileForm user={profileUser} />
      </View>

      {user?.role === "client" && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.accordionHeader}
            testID="accordion-address-header"
            onPress={() => {
              setAddressOpen((v) => !v);
              setAddressNotice(null);
            }}
          >
            <Text style={styles.accordionTitle}>Mon adresse</Text>
            <Ionicons
              name={addressOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.main}
            />
          </TouchableOpacity>

          {addressOpen && (
            <View style={styles.accordionBody}>
              <Input
                label="Rue"
                value={street}
                onChangeText={(v) => { setStreet(v); setAddressNotice(null); }}
                placeholder="12 rue de la Paix"
                autoCapitalize="sentences"
                autoCorrect={false}
                testID="accordion-address-street"
              />
              <Input
                label="Code postal"
                value={postalCode}
                onChangeText={(v) => { setPostalCode(v); setAddressNotice(null); }}
                placeholder="75001"
                keyboardType="numeric"
                autoCorrect={false}
                testID="accordion-address-postalcode"
              />
              <Input
                label="Ville"
                value={city}
                onChangeText={(v) => { setCity(v); setAddressNotice(null); }}
                placeholder="Paris"
                autoCapitalize="words"
                autoCorrect={false}
                testID="accordion-address-city"
              />
              {addressNotice && (
                <Text testID="accordion-address-notice" style={[styles.addressNotice, addressNotice.isError && styles.addressNoticeError]}>
                  {addressNotice.text}
                </Text>
              )}
              <Button
                title={addressSaving ? "Enregistrement..." : "Enregistrer l'adresse"}
                onPress={handleSaveAddress}
                disabled={addressSaving}
                testID="accordion-address-save"
              />
            </View>
          )}
        </View>
      )}

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
    </KeyboardAvoidingView>
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
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.mainDark,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.main,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
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
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  accordionBody: {
    marginTop: 16,
    gap: 4,
  },
  addressNotice: {
    fontSize: 13,
    color: colors.main,
    marginBottom: 8,
    textAlign: "center",
  },
  addressNoticeError: {
    color: colors.mainDark,
  },
  historySection: {
    marginBottom: 16,
  },
  logoutSection: {
    marginTop: 8,
    marginBottom: 16,
  },
});
