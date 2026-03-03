import type { Cook } from "./types";

export const getCooks = async (token: string): Promise<Cook[]> => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cooks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les cuisiniers.");
  }

  return response.json();
};
