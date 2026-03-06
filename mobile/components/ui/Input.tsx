import { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";

interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function Input({ label, hint, error, required, style, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, isFocused && styles.labelFocused]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.text + "56"}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    ...typography.styles.body1Bold,
    color: colors.main,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 10,
    padding: 12,
    ...typography.styles.body1Regular,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.main,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.mainDark,
  },
  labelFocused: {
    color: colors.main,
  },
  required: {
    color: colors.main,
  },
  hint: {
    ...typography.styles.body2Regular,
    color: colors.text,
    opacity: colors.opacity[56],
    marginTop: 4,
  },
  error: {
    ...typography.styles.body2Regular,
    color: colors.mainDark,
    marginTop: 4,
  },
});
