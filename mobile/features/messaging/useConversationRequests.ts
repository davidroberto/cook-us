import { useCallback, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getApiUrl } from "@/features/api/getApiUrl";

const API_URL = getApiUrl();

export type CookRequestSummary = {
  id: number;
  startDate: string;
  endDate: string | null;
  guestsNumber: number;
  mealType: string;
  status: string;
  street: string | null;
  postalCode: string | null;
  city: string | null;
};

type RequestsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; requests: CookRequestSummary[] };

export function useConversationRequests(conversationId: number) {
  const { token } = useAuth();
  const [state, setState] = useState<RequestsState>({ status: "idle" });

  const load = useCallback(async () => {
    if (!conversationId || !token) return;
    setState({ status: "loading" });
    try {
      const response = await fetch(
        `${API_URL}/cook-request/conversation/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error();
      const requests: CookRequestSummary[] = await response.json();
      setState({ status: "success", requests });
    } catch {
      setState({ status: "error" });
    }
  }, [conversationId, token]);

  return { state, load };
}
