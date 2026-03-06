import { LoginForm } from "@/features/auth/login/components/LoginForm";
import { useAuth } from "@/features/auth/AuthContext";
import { useGoogleAuth } from "@/features/auth/google/useGoogleAuth";
import { useRouter } from "expo-router";
import { ScreenBackground } from "@/components/ui/ScreenBackground";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth();

  const handleGooglePress = async () => {
    const result = await signInWithGoogle();

    if (result.type === "authenticated") {
      const { token, refreshToken, user } = result.response;
      setAuth(token, refreshToken, user);
      router.replace(user.role === "cook" ? "/cook" : "/client/home");
    } else if (result.type === "needsRegistration") {
      router.push({
        pathname: "/google-role-select",
        params: {
          idToken: result.idToken,
          email: result.googleUser.email,
          firstName: result.googleUser.firstName,
          lastName: result.googleUser.lastName,
          thumbnail: result.googleUser.thumbnail ?? "",
        },
      });
    }
  };

  return (
    <ScreenBackground>
      <LoginForm
        onSuccess={(response) => {
          setAuth(response.token, response.refreshToken, response.user);
          router.replace(
            response.user.role === "cook" ? "/cook" : "/client/home"
          );
        }}
        onNavigateRegister={() => router.push("/register")}
        onGooglePress={handleGooglePress}
        googleLoading={googleLoading}
      />
    </ScreenBackground>
  );
}
