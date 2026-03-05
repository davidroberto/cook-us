import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { colors } from "@/styles/colors";
import type { Conversation, Message } from "../types";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

type Props = {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
};

export function ConversationView({
  conversation,
  onSendMessage,
  onLoadMore,
  hasMore,
  loadingMore,
}: Props) {
  // Messages are in DESC order (newest first) — find the most recent read message from current user
  const lastReadMessageId = useMemo(() => {
    for (let i = 0; i < conversation.messages.length; i++) {
      const m = conversation.messages[i];
      if (m.sender === "client" && m.readAt) return m.id;
    }
    return null;
  }, [conversation.messages]);

  return (
    <View style={styles.container} testID="conversation-view">
      <FlatList<Message>
        testID="message-list"
        inverted
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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        onEndReached={hasMore ? onLoadMore : undefined}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={colors.main}
              style={styles.loader}
            />
          ) : null
        }
      />
      <MessageInput onSend={onSendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingVertical: 12,
  },
  loader: {
    paddingVertical: 16,
  },
});
