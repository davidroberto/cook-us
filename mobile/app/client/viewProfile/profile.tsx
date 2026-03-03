import { SafeAreaView, StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import { ProfileScreen } from "@/features/client/account/viewProfile/components/ProfileScreen";

export default function ProfilePage() {
  return (
    <SafeAreaView style={styles.container}>
      <ProfileScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
