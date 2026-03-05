import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import type { ApiConversation, Conversation, Message } from "./types";
import { io, Socket } from "socket.io-client";

import { getApiUrl } from "@/features/api/getApiUrl";
import { getSocketUrl } from "@/features/api/getSocketUrl";

const API_URL = getApiUrl();
const SOCKET_URL = getSocketUrl();

type ConversationState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; conversation: Conversation };

export const COOK_REQUEST_MESSAGE_PREFIX = "__COOK_REQUEST__";

function parseRequestData(
  raw: string,
): { startDate: string; guestsNumber: number; mealType?: string; message?: string } | null {
  if (!raw.startsWith(COOK_REQUEST_MESSAGE_PREFIX)) return null;
  try {
    return JSON.parse(raw.slice(COOK_REQUEST_MESSAGE_PREFIX.length));
  } catch {
    return null;
  }
}

function toConversation(
  api: ApiConversation,
  currentUserId: number,
): Conversation {
  const other = api.participants.find((p) => p.authorId !== currentUserId);
  return {
    id: api.id,
    otherFirstName: other?.author.firstName ?? "",
    otherLastName: other?.author.lastName ?? "",
    messages: api.messages.map((m) => {
      const requestData = parseRequestData(m.message);
      return {
        id: m.id,
        content: m.message,
        sender: m.authorId === currentUserId ? "client" : "cook",
        sentAt: m.createdAt,
        ...(requestData ? { requestData } : {}),
      };
    }),
  };
}

function toMessage(
  msg: { id: number; authorId: number; message: string; createdAt: string },
  currentUserId: number,
): Message {
  const requestData = parseRequestData(msg.message);
  return {
    id: msg.id,
    content: msg.message,
    sender: msg.authorId === currentUserId ? "client" : "cook",
    sentAt: msg.createdAt,
    ...(requestData ? { requestData } : {}),
  };
}

export function useConversation(conversationId: number, options?: { onCookRequestAccepted?: () => void; onCookRequestPaid?: () => void; onExternalMessage?: () => void }) {
  const { token, user, isReady } = useAuth();
  const [state, setState] = useState<ConversationState>({ status: "loading" });
  const socketRef = useRef<Socket | null>(null);
  const onCookRequestAcceptedRef = useRef(options?.onCookRequestAccepted);
  const onCookRequestPaidRef = useRef(options?.onCookRequestPaid);
  const onExternalMessageRef = useRef(options?.onExternalMessage);
  onCookRequestAcceptedRef.current = options?.onCookRequestAccepted;
  onCookRequestPaidRef.current = options?.onCookRequestPaid;
  onExternalMessageRef.current = options?.onExternalMessage;

  const currentUserId = user?.id;

  const load = useCallback(
    async (silent = false) => {
      if (!isReady || !conversationId || !currentUserId) return;
      if (!silent) setState({ status: "loading" });
      try {
        const response = await fetch(
          `${API_URL}/conversations/${conversationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) throw new Error();
        const api: ApiConversation = await response.json();
        setState({
          status: "success",
          conversation: toConversation(api, currentUserId),
        });
      } catch {
        if (!silent) setState({ status: "error" });
      }
    },
    [isReady, conversationId, token, currentUserId],
  );

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
    });

    socket.on("cookRequestAccepted", (data: { conversationId: number }) => {
      if (data.conversationId === conversationId) {
        onCookRequestAcceptedRef.current?.();
      }
    });

    socket.on("cookRequestPaid", (data: { conversationId: number }) => {
      if (data.conversationId === conversationId) {
        onCookRequestPaidRef.current?.();
      }
    });

    socket.on("newMessage", (msg: { id: number; authorId: number; conversationId: number; message: string; createdAt: string }) => {
      if (msg.conversationId !== conversationId) return;

      // Skip our own messages (already handled by optimistic update)
      if (msg.authorId === currentUserId) return;

      console.log("[useConversation] external message received, onExternalMessage defined:", !!onExternalMessageRef.current);
      onExternalMessageRef.current?.();

      setState((prev) => {
        if (prev.status !== "success") return prev;

        // Avoid duplicates
        if (prev.conversation.messages.some((m) => m.id === msg.id)) return prev;

        return {
          status: "success",
          conversation: {
            ...prev.conversation,
            messages: [...prev.conversation.messages, toMessage(msg, currentUserId)],
          },
        };
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, conversationId, currentUserId]);

  const sendMessage = useCallback(
    async (content: string) => {
      // Optimistic update
      setState((prev) => {
        if (prev.status !== "success") return prev;
        const newMessage: Message = {
          id: Date.now(),
          content,
          sender: "client",
          sentAt: new Date().toISOString(),
        };
        return {
          status: "success",
          conversation: {
            ...prev.conversation,
            messages: [...prev.conversation.messages, newMessage],
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
        // Rollback: reload conversation from server to remove the optimistic message
        load(true);
      }
    },
    [conversationId, token, load],
  );

  return { state, retry: load, sendMessage };
}
