import { useState } from "react";
import type { AuthResponse, LoginCommand } from "./types";

import { getApiUrl } from "@/features/api/getApiUrl";

const API_URL = getApiUrl();

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (command: LoginCommand): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message ?? "Identifiants invalides."
        );
      }

      return (await response.json()) as AuthResponse;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inattendue est survenue."
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, login };
}
