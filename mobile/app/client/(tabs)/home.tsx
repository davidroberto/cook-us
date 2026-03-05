import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/colors";
import { CookerList } from "@/features/client/cookerBooking/cookerList";

export default function HomeTab() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Trouver un cuisinier</Text>
      <CookerList />
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
