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
  price: number | null;
  totalPrice: number | null;
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

  const load = useCallback(async (silent = false) => {
    console.log("[loadRequests] called, conversationId:", conversationId, "hasToken:", !!token);
    if (!conversationId || !token) return;
    if (!silent) setState({ status: "loading" });
    try {
      const response = await fetch(
        `${API_URL}/cook-request/conversation/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error();
      const requests: CookRequestSummary[] = await response.json();
      console.log("[loadRequests] success, requests:", JSON.stringify(requests));
      setState({ status: "success", requests });
    } catch (e) {
      console.log("[loadRequests] error:", e);
      if (!silent) setState({ status: "error" });
    }
  }, [conversationId, token]);

  return { state, load };
}
