import { useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import type { AuthResponse, LoginCommand } from "./types";

import { getApiUrl } from "@/features/api/getApiUrl";

const isExpoGo = Constants.appOwnership === "expo";
const isAndroidExpoGo = Platform.OS === "android" && isExpoGo;

const API_URL = getApiUrl();

async function getExpoPushToken(): Promise<string | undefined> {
  if (!Device.isDevice || isAndroidExpoGo) return undefined;

  const Notifications = require("expo-notifications") as typeof import("expo-notifications");

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return undefined;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch {
    return undefined;
  }
}

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (command: LoginCommand): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const expoPushToken = await getExpoPushToken();

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...command, expoPushToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message ?? "Identifiants invalides."
        );
      }

      return (await response.json()) as AuthResponse;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inattendue est survenue."
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, login };
}
