import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/features/auth/AuthContext";
import { useFonts } from "expo-font";
import {
  Alexandria_400Regular,
  Alexandria_700Bold,
} from "@expo-google-fonts/alexandria";
import {
  DancingScript_400Regular,
} from "@expo-google-fonts/dancing-script";
import {
  Merriweather_300Light,
  Merriweather_400Regular,
  Merriweather_700Bold,
} from "@expo-google-fonts/merriweather";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Alexandria_400Regular,
    Alexandria_700Bold,
    DancingScript_400Regular,
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

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
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
