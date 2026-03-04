import { Stack, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/features/auth/AuthContext";
import { colors } from "@/styles/colors";

export default function CookLayout() {
  const { token, user, isReady } = useAuth();

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/login" />;
  }

  if (user?.role !== "cook") {
    return <Redirect href="/client" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.main,
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="messaging/[conversationId]" options={{ headerShown: false }} />
    </Stack>
  );
}
