import { Slot } from "expo-router";
import { View, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
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
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Slot />
      </KeyboardAvoidingView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
