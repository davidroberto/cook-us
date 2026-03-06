import { StyleSheet, Text } from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { colors } from "@/styles/colors";
import { CookerList } from "../../../features/client/cookerBooking/cookerList";

const CookerBooking = () => {
  return (
    <ScreenBackground>
      <Text style={styles.title}>Trouver un cuisinier</Text>
      <CookerList />
    </ScreenBackground>
  );
};

export default CookerBooking;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
