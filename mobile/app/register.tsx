import { RegisterForm } from "@/features/auth/register/components/RegisterForm";
import { useAuth } from "@/features/auth/AuthContext";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";

export default function RegisterPage() {
  const router = useRouter();
  const { setToken } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <RegisterForm
        onSuccess={(token) => {
          setToken(token);
          router.replace("/client");
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
