import { useEffect } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { useAuth } from "@/features/auth/AuthContext";

const isExpoGo = Constants.appOwnership === "expo";
const isAndroidExpoGo = Platform.OS === "android" && isExpoGo;

let Notifications: typeof import("expo-notifications") | null = null;

if (!isAndroidExpoGo) {
  Notifications = require("expo-notifications") as typeof import("expo-notifications");
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export function useNotificationHandler() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!Notifications) return;

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        const conversationId = data?.conversationId;

        if (!conversationId || !user) return;

        if (user.role === "cook") {
          router.push(`/cook/messaging/${conversationId}`);
        } else {
          router.push(`/client/messaging/${conversationId}`);
        }
      },
    );

    return () => subscription.remove();
  }, [router, user]);
}
