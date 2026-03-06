import { StyleSheet, Text } from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { colors } from "@/styles/colors";
import { ProfileScreen } from "@/features/client/account/viewProfile/components/ProfileScreen";

export default function CompteTab() {
  return (
    <ScreenBackground edges={["top"]}>
      <Text style={styles.title}>Mon compte</Text>
      <ProfileScreen />
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
