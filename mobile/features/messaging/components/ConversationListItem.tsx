import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/colors";
import { typography } from "@/styles/typography";
import type { ConversationPreview } from "../useMyConversations";

type Props = {
  conversation: ConversationPreview;
  onPress: (id: number) => void;
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function ConversationListItem({ conversation, onPress }: Props) {
  return (
    <Pressable
      testID="conversation-list-item"
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(conversation.id)}
    >
      <View style={styles.avatar}>
        <Text style={styles.initials}>
          {conversation.otherFirstName[0]?.toUpperCase() ?? "?"}
          {conversation.otherLastName[0]?.toUpperCase() ?? ""}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>
            {conversation.otherFirstName} {conversation.otherLastName}
          </Text>
          {conversation.lastMessageAt && (
            <Text style={styles.date}>{formatDate(conversation.lastMessageAt)}</Text>
          )}
        </View>
        {conversation.lastMessage && (
          <Text style={styles.preview} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
  pressed: {
    opacity: 0.7,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  initials: {
    ...typography.styles.body1Bold,
    color: colors.mainDark,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    ...typography.styles.body1Bold,
    color: colors.text,
    flex: 1,
  },
  date: {
    ...typography.styles.body2Regular,
    color: colors.text,
    opacity: 0.5,
    marginLeft: 8,
  },
  preview: {
    ...typography.styles.body2Regular,
    color: colors.text,
    opacity: 0.6,
  },
});
