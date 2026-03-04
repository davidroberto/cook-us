import { Stack, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/features/auth/AuthContext";
import { colors } from "@/styles/colors";

export default function ClientLayout() {
  const { token, isReady } = useAuth();

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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="viewCook/profile/[cookId]"
        options={{ title: "Profil du cuisinier" }}
      />
      <Stack.Screen
        name="viewCook/booking/[cookId]"
        options={{ title: "Réserver" }}
      />
      <Stack.Screen
        name="viewProfile/profile"
        options={{ title: "Mon profil" }}
      />
      <Stack.Screen
        name="messaging/[requestId]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
