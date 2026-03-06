import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/features/auth/AuthContext";
import {
  useGoogleAuth,
  type CookProfile,
} from "@/features/auth/google/useGoogleAuth";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { colors } from "@/styles/colors";
import {
  COOK_SPECIALITIES,
  type CookSpeciality,
} from "@/features/auth/register/types";

export default function GoogleRoleSelectPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const params = useLocalSearchParams<{
    idToken: string;
    email: string;
    firstName: string;
    lastName: string;
    thumbnail: string;
  }>();

  const { completeGoogleRegistration, isLoading, error } = useGoogleAuth();

  const [role, setRole] = useState<"client" | "cook">("client");
  const [speciality, setSpeciality] = useState<CookSpeciality | null>(null);
  const [siret, setSiret] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const handleSubmit = async () => {
    let cookProfile: CookProfile | undefined;
    if (role === "cook" && speciality) {
      cookProfile = {
        speciality,
        siret,
        city: city.trim(),
        description: description.trim() || undefined,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      };
    }

    const result = await completeGoogleRegistration(
      params.idToken,
      role,
      cookProfile
    );

    if (result.type === "authenticated") {
      const { token, refreshToken, user } = result.response;
      setAuth(token, refreshToken, user);
      router.replace(user.role === "cook" ? "/cook" : "/client/home");
    }
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Bienvenue !</Text>
          <Text style={styles.subtitle}>
            Bonjour {params.firstName}, choisissez votre profil
          </Text>

          {params.thumbnail ? (
            <Image
              source={{ uri: params.thumbnail }}
              style={styles.avatar}
            />
          ) : null}

          <Text style={styles.emailLabel}>{params.email}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Je suis un… <Text style={styles.required}>*</Text>
            </Text>
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
                <Text style={styles.label}>
                  Spécialité <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.specialityGrid}>
                  {COOK_SPECIALITIES.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      testID={`speciality-${item.value}`}
                      style={[
                        styles.specialityChip,
                        speciality === item.value &&
                          styles.specialityChipSelected,
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
                <Text style={styles.label}>
                  SIRET <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  testID="siret-input"
                  style={styles.input}
                  value={siret}
                  onChangeText={setSiret}
                  placeholder="14 chiffres"
                  keyboardType="numeric"
                  maxLength={14}
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Ville <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  testID="cook-city-input"
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Paris"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
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
                <Text style={styles.label}>
                  Tarif horaire en € (optionnel)
                </Text>
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
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Créer mon compte</Text>
            )}
          </TouchableOpacity>

          {error !== null && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 12,
  },
  emailLabel: {
    textAlign: "center",
    color: colors.text,
    opacity: 0.56,
    marginBottom: 24,
    fontSize: 14,
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
  required: {
    color: colors.main,
  },
});
