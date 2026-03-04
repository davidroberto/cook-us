import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/styles/colors";

type Props = {
  visible: boolean;
  cookName: string;
  isLoading: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

const CANCEL_REASONS = [
  "Changement de plans",
  "Problème de disponibilité",
  "Raison personnelle",
];

export function CancelBookingModal({
  visible,
  cookName,
  isLoading,
  error,
  onCancel,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const currentReason = selectedPreset ?? reason;
  const canSubmit = currentReason.trim().length > 0;

  const handleSelectPreset = (preset: string) => {
    setSelectedPreset(preset === selectedPreset ? null : preset);
    if (preset !== selectedPreset) setReason("");
  };

  const handleCustomReasonChange = (text: string) => {
    setReason(text);
    setSelectedPreset(null);
  };

  const handleConfirm = () => {
    if (canSubmit) onConfirm(currentReason.trim());
  };

  const handleClose = () => {
    setReason("");
    setSelectedPreset(null);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Annuler la réservation</Text>
          <Text style={styles.subtitle}>
            Réservation avec {cookName}
          </Text>

          <Text style={styles.label}>Motif d'annulation</Text>

          <View style={styles.presets}>
            {CANCEL_REASONS.map((preset) => (
              <Pressable
                key={preset}
                testID={`reason-preset-${preset}`}
                style={[
                  styles.preset,
                  selectedPreset === preset && styles.presetSelected,
                ]}
                onPress={() => handleSelectPreset(preset)}
              >
                <Text
                  style={[
                    styles.presetText,
                    selectedPreset === preset && styles.presetTextSelected,
                  ]}
                >
                  {preset}
                </Text>
              </Pressable>
            ))}
          </View>

          <Input
            testID="cancel-reason-input"
            label="Ou précisez votre motif"
            value={reason}
            onChangeText={handleCustomReasonChange}
            placeholder="Décrivez la raison de l'annulation..."
            multiline
            numberOfLines={3}
            style={styles.reasonInput}
          />

          {error !== null && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.actions}>
            <Button
              testID="cancel-modal-back"
              title="Retour"
              variant="outline"
              onPress={handleClose}
              disabled={isLoading}
              style={styles.actionButton}
            />
            <Button
              testID="cancel-modal-confirm"
              title="Confirmer"
              onPress={handleConfirm}
              loading={isLoading}
              disabled={!canSubmit}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.mainDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.main,
    marginBottom: 10,
  },
  presets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  preset: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.tertiary,
    backgroundColor: colors.white,
  },
  presetSelected: {
    borderColor: colors.main,
    backgroundColor: colors.main,
  },
  presetText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text,
  },
  presetTextSelected: {
    color: colors.white,
    fontWeight: "700",
  },
  reasonInput: {
    height: 80,
    textAlignVertical: "top",
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.mainDark,
  },
  errorText: {
    color: colors.mainDark,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
