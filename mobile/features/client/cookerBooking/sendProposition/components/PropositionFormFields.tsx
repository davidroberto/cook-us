import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/styles/colors";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { MealType } from "../types";

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

const MEAL_TYPE_OPTIONS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Petit-déjeuner" },
  { value: "lunch", label: "Déjeuner" },
  { value: "dinner", label: "Dîner" },
];

type PropositionFormFieldsProps = {
  numberOfGuests: string;
  onNumberOfGuestsChange: (text: string) => void;
  startDate: string;
  onStartDateChange: (text: string) => void;
  mealType: MealType | null;
  onMealTypeChange: (type: MealType) => void;
  message: string;
  onMessageChange: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
};

export function PropositionFormFields({
  numberOfGuests,
  onNumberOfGuestsChange,
  startDate,
  onStartDateChange,
  mealType,
  onMealTypeChange,
  message,
  onMessageChange,
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
      if (Platform.OS !== "ios") {
        setSelectedDate(date);
        onStartDateChange(formatDate(date));
        setShowPicker(false);
      }
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
        {Platform.OS === "web" ? (
          <Input
            testID="start-date-input"
            value={startDate}
            onChangeText={onStartDateChange}
            placeholder="JJ-MM-AAAA"
          />
        ) : (
          <>
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
          </>
        )}
      </View>

      <View style={styles.mealTypeContainer}>
        <Text style={styles.mealTypeLabel}>Type de repas</Text>
        <View style={styles.mealTypeOptions}>
          {MEAL_TYPE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              testID={`meal-type-${option.value}`}
              style={[
                styles.mealTypeOption,
                mealType === option.value && styles.mealTypeOptionSelected,
              ]}
              onPress={() => onMealTypeChange(option.value)}
            >
              <Text
                style={[
                  styles.mealTypeOptionText,
                  mealType === option.value &&
                    styles.mealTypeOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        testID="message-input"
        label="Message au cuisinier"
        value={message}
        onChangeText={onMessageChange}
        placeholder="Précisez vos attentes, allergies, préférences..."
        multiline
        numberOfLines={4}
        style={styles.messageInput}
      />

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
  mealTypeContainer: {
    marginBottom: 20,
  },
  mealTypeLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.main,
    marginBottom: 8,
  },
  mealTypeOptions: {
    flexDirection: "row",
    gap: 10,
  },
  mealTypeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tertiary,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  mealTypeOptionSelected: {
    borderColor: colors.main,
    backgroundColor: colors.main,
    borderWidth: 2,
  },
  mealTypeOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  mealTypeOptionTextSelected: {
    color: colors.white,
    fontWeight: "700",
  },
  messageInput: {
    height: 100,
    textAlignVertical: "top",
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
