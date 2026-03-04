import { LoginForm } from "@/features/auth/login/components/LoginForm";
import { useAuth } from "@/features/auth/AuthContext";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <LoginForm
        onSuccess={(response) => {
          setAuth(response.token, response.refreshToken, response.user);
          router.replace("/client/home");
        }}
        onNavigateRegister={() => router.push("/register")}
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
