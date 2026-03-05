import { useState } from "react";
import type { AuthResponse, RegisterCommand } from "./types";

import { getApiUrl } from "@/features/api/getApiUrl";

const API_URL = getApiUrl();

function validateCommand(command: RegisterCommand): void {
  if (!command.firstName.trim()) throw new Error("Le prénom est requis.");
  if (!command.lastName.trim()) throw new Error("Le nom est requis.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(command.email))
    throw new Error("L'adresse email est invalide.");
  if (command.password.length < 6)
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
  if (command.role === "client") {
    if (!command.street?.trim()) throw new Error("La rue est requise.");
    if (!command.postalCode?.trim()) throw new Error("Le code postal est requis.");
    if (!command.city?.trim()) throw new Error("La ville est requise.");
  }
  if (command.role === "cook" && !command.cookProfile?.speciality)
    throw new Error("La spécialité est requise pour un compte cuisinier.");
}

async function uploadThumbnail(uri: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "profile.jpg",
  } as unknown as Blob);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Impossible de télécharger la photo de profil.");
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}

export function useRegister() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (
    command: RegisterCommand
  ): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      validateCommand(command);

      let thumbnailUrl: string | undefined = undefined;
      if (command.thumbnail) {
        thumbnailUrl = await uploadThumbnail(command.thumbnail);
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...command, thumbnail: thumbnailUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message ??
            "Une erreur est survenue lors de l'inscription."
        );
      }

      return (await response.json()) as AuthResponse;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue est survenue."
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, register };
}
