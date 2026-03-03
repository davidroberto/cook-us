import type { ApiConversation, Conversation, ConversationSeedData } from "./types";

export function buildMockApiConversation(seed: ConversationSeedData): ApiConversation {
  const now = new Date().toISOString();
  return {
    id: seed.conversationId,
    created_at: now,
    updated_at: now,
    deleted_at: null,
    participants: [
      { id: 1, author_id: seed.currentUserId, conversation_id: seed.conversationId, created_at: now, deleted_at: null },
      { id: 2, author_id: seed.otherUserId, conversation_id: seed.conversationId, created_at: now, deleted_at: null },
    ],
    messages: [],
  };
}

export function toConversation(
  api: ApiConversation,
  currentUserId: number,
  cookFirstName: string,
  cookLastName: string,
  requestData?: { startDate: string; guestsNumber: number }
): Conversation {
  return {
    id: api.id,
    cookFirstName,
    cookLastName,
    messages: api.messages.map((m) => ({
      id: m.id,
      content: m.message,
      sender: m.author_id === currentUserId ? "client" : "cook",
      sentAt: m.created_at,
    })),
    ...(requestData ? { requestData } : {}),
  };
}

export const MOCK_API_CONVERSATION_FALLBACK: ApiConversation = {
  id: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  participants: [
    { id: 1, author_id: 1, conversation_id: 1, created_at: new Date().toISOString(), deleted_at: null },
    { id: 2, author_id: 2, conversation_id: 1, created_at: new Date().toISOString(), deleted_at: null },
  ],
  messages: [],
};
