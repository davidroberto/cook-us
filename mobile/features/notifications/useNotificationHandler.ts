import { useEffect } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useAuth } from "@/features/auth/AuthContext";

const isExpoGo = Constants.appOwnership === "expo";
const isAndroidExpoGo = Platform.OS === "android" && isExpoGo;

if (!isAndroidExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export function useNotificationHandler() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (isAndroidExpoGo) return;

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
