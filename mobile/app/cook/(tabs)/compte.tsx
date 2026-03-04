import { SafeAreaView, StyleSheet, Text } from "react-native";
import { colors } from "@/styles/colors";
import { CookProfileScreen } from "@/features/cook/account/CookProfileScreen";

export default function CookCompteTab() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mon compte</Text>
      <CookProfileScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
