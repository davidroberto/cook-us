import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

type Props = {
  onSend: (content: string) => void;
  onSendImage?: (uri: string, mimeType?: string, fileName?: string) => void;
  bottomInset?: number;
};

export function MessageInput({ onSend, onSendImage, bottomInset = 0 }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const handlePickImage = () => {
    Alert.alert("Envoyer une image", undefined, [
      {
        text: "Prendre une photo",
        onPress: async () => {
          const { granted } = await ImagePicker.requestCameraPermissionsAsync();
          if (!granted) {
            Alert.alert("Permission refusée", "L'accès à l'appareil photo est nécessaire.");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            quality: 0.5,
          });
          if (!result.canceled && onSendImage) {
            const asset = result.assets[0];
            onSendImage(asset.uri, asset.mimeType ?? undefined, asset.fileName ?? undefined);
          }
        },
      },
      {
        text: "Choisir dans la galerie",
        onPress: async () => {
          const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!granted) {
            Alert.alert("Permission refusée", "L'accès à la galerie est nécessaire.");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 0.7,
          });
          if (!result.canceled && onSendImage) {
            const asset = result.assets[0];
            onSendImage(asset.uri, asset.mimeType ?? undefined, asset.fileName ?? undefined);
          }
        },
      },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  return (
    <View style={[styles.container, { paddingBottom: 10 + bottomInset }]} testID="message-input-container">
      {onSendImage && (
        <TouchableOpacity
          testID="message-image-button"
          style={styles.imageButton}
          onPress={handlePickImage}
          accessibilityRole="button"
          accessibilityLabel="Envoyer une image"
        >
          <Ionicons name="camera-outline" size={24} color={colors.main} />
        </TouchableOpacity>
      )}
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
  },
  imageButton: {
    padding: 6,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
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
