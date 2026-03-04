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
import { useEffect, useState } from "react";
import { getApiUrl } from "@/features/api/getApiUrl";

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  refused: "Refusée",
  cancelled: "Annulée",
};

const STATUS_COLOR: Record<string, string> = {
  pending: colors.secondary,
  accepted: "#4CAF50",
  refused: colors.mainDark,
  cancelled: "#9E9E9E",
};

function getOtherParticipant(conversation: ApiConversation, currentUserId: number) {
  return conversation.participants.find((p) => p.authorId !== currentUserId);
}

function getLastMessage(conversation: ApiConversation) {
  if (!conversation.messages.length) return null;
  return [...conversation.messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ).at(-1)!;
}

function getCookRequestId(conversation: ApiConversation): number | null {
  for (const msg of conversation.messages) {
    if (msg.message.startsWith(COOK_REQUEST_MESSAGE_PREFIX)) {
      try {
        const data = JSON.parse(msg.message.slice(COOK_REQUEST_MESSAGE_PREFIX.length)) as {
          cookRequestId?: number;
        };
        if (data.cookRequestId) return data.cookRequestId;
      } catch {
        // ignore
      }
    }
  }
  return null;
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
  status,
  onPress,
}: {
  conversation: ApiConversation;
  currentUserId: number;
  status?: string;
  onPress: () => void;
}) {
  const other = getOtherParticipant(conversation, currentUserId);
  const lastMessage = getLastMessage(conversation);
  const name = other ? `${other.author.firstName} ${other.author.lastName}` : "Inconnu";

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{name}</Text>
          {status && (
            <View style={[styles.badge, { backgroundColor: STATUS_COLOR[status] ?? "#9E9E9E" }]}>
              <Text style={styles.badgeText}>{STATUS_LABEL[status] ?? status}</Text>
            </View>
          )}
        </View>
        {lastMessage && (
          <Text style={styles.itemLastMessage} numberOfLines={1}>
            {formatMessagePreview(lastMessage.message)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function MessagesTab() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { state, retry } = useMyConversations();
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});

  useEffect(() => {
    if (state.status !== "success" || !token) return;

    const fetchStatuses = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/cook-request/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const requests = await res.json() as Array<{ id: number; status: string }>;
        const map: Record<number, string> = {};
        for (const r of requests) {
          map[r.id] = r.status;
        }
        setStatusMap(map);
      } catch {
        // silently ignore
      }
    };

    fetchStatuses();
  }, [state.status, token]);

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
          renderItem={({ item }) => {
            const cookRequestId = getCookRequestId(item);
            const status = cookRequestId != null ? statusMap[cookRequestId] : undefined;
            return (
              <ConversationItem
                conversation={item}
                currentUserId={user?.id ?? 0}
                status={status}
                onPress={() =>
                  router.push({
                    pathname: "/client/messaging/[requestId]",
                    params: { requestId: String(item.id) },
                  })
                }
              />
            );
          }}
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
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  itemName: {
    ...typography.styles.body2Bold,
    color: colors.text,
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.white,
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
});
