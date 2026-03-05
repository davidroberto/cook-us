import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import {
  getCookRequests,
  acceptRequest,
  refuseRequest,
  type CookRequestItem,
} from "./repository";

export const useCookRequests = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<CookRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCookRequests(token);
      setRequests(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const accept = async (id: number, price: number) => {
    if (!token) return;
    setActionLoading(id);
    try {
      await acceptRequest(token, id, price);
      await fetchRequests();
    } finally {
      setActionLoading(null);
    }
  };

  const refuse = async (id: number) => {
    if (!token) return;
    setActionLoading(id);
    try {
      await refuseRequest(token, id);
      await fetchRequests();
    } finally {
      setActionLoading(null);
    }
  };

  return {
    requests,
    loading,
    error,
    refresh: fetchRequests,
    accept,
    refuse,
    actionLoading,
  };
};
