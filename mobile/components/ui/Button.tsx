import { Pressable, StyleSheet, Text, type PressableProps } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  variant?: ButtonVariant;
}

export function Button({
  title,
  variant = "primary",
  style,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      style={(state: { pressed: boolean; hovered?: boolean }) => [
        styles.base,
        styles[variant],
        (state.pressed || state.hovered) && styles[`${variant}Pressed`],
        disabled && styles.disabled,
        typeof style === "function" ? undefined : style,
      ]}
      disabled={disabled}
      {...props}
    >
      {(state: { pressed: boolean; hovered?: boolean }) => {
        const isActive = state.pressed || state.hovered;
        return (
          <Text
            style={[
              styles.text,
              variant === "outline" && !isActive && styles.outlineText,
              variant === "secondary" && styles.secondaryText,
            ]}
          >
            {title}
          </Text>
        );
      }}
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
