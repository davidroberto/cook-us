import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/features/auth/AuthContext";
import { useMyConversations } from "@/features/messaging/useMyConversations";
import { COOK_REQUEST_MESSAGE_PREFIX } from "@/features/messaging/useConversation";
import type { ApiConversation } from "@/features/messaging/types";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";

function getOtherParticipant(conversation: ApiConversation, currentUserId: number) {
  return conversation.participants.find((p) => p.authorId !== currentUserId);
}

function getLastMessage(conversation: ApiConversation) {
  if (!conversation.messages.length) return null;
  return [...conversation.messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ).at(-1)!;
}

function formatMessagePreview(raw: string): string {
  if (!raw.startsWith(COOK_REQUEST_MESSAGE_PREFIX)) return raw;
  try {
    const data = JSON.parse(raw.slice(COOK_REQUEST_MESSAGE_PREFIX.length)) as {
      startDate: string;
      guestsNumber: number;
    };
    return `Demande de réservation · ${data.guestsNumber} convive${data.guestsNumber > 1 ? "s" : ""} · ${data.startDate}`;
  } catch {
    return "Demande de réservation";
  }
}

function ConversationItem({
  conversation,
  currentUserId,
  onPress,
}: {
  conversation: ApiConversation;
  currentUserId: number;
  onPress: () => void;
}) {
  const other = getOtherParticipant(conversation, currentUserId);
  const lastMessage = getLastMessage(conversation);
  const name = other ? `${other.author.firstName} ${other.author.lastName}` : "Inconnu";
  const unreadCount = conversation.unreadCount ?? 0;

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{name}</Text>
        {lastMessage && (
          <Text style={styles.itemLastMessage} numberOfLines={1}>
            {formatMessagePreview(lastMessage.message)}
          </Text>
        )}
      </View>
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function CookMessagesTab() {
  const router = useRouter();
  const { user } = useAuth();
  const { state, retry } = useMyConversations();

  if (state.status === "loading") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.main} />
        </View>
      </SafeAreaView>
    );
  }

  if (state.status === "error") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Impossible de charger les conversations.</Text>
          <TouchableOpacity onPress={retry} style={styles.retryButton}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      {state.conversations.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Aucune conversation pour l'instant.</Text>
        </View>
      ) : (
        <FlatList
          data={state.conversations}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              currentUserId={user?.id ?? 0}
              onPress={() =>
                router.push({
                  pathname: "/cook/messaging/[conversationId]",
                  params: { conversationId: String(item.id) },
                })
              }
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.styles.body1Bold,
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    ...typography.styles.body1Bold,
    color: colors.mainDark,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    ...typography.styles.body2Bold,
    color: colors.text,
  },
  itemLastMessage: {
    ...typography.styles.body2Regular,
    color: colors.text,
    opacity: 0.55,
    marginTop: 2,
  },
  emptyText: {
    ...typography.styles.body1Regular,
    color: colors.text,
    opacity: 0.5,
    textAlign: "center",
  },
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
  badge: {
    backgroundColor: colors.main,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700" as const,
  },
});
