import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/colors";

export default function MessagesTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>À venir...</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text,
    opacity: 0.5,
    marginTop: 8,
  },
});
