import { useConversation } from "@/features/messaging/useConversation";
import { ConversationView } from "@/features/messaging/components/ConversationView";
import { ConversationOrdersButton } from "@/features/messaging/components/ConversationOrdersButton";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  SafeAreaView,
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

  const { state, retry, sendMessage, loadMore } = useConversation(parseInt(requestId ?? "0", 10));

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/client/(tabs)/messages")} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <ConversationOrdersButton conversationId={parseInt(requestId ?? "0", 10)} />
      </View>
      <ConversationView
        conversation={state.conversation}
        onSendMessage={sendMessage}
        onLoadMore={loadMore}
        hasMore={state.hasMore}
        loadingMore={state.loadingMore}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
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
