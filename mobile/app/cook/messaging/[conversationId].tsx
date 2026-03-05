import { useEffect } from "react";
import { useConversation } from "@/features/messaging/useConversation";
import { useConversationRequests } from "@/features/messaging/useConversationRequests";
import { ConversationView } from "@/features/messaging/components/ConversationView";
import { ConversationOrdersButton } from "@/features/messaging/components/ConversationOrdersButton";
import { CookRequestActionBanner } from "@/features/cook/cookRequests/CookRequestActionBanner";
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

export default function CookMessagingPage() {
  const router = useRouter();
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();

  const convId = parseInt(conversationId ?? "0", 10);
  const { state: reqState, load: loadRequests } = useConversationRequests(convId);
  const { state, retry, sendMessage } = useConversation(convId, {
    onCookRequestPaid: () => loadRequests(true),
  });

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const headerTitle =
    state.status === "success"
      ? `${state.conversation.otherFirstName} ${state.conversation.otherLastName}`
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
        <TouchableOpacity onPress={() => retry()} style={styles.retryButton}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/cook/(tabs)/messages")} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <ConversationOrdersButton conversationId={convId} />
      </View>
      <ConversationView
        conversation={state.conversation}
        onSendMessage={sendMessage}
        actionBanner={
          reqState.status === "success"
            ? (() => {
                const active = reqState.requests.find(
                  r => r.status === "pending" || r.status === "accepted"
                ) ?? null;
                return active
                  ? <CookRequestActionBanner request={active} onSuccess={loadRequests} />
                  : undefined;
              })()
            : undefined
        }
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
