// ─── API types — TypeORM serializes with camelCase ───────────────────────────

export type ApiUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type ApiMessage = {
  id: number;
  authorId: number;
  author: ApiUser;
  conversationId: number;
  message: string;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiConversationParticipant = {
  id: number;
  authorId: number;
  author: ApiUser;
  conversationId: number;
  createdAt: string;
  deletedAt: string | null;
};

export type ApiConversation = {
  id: number;
  participants: ApiConversationParticipant[];
  lastMessage?: ApiMessage | null;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ApiPaginatedMessages = {
  messages: ApiMessage[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

// ─── Display types — used in UI components ───────────────────────────────────

export type MessageSender = "client" | "cook" | "system";

export type Message = {
  id: number;
  content: string;
  sender: MessageSender;
  sentAt: string;
  readAt?: string | null;
  requestData?: {
    startDate: string;
    guestsNumber: number;
    mealType?: string;
    message?: string;
  };
};

export type Conversation = {
  id: number;
  otherFirstName: string;
  otherLastName: string;
  messages: Message[];
};
