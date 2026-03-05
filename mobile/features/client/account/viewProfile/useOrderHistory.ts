import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getApiUrl } from "@/features/api/getApiUrl";

export type CookRequestStatus = "pending" | "accepted" | "refused" | "cancelled" | "completed";

export interface OrderReview {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface OrderHistoryItem {
  id: number;
  guestsNumber: number;
  startDate: string;
  endDate: string | null;
  status: CookRequestStatus;
  mealType: string;
  cancellationReason: string | null;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  cook: {
    id: string;
    firstName: string;
    lastName: string;
    speciality: string;
  };
  review: OrderReview | null;
}

export interface UseOrderHistoryResult {
  orders: OrderHistoryItem[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useOrderHistory = (): UseOrderHistoryResult => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedOnce = useRef(false);

  const fetchOrders = useCallback(async () => {
    if (!token) return;

    if (!hasLoadedOnce.current) setLoading(true);
    setError(null);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/cook-request/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Impossible de récupérer l'historique");
      }

      const data: OrderHistoryItem[] = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      hasLoadedOnce.current = true;
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refresh: fetchOrders };
};
