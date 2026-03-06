import { useState } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/features/auth/AuthContext";
import { useRegisterPushToken } from "@/features/notifications/useRegisterPushToken";
import { useNotificationHandler } from "@/features/notifications/useNotificationHandler";
import { AnimatedSplash } from "@/features/splash/AnimatedSplash";
import { useFonts } from "expo-font";
import {
  Alexandria_400Regular,
  Alexandria_700Bold,
  Alexandria_800ExtraBold,
} from "@expo-google-fonts/alexandria";
import {
  DancingScript_400Regular,
  DancingScript_700Bold,
} from "@expo-google-fonts/dancing-script";
import {
  Merriweather_300Light,
  Merriweather_400Regular,
  Merriweather_700Bold,
} from "@expo-google-fonts/merriweather";

function NotificationSetup() {
  useRegisterPushToken();
  useNotificationHandler();
  return null;
}

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);
  const [fontsLoaded] = useFonts({
    Alexandria_400Regular,
    Alexandria_700Bold,
    Alexandria_800ExtraBold,
    DancingScript_400Regular,
    DancingScript_700Bold,
    Merriweather_300Light,
    Merriweather_400Regular,
    Merriweather_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  if (!splashDone) {
    return (
      <SafeAreaProvider>
        <AnimatedSplash onFinish={() => setSplashDone(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <NotificationSetup />
        <Slot />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
