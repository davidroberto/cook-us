import { useEffect, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
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

  return (
    <View style={styles.container} testID="conversation-view">
      <FlatList<Message>
        ref={listRef}
        testID="message-list"
        data={conversation.messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    flexGrow: 1,
  },
});
