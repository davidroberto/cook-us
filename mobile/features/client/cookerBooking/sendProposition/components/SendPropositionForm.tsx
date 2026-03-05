import { Card } from "@/components/ui/Card";
import { SPECIALITY_LABEL } from "@/features/client/cookerBooking/cookerList/components/Card";
import { useAuth } from "@/features/auth/AuthContext";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import type { MealType } from "../types";
import { useSendProposition } from "../useSendProposition";
import { PropositionFormFields } from "./PropositionFormFields";

type Props = {
  cookId: string;
  cookUserId: number;
  cookFirstName: string;
  cookLastName: string;
  cookSpeciality: string;
};

export function SendPropositionForm({
  cookId,
  cookUserId,
  cookFirstName,
  cookLastName,
  cookSpeciality,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [startDate, setStartDate] = useState("");
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [message, setMessage] = useState("");
  const [street, setStreet] = useState(user?.address?.street ?? "");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode ?? "");
  const [city, setCity] = useState(user?.address?.city ?? "");

  useEffect(() => {
    if (user?.address) {
      setStreet((prev) => prev || user.address!.street);
      setPostalCode((prev) => prev || user.address!.postalCode);
      setCity((prev) => prev || user.address!.city);
    }
  }, [user?.address]);
  const { error, isLoading, sendProposition } = useSendProposition();

  const handleSubmit = async () => {
    const result = await sendProposition({
      cookId,
      cookUserId,
      numberOfGuests: parseInt(numberOfGuests, 10),
      startDate,
      mealType: mealType!,
      message,
      street,
      postalCode,
      city,
    });

    if (result) {
      router.replace({
        pathname: "/client/messaging/[requestId]",
        params: {
          requestId: String(result.conversationId),
          cookFirstName,
          cookLastName,
          startDate,
          guestsNumber: numberOfGuests,
        },
      } as never);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView
      testID="send-proposition-form"
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={styles.cookerHeader}>
        <Text style={styles.cookerLabel}>Cuisinier sélectionné</Text>
        <Text testID="cook-name" style={styles.cookerName}>
          {cookFirstName} {cookLastName}
        </Text>
        <Text testID="cook-speciality" style={styles.cookerSpeciality}>
          {SPECIALITY_LABEL[cookSpeciality] ?? cookSpeciality}
        </Text>
      </Card>

      <PropositionFormFields
        numberOfGuests={numberOfGuests}
        onNumberOfGuestsChange={setNumberOfGuests}
        startDate={startDate}
        onStartDateChange={setStartDate}
        mealType={mealType}
        onMealTypeChange={setMealType}
        message={message}
        onMessageChange={setMessage}
        street={street}
        onStreetChange={setStreet}
        postalCode={postalCode}
        onPostalCodeChange={setPostalCode}
        city={city}
        onCityChange={setCity}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: colors.background,
  },
  cookerHeader: {
    backgroundColor: colors.tertiary,
    borderLeftWidth: 4,
    borderLeftColor: colors.main,
    marginBottom: 24,
  },
  cookerLabel: {
    fontSize: 11,
    color: colors.mainDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: "600",
  },
  cookerName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  cookerSpeciality: {
    fontSize: 13,
    color: colors.main,
    marginTop: 2,
    fontWeight: "500",
  },
});
