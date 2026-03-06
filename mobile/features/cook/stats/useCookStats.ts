import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getCookStats, type CookStats, type StatPeriod } from "./repository";

export const useCookStats = () => {
  const { token } = useAuth();
  const [period, setPeriod] = useState<StatPeriod>("3m");
  const [stats, setStats] = useState<CookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCookStats(token, period);
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [token, period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, period, setPeriod, refresh: fetchStats };
};
