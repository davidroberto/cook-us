import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

type PendingImage = { uri: string; mimeType?: string; fileName?: string };

type Props = {
  onSend: (content: string) => void;
  onSendImage?: (uri: string, mimeType?: string, fileName?: string, caption?: string) => void;
  bottomInset?: number;
};

export function MessageInput({ onSend, onSendImage, bottomInset = 0 }: Props) {
  const [text, setText] = useState("");
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);

  const canSend = !!pendingImage || !!text.trim();

  const handleSend = () => {
    const trimmed = text.trim();
    if (pendingImage && onSendImage) {
      onSendImage(pendingImage.uri, pendingImage.mimeType, pendingImage.fileName, trimmed || undefined);
      setPendingImage(null);
      setText("");
    } else if (trimmed) {
      onSend(trimmed);
      setText("");
    }
  };

  const pickFromSource = async (source: "camera" | "library") => {
    if (source === "camera") {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission refusée", "L'accès à l'appareil photo est nécessaire.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: "images", quality: 0.5 });
      if (!result.canceled) {
        const asset = result.assets[0];
        setPendingImage({ uri: asset.uri, mimeType: asset.mimeType ?? undefined, fileName: asset.fileName ?? undefined });
      }
    } else {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission refusée", "L'accès à la galerie est nécessaire.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: "images", quality: 0.7 });
      if (!result.canceled) {
        const asset = result.assets[0];
        setPendingImage({ uri: asset.uri, mimeType: asset.mimeType ?? undefined, fileName: asset.fileName ?? undefined });
      }
    }
  };

  const handlePickImage = () => {
    Alert.alert("Envoyer une image", undefined, [
      { text: "Prendre une photo", onPress: () => pickFromSource("camera") },
      { text: "Choisir dans la galerie", onPress: () => pickFromSource("library") },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  return (
    <View style={[styles.container, { paddingBottom: 10 + bottomInset }]} testID="message-input-container">
      {pendingImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: pendingImage.uri }} style={styles.previewImage} resizeMode="cover" />
          <TouchableOpacity style={styles.removeButton} onPress={() => setPendingImage(null)}>
            <Ionicons name="close-circle" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputRow}>
        {onSendImage && (
          <TouchableOpacity
            testID="message-image-button"
            style={styles.imageButton}
            onPress={handlePickImage}
            accessibilityRole="button"
            accessibilityLabel="Envoyer une image"
          >
            <Ionicons name="camera-outline" size={24} color={pendingImage ? colors.main : colors.main} />
          </TouchableOpacity>
        )}
        <TextInput
          testID="message-text-input"
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={pendingImage ? "Ajouter une légende..." : "Écrire un message..."}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          testID="message-send-button"
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Envoyer"
        >
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  previewContainer: {
    marginBottom: 8,
    alignSelf: "flex-start",
    position: "relative",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 11,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
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
