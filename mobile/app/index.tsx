import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/features/auth/AuthContext";

export default function Index() {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user?.role === "cook") {
    return <Redirect href="/cook" />;
  }

  return <Redirect href="/client" />;
}
