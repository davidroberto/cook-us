import type { Cook } from "./types";

export const getCooks = async (): Promise<Cook[]> => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cooks`);

  if (!response.ok) {
    throw new Error("Impossible de charger les cuisiniers.");
  }

  return response.json();
};
