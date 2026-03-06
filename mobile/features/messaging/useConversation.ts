import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import type {
  ApiConversation,
  ApiPaginatedMessages,
  Conversation,
  Message,
} from "./types";
import { io, Socket } from "socket.io-client";

import { getApiUrl } from "@/features/api/getApiUrl";
import { getSocketUrl } from "@/features/api/getSocketUrl";

const API_URL = getApiUrl();
const SOCKET_URL = getSocketUrl();

type ConversationState =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "success";
      conversation: Conversation;
      hasMore: boolean;
      loadingMore: boolean;
    };

export const COOK_REQUEST_MESSAGE_PREFIX = "__COOK_REQUEST__";
export const COOK_ACCEPT_MESSAGE_PREFIX = "__COOK_ACCEPT__";
export const COOK_PAID_MESSAGE_PREFIX = "__COOK_PAID__";

function parseRequestData(
  raw: string,
): {
  startDate: string;
  guestsNumber: number;
  mealType?: string;
  message?: string;
  street?: string;
  postalCode?: string;
  city?: string;
} | null {
  if (!raw.startsWith(COOK_REQUEST_MESSAGE_PREFIX)) return null;
  try {
    return JSON.parse(raw.slice(COOK_REQUEST_MESSAGE_PREFIX.length));
  } catch {
    return null;
  }
}

function parseAcceptData(
  raw: string,
): { price: number; cookRequestId: number } | null {
  if (!raw.startsWith(COOK_ACCEPT_MESSAGE_PREFIX)) return null;
  try {
    return JSON.parse(raw.slice(COOK_ACCEPT_MESSAGE_PREFIX.length));
  } catch {
    return null;
  }
}

function parsePaidData(
  raw: string,
): { cookRequestId: number; total: number } | null {
  if (!raw.startsWith(COOK_PAID_MESSAGE_PREFIX)) return null;
  try {
    return JSON.parse(raw.slice(COOK_PAID_MESSAGE_PREFIX.length));
  } catch {
    return null;
  }
}

function toMessage(
  msg: {
    id: number;
    authorId: number;
    message: string;
    createdAt: string;
    readAt?: string | null;
  },
  currentUserId: number,
): Message {
  const requestData = parseRequestData(msg.message);
  const acceptData = parseAcceptData(msg.message);
  const paidData = parsePaidData(msg.message);
  return {
    id: msg.id,
    content: msg.message,
    sender: msg.authorId === currentUserId ? "client" : "cook",
    sentAt: msg.createdAt,
    readAt: msg.readAt ?? null,
    ...(requestData ? { requestData } : {}),
    ...(acceptData ? { acceptData } : {}),
    ...(paidData ? { paidData } : {}),
  };
}

export function useConversation(conversationId: number) {
  const { token, user, isReady } = useAuth();
  const [state, setState] = useState<ConversationState>({ status: "loading" });
  const socketRef = useRef<Socket | null>(null);
  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);

  const currentUserId = user?.id;

  const load = useCallback(async () => {
    if (!isReady || !conversationId || !currentUserId) return;
    setState({ status: "loading" });
    try {
      const [convRes, msgsRes] = await Promise.all([
        fetch(`${API_URL}/conversations/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          `${API_URL}/conversations/${conversationId}/messages?page=1&limit=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      ]);
      if (!convRes.ok || !msgsRes.ok) throw new Error();

      const api: ApiConversation = await convRes.json();
      const paginated: ApiPaginatedMessages = await msgsRes.json();

      const other = api.participants.find(
        (p) => p.authorId !== currentUserId,
      );

      // Messages come DESC from backend — keep DESC for inverted FlatList
      const messages = paginated.messages.map((m) =>
        toMessage(m, currentUserId),
      );

      pageRef.current = 1;
      hasMoreRef.current = paginated.hasMore;

      setState({
        status: "success",
        conversation: {
          id: api.id,
          otherFirstName: other?.author.firstName ?? "",
          otherLastName: other?.author.lastName ?? "",
          messages,
        },
        hasMore: paginated.hasMore,
        loadingMore: false,
      });
    } catch {
      setState({ status: "error" });
    }
  }, [isReady, conversationId, token, currentUserId]);

  const loadMore = useCallback(async () => {
    if (!token || !conversationId || !currentUserId) return;
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    loadingMoreRef.current = true;
    setState((prev) => {
      if (prev.status !== "success") return prev;
      return { ...prev, loadingMore: true };
    });

    const nextPage = pageRef.current + 1;
    try {
      const res = await fetch(
        `${API_URL}/conversations/${conversationId}/messages?page=${nextPage}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error();
      const paginated: ApiPaginatedMessages = await res.json();

      pageRef.current = nextPage;
      hasMoreRef.current = paginated.hasMore;
      const olderMessages = paginated.messages.map((m) =>
        toMessage(m, currentUserId),
      );

      setState((prev) => {
        if (prev.status !== "success") return prev;
        return {
          ...prev,
          conversation: {
            ...prev.conversation,
            // Append older messages at the end (appear "above" in inverted FlatList)
            messages: [...prev.conversation.messages, ...olderMessages],
          },
          hasMore: paginated.hasMore,
          loadingMore: false,
        };
      });
    } catch {
      setState((prev) => {
        if (prev.status !== "success") return prev;
        return { ...prev, loadingMore: false };
      });
    } finally {
      loadingMoreRef.current = false;
    }
  }, [token, conversationId, currentUserId]);

  useEffect(() => {
    load();
  }, [load]);

  // Socket.IO connection for real-time messages
  useEffect(() => {
    if (!token || !conversationId || !currentUserId) return;

    const socket = io(`${SOCKET_URL}/chat`, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinConversation", { conversationId });
      socket.emit("markAsRead", { conversationId });
    });

    socket.on(
      "newMessage",
      (msg: {
        id: number;
        authorId: number;
        conversationId: number;
        message: string;
        createdAt: string;
      }) => {
        if (msg.conversationId !== conversationId) return;
        const isSystemMessage =
          msg.message.startsWith("__COOK_ACCEPT__") ||
          msg.message.startsWith("__COOK_PAID__") ||
          msg.message.startsWith("__COOK_REQUEST__");
        if (msg.authorId === currentUserId && !isSystemMessage) return;

        setState((prev) => {
          if (prev.status !== "success") return prev;
          if (prev.conversation.messages.some((m) => m.id === msg.id))
            return prev;

          return {
            ...prev,
            conversation: {
              ...prev.conversation,
              // Prepend: most recent first for inverted FlatList
              messages: [
                toMessage(msg, currentUserId),
                ...prev.conversation.messages,
              ],
            },
          };
        });

        socket.emit("markAsRead", { conversationId });
      },
    );

    socket.on(
      "messagesRead",
      (data: {
        conversationId: number;
        readByUserId: number;
        readAt: string;
      }) => {
        if (data.conversationId !== conversationId) return;
        if (data.readByUserId === currentUserId) return;

        setState((prev) => {
          if (prev.status !== "success") return prev;
          return {
            ...prev,
            conversation: {
              ...prev.conversation,
              messages: prev.conversation.messages.map((m) =>
                m.sender === "client" && !m.readAt
                  ? { ...m, readAt: data.readAt }
                  : m,
              ),
            },
          };
        });
      },
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, conversationId, currentUserId]);

  const sendMessage = useCallback(
    async (content: string) => {
      // Optimistic update — prepend (most recent first)
      setState((prev) => {
        if (prev.status !== "success") return prev;
        const newMessage: Message = {
          id: Date.now(),
          content,
          sender: "client",
          sentAt: new Date().toISOString(),
        };
        return {
          ...prev,
          conversation: {
            ...prev.conversation,
            messages: [newMessage, ...prev.conversation.messages],
          },
        };
      });

      try {
        const response = await fetch(
          `${API_URL}/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message: content }),
          },
        );
        if (!response.ok) throw new Error();
      } catch {
        load();
      }
    },
    [conversationId, token, load],
  );

  return { state, retry: load, sendMessage, loadMore };
}
