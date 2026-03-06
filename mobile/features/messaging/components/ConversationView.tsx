import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Messages are in DESC order (newest first) — find the most recent read message from current user
  const lastReadMessageId = useMemo(() => {
    for (let i = 0; i < conversation.messages.length; i++) {
      const m = conversation.messages[i];
      if (m.sender === "client" && m.readAt) return m.id;
    }
    return null;
  }, [conversation.messages]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setKeyboardHeight(0),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const keyboardVisible = keyboardHeight > 0;
  const bottomInset = keyboardVisible ? 0 : insets.bottom;

  const content = (
    <>
      <FlatList<Message>
        testID="message-list"
        inverted
        style={styles.list}
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
      <MessageInput onSend={onSendMessage} bottomInset={bottomInset} />
    </>
  );

  if (Platform.OS === "android") {
    return (
      <View
        style={[
          styles.container,
          keyboardVisible && { paddingBottom: keyboardHeight + insets.bottom },
        ]}
        testID="conversation-view"
      >
        {content}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      testID="conversation-view"
    >
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
  },
  loader: {
    paddingVertical: 16,
  },
});
