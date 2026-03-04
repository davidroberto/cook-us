import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { StyleSheet, Text, View } from "react-native";
import type { Message } from "../types";
import { RequestSummaryCard } from "./RequestSummaryCard";

type Props = {
  message: Message;
};

export function MessageBubble({ message }: Props) {
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
          isSentByMe={isClient}
        />
      ) : (
        <View style={[styles.bubble, isClient ? styles.clientBubble : styles.cookBubble]}>
          <Text style={[styles.messageText, isClient ? styles.clientText : styles.cookText]}>
            {message.content}
          </Text>
        </View>
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
});
