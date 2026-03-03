import type { Cook } from "@/features/client/cookerBooking/cookerList/types";

export const getCook = async (cookId: string): Promise<Cook> => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/cooks/${cookId}`
  );

  if (response.status === 404) {
    throw new NotFoundError();
  }

  if (!response.ok) {
    throw new Error("Impossible de charger le profil du cuisinier.");
  }

  return response.json();
};

export class NotFoundError extends Error {}
