import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { mapCooksToCardData } from "./mapper";
import { getCooks, type CookFilters } from "./repository";
import type { CookerCardData } from "./types";

interface UseCookerListResult {
  cooks: CookerCardData[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useCookerList = (filters: CookFilters = {}): UseCookerListResult => {
  const { token } = useAuth();
  const [cooks, setCooks] = useState<CookerCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getCooks(token, filters);
      setCooks(mapCooksToCardData(data));
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

  useEffect(() => {
    load();
  }, [load]);

  return { cooks, loading, error, refresh: load };
};
