import { StyleSheet, Text } from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { colors } from "@/styles/colors";
import { CookerList } from "@/features/client/cookerBooking/cookerList";

export default function HomeTab() {
  return (
    <ScreenBackground edges={["top"]}>
      <Text style={styles.title}>Trouver un cuisinier</Text>
      <CookerList />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
