import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { mapCooksToCardData } from "./mapper";
import { getCooks, type CookFilters } from "./repository";
import type { CookerCardData } from "./types";

interface UseCookerListResult {
  cooks: CookerCardData[];
  loading: boolean;
  error: string | null;
}

export const useCookerList = (filters: CookFilters = {}): UseCookerListResult => {
  const { token } = useAuth();
  const [cooks, setCooks] = useState<CookerCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCooks(token, filters);

        if (!cancelled) {
          setCooks(mapCooksToCardData(data));
        }
      } catch (err) {
        if (!cancelled) {
          setError("Impossible de charger les cuisiniers.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    token,
    filters.search,
    filters.speciality,
    filters.minHourlyRate,
    filters.maxHourlyRate,
  ]);

  return { cooks, loading, error };
};
