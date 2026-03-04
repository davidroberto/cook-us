import { getApiUrl } from "@/features/api/getApiUrl";
import type { Cook } from "./types";

export const getCooks = async (token: string): Promise<Cook[]> => {
  const response = await fetch(`${getApiUrl()}/cooks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les cuisiniers.");
  }

  return response.json();
};
