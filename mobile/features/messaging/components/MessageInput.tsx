import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Text, View } from "react-native";

type Props = {
  onSend: (content: string) => void;
};

export function MessageInput({ onSend }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View style={styles.container} testID="message-input-container">
      <TextInput
        testID="message-text-input"
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Écrire un message..."
        multiline
        maxLength={1000}
      />
      <TouchableOpacity
        testID="message-send-button"
        style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!text.trim()}
        accessibilityRole="button"
        accessibilityLabel="Envoyer"
      >
        <Text style={styles.sendButtonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 120,
    color: colors.text,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: colors.main,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonDisabled: {
    backgroundColor: colors.tertiary,
  },
  sendButtonText: {
    ...typography.styles.body2Bold,
    color: colors.white,
  },
});
