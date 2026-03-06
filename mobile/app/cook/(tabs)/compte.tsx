import { StyleSheet, Text } from "react-native";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { colors } from "@/styles/colors";
import { CookProfileScreen } from "@/features/cook/account/CookProfileScreen";

export default function CookCompteTab() {
  return (
    <ScreenBackground edges={["top"]}>
      <Text style={styles.title}>Mon compte</Text>
      <CookProfileScreen />
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
