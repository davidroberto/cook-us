import { useEffect, useMemo, useRef } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import type { Conversation, Message } from "../types";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

type Props = {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
};

export function ConversationView({ conversation, onSendMessage }: Props) {
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (conversation.messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [conversation.messages.length]);

  const lastReadMessageId = useMemo(() => {
    for (let i = conversation.messages.length - 1; i >= 0; i--) {
      const m = conversation.messages[i];
      if (m.sender === "client" && m.readAt) return m.id;
    }
    return null;
  }, [conversation.messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      testID="conversation-view"
    >
      <FlatList<Message>
        ref={listRef}
        testID="message-list"
        data={conversation.messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            showReadReceipt={item.id === lastReadMessageId}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <MessageInput onSend={onSendMessage} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
});
