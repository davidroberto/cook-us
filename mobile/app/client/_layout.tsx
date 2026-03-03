import { Slot, Redirect } from "expo-router";
import { useAuth } from "@/features/auth/AuthContext";

export default function ClientLayout() {
  const { token } = useAuth();

  if (!token) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}
