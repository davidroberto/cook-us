import { RegisterForm } from "@/features/auth/register/components/RegisterForm";
import { useAuth } from "@/features/auth/AuthContext";
import { useRouter } from "expo-router";
import { ScreenBackground } from "@/components/ui/ScreenBackground";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();

  return (
    <ScreenBackground>
      <RegisterForm
        onSuccess={(token, refreshToken, user) => {
          setAuth(token, refreshToken, user);
          router.replace("/client/home");
        }}
        onNavigateLogin={() => router.push("/login")}
      />
    </ScreenBackground>
  );
}
