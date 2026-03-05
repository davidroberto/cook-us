import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getApiUrl } from "@/features/api/getApiUrl";
import { getCook, NotFoundError } from "./repository";
import type { CookerProfile, CookerProfileState } from "./types";
import type { Cook } from "@/features/client/cookerBooking/cookerList/types";

const toAbsoluteUrl = (path: string): string => {
  if (path.startsWith("http")) return path;
  const baseUrl = getApiUrl().replace(/\/api$/, "");
  return `${baseUrl}${path}`;
};

const mapToCookerProfile = (cook: Cook): CookerProfile => {
  const rawPhoto = cook.user.thumbnail ?? cook.photoUrl ?? null;
  return {
    id: cook.id,
    userId: cook.user.id,
    firstName: cook.user.firstName,
    lastName: cook.user.lastName,
    photoUrl: rawPhoto ? toAbsoluteUrl(rawPhoto) : null,
    description: cook.description,
    speciality: cook.speciality,
    hourlyRate: cook.hourlyRate,
    images: cook.images.map((img) => ({
      id: img.id,
      url: toAbsoluteUrl(img.imgUrl),
      description: img.description,
    })),
  };
};

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
