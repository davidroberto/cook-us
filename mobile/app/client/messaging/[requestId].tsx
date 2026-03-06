import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { ConversationOrdersButton } from "@/features/messaging/components/ConversationOrdersButton";
import { ConversationView } from "@/features/messaging/components/ConversationView";
import { useConversation } from "@/features/messaging/useConversation";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MessagingPage() {
  const router = useRouter();
  const { requestId, otherFirstName, otherLastName } = useLocalSearchParams<{
    requestId: string;
    otherFirstName?: string;
    otherLastName?: string;
  }>();

  const { state, retry, sendMessage, sendImage, loadMore } = useConversation(
    parseInt(requestId ?? "0", 10),
  );

  // Reload conversation when screen regains focus (e.g., coming back from payment)
  useFocusEffect(
    useCallback(() => {
      retry();
    }, [retry]),
  );

  const headerTitle =
    state.status === "success"
      ? `${state.conversation.otherFirstName} ${state.conversation.otherLastName}`
      : otherFirstName && otherLastName
        ? `${otherFirstName} ${otherLastName}`
        : "Messagerie";

  if (state.status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Impossible de charger la conversation.
        </Text>
        <TouchableOpacity onPress={retry} style={styles.retryButton}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScreenBackground edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/client/(tabs)/messages")}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <ConversationOrdersButton
          conversationId={parseInt(requestId ?? "0", 10)}
          cookName={
            state.status === "success"
              ? `${state.conversation.otherFirstName} ${state.conversation.otherLastName}`
              : undefined
          }
          cookFirstName={
            state.status === "success"
              ? state.conversation.otherFirstName
              : undefined
          }
          cookLastName={
            state.status === "success"
              ? state.conversation.otherLastName
              : undefined
          }
          onClose={retry}
        />
      </View>
      <ConversationView
        conversation={state.conversation}
        onSendMessage={sendMessage}
        onSendImage={sendImage}
        onLoadMore={loadMore}
        hasMore={state.hasMore}
        loadingMore={state.loadingMore}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
  backButton: { padding: 4 },
  backText: {
    ...typography.styles.body1Regular,
    color: colors.main,
  },
  headerTitle: {
    ...typography.styles.body1Bold,
    color: colors.text,
  },
  headerRight: { width: 60 },
  errorText: {
    ...typography.styles.body1Regular,
    color: colors.mainDark,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  retryText: {
    ...typography.styles.body1Regular,
    color: colors.text,
  },
});
