import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors } from "@/styles/colors";
import { CancelBookingModal } from "./CancelBookingModal";
import { useCancelBooking } from "../useCancelBooking";

type Props = {
  requestId: number;
  cookName: string;
  onSuccess: () => void;
};

export function CancelBookingButton({ requestId, cookName, onSuccess }: Props) {
  const [visible, setVisible] = useState(false);

  const { cancelBooking, isLoading, error, clearError } = useCancelBooking(
    () => {
      setVisible(false);
      onSuccess();
    }
  );

  const handlePress = () => {
    clearError();
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <Button
        testID={`cancel-button-${requestId}`}
        title="Annuler la réservation"
        variant="outline"
        onPress={handlePress}
        style={styles.button}
      />
      <CancelBookingModal
        visible={visible}
        cookName={cookName}
        isLoading={isLoading}
        error={error}
        onCancel={() => setVisible(false)}
        onConfirm={(reason) => cancelBooking(requestId, reason)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  button: {
    borderColor: colors.mainDark,
  },
});
