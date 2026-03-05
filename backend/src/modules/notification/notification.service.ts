import { Injectable, Logger } from "@nestjs/common";

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default";
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

  async sendPushNotifications(
    pushTokens: string[],
    title: string,
    body: string,
    data?: Record<string, unknown>
  ): Promise<void> {
    if (pushTokens.length === 0) return;

    const messages: ExpoPushMessage[] = pushTokens.map((token) => ({
      to: token,
      title,
      body,
      data,
      sound: "default" as const,
    }));

    try {
      const response = await fetch(this.EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        this.logger.error(
          `Expo Push API error: ${response.status} ${response.statusText}`
        );
        return;
      }

      const result = await response.json();
      this.logger.log(
        `Push notifications sent to ${pushTokens.length} device(s)`
      );

      if (result.data) {
        for (const ticket of result.data) {
          if (ticket.status === "error") {
            this.logger.warn(
              `Push ticket error: ${ticket.message} (${ticket.details?.error})`
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed to send push notifications: ${error}`);
    }
  }
}
