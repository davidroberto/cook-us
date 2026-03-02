/**
 * Hook gérant la récupération de la liste des cuisiniers.
 *
 * Actuellement : charge les mocks de manière asynchrone.
 * Future intégration API : remplacer le bloc "TODO: API" par un fetch réel
 * sans modifier les composants consommateurs.
 */

import { useEffect, useState } from "react";
import { mapCooksToCardData } from "./mapper";
import { MOCK_COOKS } from "./mocks";
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

        // TODO: API — remplacer par fetch(`${API_URL}/cooks`) quand le backend sera prêt
        // const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cooks`);
        // const data: Cook[] = await response.json();

        // Simulation d'un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 300));
        const data = MOCK_COOKS;

        if (!cancelled) {
          setCooks(mapCooksToCardData(data));
        }
      } catch {
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
