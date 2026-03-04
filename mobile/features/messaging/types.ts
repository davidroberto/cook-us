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
  messages: ApiMessage[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// ─── Display types — used in UI components ───────────────────────────────────

export type MessageSender = "client" | "cook" | "system";

export type Message = {
  id: number;
  content: string;
  sender: MessageSender;
  sentAt: string;
  requestData?: {
    startDate: string;
    guestsNumber: number;
  };
};

export type Conversation = {
  id: number;
  otherFirstName: string;
  otherLastName: string;
  messages: Message[];
};
