import { useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { getApiUrl } from "@/features/api/getApiUrl";
import type { AuthResponse } from "@/features/auth/login/types";

WebBrowser.maybeCompleteAuthSession();

const API_URL = getApiUrl();

const WEB_CLIENT_ID =
  "23048309381-rs777825pp3nult0ku2qsqor24c3eb0f.apps.googleusercontent.com";

export type GoogleUser = {
  email: string;
  firstName: string;
  lastName: string;
  thumbnail: string | null;
};

export type GoogleAuthResult =
  | { type: "authenticated"; response: AuthResponse }
  | { type: "needsRegistration"; googleUser: GoogleUser; idToken: string }
  | { type: "error"; message: string }
  | { type: "cancelled" };

export type CookProfile = {
  speciality: string;
  siret: string;
  city: string;
  description?: string;
  hourlyRate?: number;
};

async function callGoogleEndpoint(
  idToken: string,
  role?: "client" | "cook",
  cookProfile?: CookProfile
): Promise<GoogleAuthResult> {
  try {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken,
        ...(role && { role }),
        ...(cookProfile && { cookProfile }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        type: "error",
        message:
          (errorData as { message?: string }).message ??
          "Erreur lors de la connexion Google.",
      };
    }

    const data = await response.json();

    if (data.needsRegistration) {
      return {
        type: "needsRegistration",
        googleUser: data.googleUser,
        idToken,
      };
    }

    return { type: "authenticated", response: data as AuthResponse };
  } catch {
    return { type: "error", message: "Impossible de contacter le serveur." };
  }
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, , promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    androidClientId: WEB_CLIENT_ID,
    iosClientId: WEB_CLIENT_ID,
    redirectUri: "https://auth.expo.io/@mdorizon/cook-us",
  });

  async function signInWithGoogle(): Promise<GoogleAuthResult> {
    setIsLoading(true);
    setError(null);

    try {
      const result = await promptAsync();

      if (result.type !== "success") {
        return { type: "cancelled" };
      }

      const idToken = result.authentication?.idToken;
      if (!idToken) {
        return {
          type: "error",
          message: "Impossible de récupérer le token Google.",
        };
      }

      return await callGoogleEndpoint(idToken);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur inattendue.";
      setError(message);
      return { type: "error", message };
    } finally {
      setIsLoading(false);
    }
  }

  async function completeGoogleRegistration(
    idToken: string,
    role: "client" | "cook",
    cookProfile?: CookProfile
  ): Promise<GoogleAuthResult> {
    setIsLoading(true);
    setError(null);

    try {
      return await callGoogleEndpoint(idToken, role, cookProfile);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur inattendue.";
      setError(message);
      return { type: "error", message };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    signInWithGoogle,
    completeGoogleRegistration,
    isLoading,
    error,
    isReady: !!request,
  };
}
