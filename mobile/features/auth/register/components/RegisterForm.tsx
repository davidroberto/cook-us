import { colors } from "@/styles/colors";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COOK_SPECIALITIES, type CookSpeciality } from "../types";
import { useRegister } from "../useRegister";

type Props = {
  onSuccess: (token: string) => void;
  onNavigateLogin: () => void;
};

export function RegisterForm({ onSuccess, onNavigateLogin }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "cook">("client");
  const [speciality, setSpeciality] = useState<CookSpeciality | null>(null);
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  const { error, isLoading, register } = useRegister();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setThumbnailUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const result = await register({
      firstName,
      lastName,
      email,
      password,
      role,
      thumbnail: thumbnailUri ?? undefined,
      ...(role === "cook" && speciality
        ? {
            cookProfile: {
              speciality,
              description: description.trim() || undefined,
              hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
            },
          }
        : {}),
    });
    if (result) onSuccess(result.token);
  };

  return (
    <ScrollView testID="register-form" contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      {/* Photo de profil */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          testID="avatar-picker"
          style={styles.avatarButton}
          onPress={pickImage}
          accessibilityRole="button"
        >
          {thumbnailUri ? (
            <Image
              testID="avatar-preview"
              source={{ uri: thumbnailUri }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>+</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.avatarLabel}>Photo de profil (optionnel)</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Prénom</Text>
        <TextInput
          testID="firstname-input"
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Jean"
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          testID="lastname-input"
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Dupont"
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          testID="email-input"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="jean@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          testID="password-input"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••"
          secureTextEntry
        />
        <Text style={styles.hint}>6 caractères minimum</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Je suis un…</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            testID="role-client"
            style={styles.radioOption}
            onPress={() => setRole("client")}
            accessibilityRole="radio"
            accessibilityState={{ checked: role === "client" }}
          >
            <View
              style={[
                styles.radioCircle,
                role === "client" && styles.radioCircleSelected,
              ]}
            >
              {role === "client" && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Client</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="role-cook"
            style={styles.radioOption}
            onPress={() => setRole("cook")}
            accessibilityRole="radio"
            accessibilityState={{ checked: role === "cook" }}
          >
            <View
              style={[
                styles.radioCircle,
                role === "cook" && styles.radioCircleSelected,
              ]}
            >
              {role === "cook" && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Cuisinier</Text>
          </TouchableOpacity>
        </View>
      </View>

      {role === "cook" && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Spécialité</Text>
            <View style={styles.specialityGrid}>
              {COOK_SPECIALITIES.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  testID={`speciality-${item.value}`}
                  style={[
                    styles.specialityChip,
                    speciality === item.value && styles.specialityChipSelected,
                  ]}
                  onPress={() => setSpeciality(item.value)}
                >
                  <Text
                    style={[
                      styles.specialityChipText,
                      speciality === item.value &&
                        styles.specialityChipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (optionnel)</Text>
            <TextInput
              testID="description-input"
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Parlez de votre expérience, vos spécialités…"
              multiline
              numberOfLines={4}
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tarif horaire en € (optionnel)</Text>
            <TextInput
              testID="hourly-rate-input"
              style={styles.input}
              value={hourlyRate}
              onChangeText={(text) => {
                if (/^\d*\.?\d{0,2}$/.test(text)) setHourlyRate(text);
              }}
              placeholder="Ex : 25"
              keyboardType="decimal-pad"
              autoCorrect={false}
            />
          </View>
        </>
      )}

      <TouchableOpacity
        testID="submit-button"
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        accessibilityRole="button"
      >
        {isLoading ? (
          <ActivityIndicator testID="loading-indicator" color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Créer mon compte</Text>
        )}
      </TouchableOpacity>

      {error !== null && (
        <View testID="error-message" style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        testID="navigate-login"
        onPress={onNavigateLogin}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarButton: {
    marginBottom: 8,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.main,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.tertiary,
    borderWidth: 2,
    borderColor: colors.main,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 32,
    color: colors.main,
    lineHeight: 36,
  },
  avatarLabel: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  hint: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.56,
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 24,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: colors.main,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.main,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.text,
  },
  specialityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.tertiary,
    backgroundColor: colors.white,
  },
  specialityChipSelected: {
    backgroundColor: colors.main,
    borderColor: colors.main,
  },
  specialityChipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
  },
  specialityChipTextSelected: {
    color: colors.white,
  },
  button: {
    backgroundColor: colors.main,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.tertiary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.mainDark,
  },
  errorText: {
    color: colors.mainDark,
    fontSize: 14,
  },
  linkButton: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: {
    color: colors.main,
    fontSize: 14,
    fontWeight: "600",
  },
});
