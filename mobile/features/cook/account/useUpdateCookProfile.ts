import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import {
  getCookProfile,
  updateCookProfile,
  uploadPhoto,
  type CookProfile,
  type UpdateCookProfileData,
} from "./repository";

export function useUpdateCookProfile() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (): Promise<CookProfile | null> => {
    if (!token) return null;
    setIsLoading(true);
    setError(null);
    try {
      return await getCookProfile(token);
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const save = async (data: UpdateCookProfileData): Promise<CookProfile | null> => {
    if (!token) return null;
    setIsLoading(true);
    setError(null);
    try {
      return await updateCookProfile(token, data);
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const upload = async (uri: string): Promise<string | null> => {
    if (!token) return null;
    setIsLoading(true);
    setError(null);
    try {
      const result = await uploadPhoto(token, uri);
      return result.url;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, loadProfile, save, upload };
}
