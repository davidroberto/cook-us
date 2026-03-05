import { getApiUrl } from "@/features/api/getApiUrl";

export type CookRequestStatus =
  | "pending"
  | "accepted"
  | "refused"
  | "cancelled";

export interface CookRequestItem {
  id: number;
  conversationId: number | null;
  guestsNumber: number;
  startDate: string;
  endDate: string | null;
  status: CookRequestStatus;
  cancellationReason: string | null;
  client: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

const authFetch = (url: string, token: string, options: RequestInit = {}) =>
  fetch(`${getApiUrl()}${url}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  });

export const getCookRequests = async (
  token: string
): Promise<CookRequestItem[]> => {
  const res = await authFetch("/cook-request/for-me", token);
  if (!res.ok) throw new Error("Impossible de charger les propositions.");
  return res.json();
};

export const acceptRequest = async (
  token: string,
  id: number,
  price: number
): Promise<void> => {
  const res = await authFetch(`/cook-request/${id}/accept`, token, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price }),
  });
  if (!res.ok) throw new Error("Impossible d'accepter la proposition.");
};

export const refuseRequest = async (
  token: string,
  id: number
): Promise<void> => {
  const res = await authFetch(`/cook-request/${id}/refuse`, token, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Impossible de refuser la proposition.");
};
