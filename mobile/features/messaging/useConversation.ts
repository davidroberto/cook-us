import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import type { ApiConversation, Conversation, Message } from "./types";

import { getApiUrl } from "@/features/api/getApiUrl";

const API_URL = getApiUrl();

type ConversationState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; conversation: Conversation };

export const COOK_REQUEST_MESSAGE_PREFIX = "__COOK_REQUEST__";

function parseRequestData(
  raw: string,
): { startDate: string; guestsNumber: number } | null {
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

export function useConversation(conversationId: number) {
  const { token, user, isReady } = useAuth();
  const [state, setState] = useState<ConversationState>({ status: "loading" });

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
    const interval = setInterval(() => load(true), 5000);
    return () => clearInterval(interval);
  }, [load]);

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

      await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: content }),
      });
    },
    [conversationId, token],
  );

  return { state, retry: load, sendMessage };
}
