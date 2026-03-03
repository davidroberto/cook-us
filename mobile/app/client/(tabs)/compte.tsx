import { SafeAreaView, StyleSheet, Text } from "react-native";
import { colors } from "@/styles/colors";
import { ProfileScreen } from "@/features/client/account/viewProfile/components/ProfileScreen";

export default function CompteTab() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mon compte</Text>
      <ProfileScreen />
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
