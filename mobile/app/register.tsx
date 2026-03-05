import { RegisterForm } from "@/features/auth/register/components/RegisterForm";
import { useAuth } from "@/features/auth/AuthContext";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <RegisterForm
        onSuccess={(token, refreshToken, user) => {
          setAuth(token, refreshToken, user);
          router.replace("/client/home");
        }}
        onNavigateLogin={() => router.push("/login")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
