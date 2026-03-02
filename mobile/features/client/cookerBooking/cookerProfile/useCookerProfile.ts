import { useCallback, useEffect, useState } from "react";
import { MOCK_COOKER_PROFILE } from "./mocks";
import type { CookerProfile, CookerProfileState } from "./types";

// --- Fake API (à remplacer par un vrai appel réseau) ---

const fakeGetCookerProfile = async (
  cookId: string
): Promise<CookerProfile | null> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (cookId === "not-found") return null;
  if (cookId === "error") throw new Error("Technical error");
  return { ...MOCK_COOKER_PROFILE, id: cookId };
};

// -------------------------------------------------------

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
