import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  loading = false,
  style,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles[`${variant}Pressed`],
        (disabled || loading) && styles.disabled,
        typeof style === "function" ? undefined : style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {({ pressed }) =>
        loading ? (
          <ActivityIndicator testID="loading-indicator" color={colors.white} />
        ) : (
          <Text
            style={[
              styles.text,
              variant === "outline" && !pressed && styles.outlineText,
              variant === "secondary" && styles.secondaryText,
            ]}
          >
            {title}
          </Text>
        )
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.main,
  },
  primaryPressed: {
    backgroundColor: colors.mainDark,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  secondaryPressed: {
    backgroundColor: colors.tertiary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.main,
  },
  outlinePressed: {
    backgroundColor: colors.main,
  },
  disabled: {
    opacity: colors.opacity[40],
  },
  text: {
    ...typography.styles.cta,
    color: colors.white,
  },
outlineText: {
    color: colors.main,
  },
  secondaryText: {
    color: colors.text,
  },
});
