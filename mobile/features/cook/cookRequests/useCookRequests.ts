import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import {
  getCookRequests,
  acceptRequest,
  refuseRequest,
  updateRequestPrice,
  type CookRequestItem,
} from "./repository";

const LIMIT = 20;

export const useCookRequests = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<CookRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);

  const fetchRequests = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setRequests([]);
    pageRef.current = 1;
    hasMoreRef.current = true;
    try {
      const result = await getCookRequests(token, 1, LIMIT);
      setRequests(result.data);
      hasMoreRef.current = result.hasMore;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadMore = useCallback(async () => {
    if (!token || !hasMoreRef.current || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    try {
      const result = await getCookRequests(token, nextPage, LIMIT);
      setRequests((prev) => [...prev, ...result.data]);
      hasMoreRef.current = result.hasMore;
      pageRef.current = nextPage;
    } catch {
      // échec silencieux
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
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
    loadingMore,
    error,
    actionError,
    refresh: fetchRequests,
    loadMore,
    accept,
    refuse,
    updatePrice,
    actionLoading,
    clearActionError,
  };
};
