import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getApiUrl } from "@/features/api/getApiUrl";

export type CookRequestStatus = "pending" | "accepted" | "refused" | "cancelled";

export interface OrderHistoryItem {
  id: number;
  guestsNumber: number;
  startDate: string;
  endDate: string | null;
  status: CookRequestStatus;
  cancellationReason: string | null;
  cook: {
    id: string;
    firstName: string;
    lastName: string;
    speciality: string;
  };
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

  const fetchOrders = useCallback(async () => {
    if (!token) return;

    setLoading(true);
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
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refresh: fetchOrders };
};
