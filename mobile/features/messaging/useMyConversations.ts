import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import type { ApiConversation } from "./types";
import { io, Socket } from "socket.io-client";

import { getApiUrl } from "@/features/api/getApiUrl";
import { getSocketUrl } from "@/features/api/getSocketUrl";

const API_URL = getApiUrl();
const SOCKET_URL = getSocketUrl();

type MyConversationsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; conversations: ApiConversation[] };

export function useMyConversations() {
  const { token, user } = useAuth();
  const [state, setState] = useState<MyConversationsState>({ status: "loading" });
  const socketRef = useRef<Socket | null>(null);

  const currentUserId = user?.id;

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const response = await fetch(`${API_URL}/conversations/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      const conversations: ApiConversation[] = await response.json();
      setState({ status: "success", conversations });
    } catch {
      setState({ status: "error" });
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // Listen for new messages to update unread counts in real-time
  useEffect(() => {
    if (!token || !currentUserId) return;

    const socket = io(`${SOCKET_URL}/chat`, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("newMessage", (msg: { id: number; authorId: number; conversationId: number }) => {
      if (msg.authorId === currentUserId) return;

      setState((prev) => {
        if (prev.status !== "success") return prev;

        return {
          status: "success",
          conversations: prev.conversations.map((c) =>
            c.id === msg.conversationId
              ? { ...c, unreadCount: (c.unreadCount ?? 0) + 1 }
              : c
          ),
        };
      });
    });

    socket.on("messagesRead", (data: { conversationId: number; readByUserId: number }) => {
      if (data.readByUserId !== currentUserId) return;

      setState((prev) => {
        if (prev.status !== "success") return prev;

        return {
          status: "success",
          conversations: prev.conversations.map((c) =>
            c.id === data.conversationId
              ? { ...c, unreadCount: 0 }
              : c
          ),
        };
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, currentUserId]);

  return { state, retry: load };
}
