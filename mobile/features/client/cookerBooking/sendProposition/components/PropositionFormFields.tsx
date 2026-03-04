import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/styles/colors";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

function getTomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

type PropositionFormFieldsProps = {
  numberOfGuests: string;
  onNumberOfGuestsChange: (text: string) => void;
  startDate: string;
  onStartDateChange: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
};

export function PropositionFormFields({
  numberOfGuests,
  onNumberOfGuestsChange,
  startDate,
  onStartDateChange,
  onSubmit,
  isLoading,
  error,
}: PropositionFormFieldsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(getTomorrow());
  const [tempDate, setTempDate] = useState<Date>(getTomorrow());

  const handleDateChange = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && date) {
        setSelectedDate(date);
        onStartDateChange(formatDate(date));
      }
    } else if (date) {
      setTempDate(date);
    }
  };

  const handleConfirmIOS = () => {
    setSelectedDate(tempDate);
    onStartDateChange(formatDate(tempDate));
    setShowPicker(false);
  };

  const handleCancelIOS = () => {
    setTempDate(selectedDate);
    setShowPicker(false);
  };

  return (
    <View>
      <Text style={styles.title}>Envoyer une proposition</Text>

      <Input
        testID="number-of-guests-input"
        label="Nombre de convives"
        value={numberOfGuests}
        onChangeText={(text) => {
          if (/^\d*$/.test(text)) onNumberOfGuestsChange(text);
        }}
        placeholder="Ex : 4"
        keyboardType="number-pad"
        maxLength={3}
      />

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Date de début</Text>
        <Pressable
          testID="start-date-input"
          style={({ pressed }) => [
            styles.dateButton,
            pressed && styles.dateButtonPressed,
          ]}
          onPress={() => {
            if (!startDate) {
              onStartDateChange(formatDate(getTomorrow()));
            }
            setShowPicker(true);
          }}
        >
          <Text
            style={[styles.dateText, !startDate && styles.datePlaceholder]}
          >
            {startDate || "Sélectionner une date"}
          </Text>
        </Pressable>

        {showPicker && (
          <View>
            <DateTimePicker
              testID="date-picker"
              value={Platform.OS === "ios" ? tempDate : selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={getTomorrow()}
              locale="fr-FR"
              onChange={handleDateChange}
            />
            {Platform.OS === "ios" && (
              <View style={styles.pickerActions}>
                <Pressable onPress={handleCancelIOS} style={styles.pickerCancel}>
                  <Text style={styles.pickerCancelText}>Annuler</Text>
                </Pressable>
                <Pressable onPress={handleConfirmIOS} style={styles.pickerConfirm}>
                  <Text style={styles.pickerConfirmText}>Confirmer</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>

      <Button
        testID="submit-button"
        title="Envoyer la proposition"
        onPress={onSubmit}
        loading={isLoading}
        accessibilityRole="button"
      />

      {error !== null && (
        <View testID="error-message" style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.main,
    marginBottom: 24,
    textAlign: "center",
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontWeight: "700",
    color: colors.main,
    marginBottom: 8,
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tertiary,
    borderRadius: 10,
    padding: 12,
  },
  dateButtonPressed: {
    borderColor: colors.main,
    borderWidth: 2,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  datePlaceholder: {
    color: colors.text + "56",
  },
  pickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  pickerCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pickerCancelText: {
    fontSize: 16,
    color: colors.text + "80",
  },
  pickerConfirm: {
    backgroundColor: colors.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  pickerConfirmText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
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
});
