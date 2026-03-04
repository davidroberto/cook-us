import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/colors";

export default function CookHomeTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.text}>Bientôt disponible</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: colors.text,
    opacity: 0.5,
  },
});
