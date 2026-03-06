import { LoginForm } from "@/features/auth/login/components/LoginForm";
import { useAuth } from "@/features/auth/AuthContext";
import { useRouter } from "expo-router";
import { ScreenBackground } from "@/components/ui/ScreenBackground";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  return (
    <ScreenBackground>
      <LoginForm
        onSuccess={(response) => {
          setAuth(response.token, response.refreshToken, response.user);
          router.replace("/client/home");
        }}
        onNavigateRegister={() => router.push("/register")}
      />
    </ScreenBackground>
  );
}
