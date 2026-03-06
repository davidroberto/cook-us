import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/styles/colors";

type Props = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export function GoogleSignInButton({
  label,
  onPress,
  isLoading,
  disabled,
}: Props) {
  return (
    <TouchableOpacity
      testID="google-signin-button"
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <View style={styles.content}>
          <Image
            source={require("@/assets/images/google-logo.png")}
            style={styles.googleLogo}
          />
          <Text style={styles.buttonText}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  googleLogo: {
    width: 20,
    height: 20,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
