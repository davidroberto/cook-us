import { getApiUrl } from "@/features/api/getApiUrl";

export type StatPeriod = "1m" | "3m" | "6m" | "1y";

export interface CookStats {
  period: { from: string; to: string };
  selectedPeriod: StatPeriod;
  granularity: "week" | "month";
  completedCount: {
    total: number;
    thisWeek: number;
    thisMonth: number;
  };
  evolution: Array<{ period: string; count: number }>;
  acceptanceRate: number | null;
  averageGuestsNumber: number | null;
  mealTypeDistribution: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
  averageRating: number | null;
  ratingDistribution: Record<string, number>;
}

export const getCookStats = async (
  token: string,
  period: StatPeriod
): Promise<CookStats> => {
  const res = await fetch(`${getApiUrl()}/cook/stats?period=${period}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Impossible de charger les statistiques.");
  return res.json();
};
