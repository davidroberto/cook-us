import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { useAuth } from "@/features/auth/AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotificationHandler() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
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
