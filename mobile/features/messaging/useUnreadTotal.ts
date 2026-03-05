import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { io, Socket } from "socket.io-client";

import { getApiUrl } from "@/features/api/getApiUrl";
import { getSocketUrl } from "@/features/api/getSocketUrl";

const API_URL = getApiUrl();
const SOCKET_URL = getSocketUrl();

export function useUnreadTotal() {
  const { token, user } = useAuth();
  const [total, setTotal] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  const currentUserId = user?.id;

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/conversations/unread-counts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;
      const data: { conversationId: number; unreadCount: number }[] =
        await response.json();
      setTotal(data.reduce((sum, c) => sum + c.unreadCount, 0));
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!token || !currentUserId) return;

    const socket = io(`${SOCKET_URL}/chat`, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on(
      "newMessage",
      (msg: { authorId: number }) => {
        if (msg.authorId === currentUserId) return;
        setTotal((prev) => prev + 1);
      }
    );

    socket.on(
      "messagesRead",
      (data: { readByUserId: number; markedCount: number }) => {
        if (data.readByUserId !== currentUserId) return;
        setTotal((prev) => Math.max(0, prev - data.markedCount));
      }
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, currentUserId]);

  return total;
}
