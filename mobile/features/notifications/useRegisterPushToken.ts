import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useAuth } from "@/features/auth/AuthContext";
import { getApiUrl } from "@/features/api/getApiUrl";

const API_URL = getApiUrl();

async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Push notification permission not granted");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });
  return tokenData.data;
}

export function useRegisterPushToken() {
  const { token, user } = useAuth();
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!token || !user || registeredRef.current) return;

    getExpoPushToken().then(async (pushToken) => {
      if (!pushToken) return;

      try {
        const res = await fetch(`${API_URL}/auth/push-token`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ expoPushToken: pushToken }),
        });

        if (res.ok) {
          registeredRef.current = true;
          console.log("Push token registered:", pushToken);
        }
      } catch (err) {
        console.error("Failed to register push token:", err);
      }
    });
  }, [token, user]);
}
