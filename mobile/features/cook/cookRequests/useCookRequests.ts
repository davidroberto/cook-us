import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import {
  getCookRequests,
  acceptRequest,
  refuseRequest,
  updateRequestPrice,
  type CookRequestItem,
} from "./repository";

export const useCookRequests = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<CookRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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
    setActionError(null);
    try {
      await acceptRequest(token, id, price);
      await fetchRequests();
      return true;
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Erreur lors de l'acceptation"
      );
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const refuse = async (id: number) => {
    if (!token) return;
    setActionLoading(id);
    setActionError(null);
    try {
      await refuseRequest(token, id);
      await fetchRequests();
      return true;
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Erreur lors du refus"
      );
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const updatePrice = async (id: number, price: number) => {
    if (!token) return;
    setActionLoading(id);
    setActionError(null);
    try {
      await updateRequestPrice(token, id, price);
      await fetchRequests();
      return true;
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Erreur lors de la modification du prix"
      );
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const clearActionError = () => setActionError(null);

  return {
    requests,
    loading,
    error,
    actionError,
    refresh: fetchRequests,
    accept,
    refuse,
    updatePrice,
    actionLoading,
    clearActionError,
  };
};
