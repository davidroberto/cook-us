/**
 * Hook gérant la récupération de la liste des cuisiniers via l'API.
 * Délègue le fetch à repository.ts et la transformation à mapper.ts.
 */

import { useEffect, useState } from "react";
import { mapCooksToCardData } from "./mapper";
import { getCooks } from "./repository";
import type { CookerCardData } from "./types";

interface UseCookerListResult {
  cooks: CookerCardData[];
  loading: boolean;
  error: string | null;
}

export const useCookerList = (): UseCookerListResult => {
  const [cooks, setCooks] = useState<CookerCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCooks();

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
  }, []);

  return { cooks, loading, error };
};
