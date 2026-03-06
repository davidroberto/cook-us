import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { mapCooksToCardData } from "./mapper";
import { getCooks, type CookFilters } from "./repository";
import type { CookerCardData } from "./types";

const LIMIT = 20;

interface UseCookerListResult {
  cooks: CookerCardData[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  refresh: () => void;
  loadMore: () => void;
}

export const useCookerList = (filters: CookFilters = {}): UseCookerListResult => {
  const { token } = useAuth();
  const [cooks, setCooks] = useState<CookerCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setCooks([]);
    pageRef.current = 1;
    hasMoreRef.current = true;
    try {
      const result = await getCooks(token, filters, 1, LIMIT);
      setCooks(mapCooksToCardData(result.data));
      hasMoreRef.current = result.hasMore;
    } catch {
      setError("Impossible de charger les cuisiniers.");
    } finally {
      setLoading(false);
    }
  }, [
    token,
    filters.search,
    filters.speciality,
    filters.minHourlyRate,
    filters.maxHourlyRate,
  ]);

  const loadMore = useCallback(async () => {
    if (!token || !hasMoreRef.current || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    try {
      const result = await getCooks(token, filters, nextPage, LIMIT);
      setCooks((prev) => [...prev, ...mapCooksToCardData(result.data)]);
      hasMoreRef.current = result.hasMore;
      pageRef.current = nextPage;
    } catch {
      // échec silencieux, l'utilisateur peut réessayer en scrollant à nouveau
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [
    token,
    filters.search,
    filters.speciality,
    filters.minHourlyRate,
    filters.maxHourlyRate,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  return { cooks, loading, loadingMore, hasMore: hasMoreRef.current, error, refresh: load, loadMore };
};
