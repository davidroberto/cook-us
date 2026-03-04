import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getCook, NotFoundError } from "./repository";
import type { CookerProfile, CookerProfileState } from "./types";
import type { Cook } from "@/features/client/cookerBooking/cookerList/types";

const mapToCookerProfile = (cook: Cook): CookerProfile => ({
  id: cook.id,
  userId: cook.user.id,
  firstName: cook.user.firstName,
  lastName: cook.user.lastName,
  photoUrl: cook.user.thumbnail ?? cook.images[0]?.imgUrl ?? null,
  description: cook.description,
  speciality: cook.speciality,
  hourlyRate: cook.hourlyRate,
});

export const useCookerProfile = (cookId: string) => {
  const { token } = useAuth();
  const [state, setState] = useState<CookerProfileState>({ status: "loading" });

  const load = useCallback(async () => {
    if (!cookId) {
      setState({ status: "not_found" });
      return;
    }
    setState({ status: "loading" });
    try {
      const cook = await getCook(cookId, token!);
      setState({ status: "success", cook: mapToCookerProfile(cook) });
    } catch (err) {
      if (err instanceof NotFoundError) {
        setState({ status: "not_found" });
      } else {
        setState({ status: "error" });
      }
    }
  }, [cookId]);

  useEffect(() => {
    load();
  }, [load]);

  return { state, retry: load };
};
