import { getApiUrl } from "@/features/api/getApiUrl";
import type { Cook, CookSpeciality } from "./types";

export type CookFilters = {
  search?: string;
  speciality?: CookSpeciality;
  minHourlyRate?: number;
  maxHourlyRate?: number;
};

export type PaginatedCooks = {
  data: Cook[];
  total: number;
  hasMore: boolean;
};

export const getCooks = async (
  token: string,
  filters: CookFilters = {},
  page = 1,
  limit = 20
): Promise<PaginatedCooks> => {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.speciality) params.set("speciality", filters.speciality);
  if (filters.minHourlyRate !== undefined)
    params.set("minHourlyRate", String(filters.minHourlyRate));
  if (filters.maxHourlyRate !== undefined)
    params.set("maxHourlyRate", String(filters.maxHourlyRate));
  params.set("page", String(page));
  params.set("limit", String(limit));

  const response = await fetch(
    `${getApiUrl()}/cooks?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    throw new Error("Impossible de charger les cuisiniers.");
  }

  return response.json();
};
