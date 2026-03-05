import { getApiUrl } from "@/features/api/getApiUrl";
import type { Cook, CookSpeciality } from "./types";

export type CookFilters = {
  search?: string;
  speciality?: CookSpeciality;
  minHourlyRate?: number;
  maxHourlyRate?: number;
};

export const getCooks = async (
  token: string,
  filters: CookFilters = {}
): Promise<Cook[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.speciality) params.set("speciality", filters.speciality);
  if (filters.minHourlyRate !== undefined)
    params.set("minHourlyRate", String(filters.minHourlyRate));
  if (filters.maxHourlyRate !== undefined)
    params.set("maxHourlyRate", String(filters.maxHourlyRate));

  const query = params.toString();
  const response = await fetch(
    `${getApiUrl()}/cooks${query ? `?${query}` : ""}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    throw new Error("Impossible de charger les cuisiniers.");
  }

  return response.json();
};
