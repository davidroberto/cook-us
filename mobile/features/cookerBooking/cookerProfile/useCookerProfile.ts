import { useState, useEffect, useCallback } from "react";

export type CookerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  description: string | null;
  speciality: string;
  hourlyRate: number | null;
};

export type CookerProfileState =
  | { status: "loading" }
  | { status: "not_found" }
  | { status: "error" }
  | { status: "success"; cook: CookerProfile };

// --- Fake API (à remplacer par un vrai appel réseau) ---

const FAKE_COOK: CookerProfile = {
  id: "1",
  firstName: "Marie",
  lastName: "Dupont",
  photoUrl: null,
  description:
    "Cuisinière passionnée spécialisée dans la gastronomie française traditionnelle. 10 ans d'expérience en restauration étoilée.",
  speciality: "Gastronomie française",
  hourlyRate: 35,
};

const fakeGetCookerProfile = async (
  cookId: string
): Promise<CookerProfile | null> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (cookId === "not-found") return null;
  if (cookId === "error") throw new Error("Technical error");
  return { ...FAKE_COOK, id: cookId };
};

// --------------------------------------------------------

export const useCookerProfile = (cookId: string) => {
  const [state, setState] = useState<CookerProfileState>({ status: "loading" });

  const load = useCallback(async () => {
    if (!cookId) {
      setState({ status: "not_found" });
      return;
    }
    setState({ status: "loading" });
    try {
      const cook = await fakeGetCookerProfile(cookId);
      if (!cook) {
        setState({ status: "not_found" });
      } else {
        setState({ status: "success", cook });
      }
    } catch {
      setState({ status: "error" });
    }
  }, [cookId]);

  useEffect(() => {
    load();
  }, [load]);

  return { state, retry: load };
};
