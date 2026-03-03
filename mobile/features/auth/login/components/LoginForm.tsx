import { colors } from "@/styles/colors";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogin } from "../useLogin";
import type { AuthResponse } from "../types";

type Props = {
  onSuccess: (response: AuthResponse) => void;
  onNavigateRegister: () => void;
};

export function LoginForm({ onSuccess, onNavigateRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, isLoading, login } = useLogin();

  const handleSubmit = async () => {
    const result = await login({ email, password });
    if (result) onSuccess(result);
  };

  return (
    <ScrollView testID="login-form" contentContainerStyle={styles.container}>
      <Text style={styles.title}>Connexion</Text>

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
      </View>

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
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>

      {error !== null && (
        <View testID="error-message" style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        testID="navigate-register"
        onPress={onNavigateRegister}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Pas encore de compte ? S'inscrire</Text>
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
    marginBottom: 32,
    textAlign: "center",
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
