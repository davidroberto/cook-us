import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { StyleSheet, Text, View } from "react-native";
import type { Message } from "../types";
import { RequestSummaryCard } from "./RequestSummaryCard";
import { AcceptSummaryCard } from "./AcceptSummaryCard";

type Props = {
  message: Message;
  showReadReceipt?: boolean;
};

function formatReadAt(iso: string): string {
  const now = Date.now();
  const readTime = new Date(iso).getTime();
  const diffMs = now - readTime;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "Vu à l'instant";
  if (diffMin < 60) return `Vu il y a ${diffMin}m`;
  if (diffH < 24) return `Vu il y a ${diffH}h`;
  if (diffDays < 2) return "Vu hier";
  if (diffDays < 7) return `Vu il y a ${diffDays}j`;
  return "Vu la semaine dernière";
}

export function MessageBubble({ message, showReadReceipt }: Props) {
  const isClient = message.sender === "client";
  const isSystem = message.sender === "system";

  if (isSystem) {
    return (
      <View style={styles.systemContainer} testID="message-bubble-system">
        <Text style={styles.systemText}>{message.content}</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.bubbleContainer, isClient ? styles.clientSide : styles.cookSide]}
      testID={isClient ? "message-bubble-client" : "message-bubble-cook"}
    >
      {message.requestData ? (
        <RequestSummaryCard
          startDate={message.requestData.startDate}
          guestsNumber={message.requestData.guestsNumber}
          mealType={message.requestData.mealType}
          message={message.requestData.message}
          street={message.requestData.street}
          postalCode={message.requestData.postalCode}
          city={message.requestData.city}
          isSentByMe={isClient}
        />
      ) : message.acceptData ? (
        <AcceptSummaryCard
          price={message.acceptData.price}
          isSentByMe={!isClient}
        />
      ) : (
        <View style={[styles.bubble, isClient ? styles.clientBubble : styles.cookBubble]}>
          <Text style={[styles.messageText, isClient ? styles.clientText : styles.cookText]}>
            {message.content}
          </Text>
        </View>
      )}
      {showReadReceipt && message.readAt && (
        <Text style={styles.readReceipt}>{formatReadAt(message.readAt)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  systemContainer: {
    alignItems: "center",
    marginVertical: 12,
    marginHorizontal: 24,
  },
  systemText: {
    ...typography.styles.body2Light,
    color: colors.text,
    opacity: colors.opacity[56],
    textAlign: "center",
    fontStyle: "italic",
  },
  bubbleContainer: {
    marginVertical: 4,
    marginHorizontal: 12,
  },
  clientSide: { alignItems: "flex-end" },
  cookSide: { alignItems: "flex-start" },
  bubble: {
    maxWidth: "75%",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  clientBubble: {
    backgroundColor: colors.main,
    borderBottomRightRadius: 4,
  },
  cookBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...typography.styles.body2Regular,
  },
  clientText: { color: colors.white },
  cookText: { color: colors.text },
  readReceipt: {
    fontSize: 11,
    color: colors.text,
    opacity: 0.45,
    marginTop: 2,
    textAlign: "right" as const,
  },
});
