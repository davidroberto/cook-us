import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import type { ApiConversation } from "./types";

import { getApiUrl } from "@/features/api/getApiUrl";

const API_URL = getApiUrl();

type MyConversationsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; conversations: ApiConversation[] };

export function useMyConversations() {
  const { token } = useAuth();
  const [state, setState] = useState<MyConversationsState>({ status: "loading" });

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

  return { state, retry: load };
}
