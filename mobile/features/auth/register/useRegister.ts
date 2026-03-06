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
  if (command.role === "cook" && !command.cookProfile?.speciality)
    throw new Error("La spécialité est requise pour un compte cuisinier.");
  if (command.role === "cook" && !command.cookProfile?.city?.trim())
    throw new Error("La ville est requise pour un compte cuisinier.");
}

function getMimeType(uri: string): string {
  const ext = uri.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    heic: "image/heic",
    heif: "image/heif",
    webp: "image/webp",
  };
  return mimeTypes[ext ?? ""] ?? "image/jpeg";
}

async function uploadThumbnail(uri: string, token: string): Promise<string> {
  const mimeType = getMimeType(uri);
  const filename = uri.split("/").pop() ?? "profile.jpg";
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: mimeType,
    name: filename,
  } as unknown as Blob);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Upload échoué (${response.status})${body ? ": " + body : ""}`
    );
  }

  const data = (await response.json()) as { url: string };
  const relativeUrl = data.url;
  if (relativeUrl.startsWith("http")) return relativeUrl;
  const baseUrl = API_URL.replace(/\/api$/, "");
  return `${baseUrl}${relativeUrl}`;
}

async function patchThumbnail(
  thumbnailUrl: string,
  token: string,
  role: string
): Promise<void> {
  await fetch(`${API_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ thumbnail: thumbnailUrl }),
  });

  if (role === "cook") {
    await fetch(`${API_URL}/cook/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ photoUrl: thumbnailUrl }),
    });
  }
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

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...command, thumbnail: undefined }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message ??
            "Une erreur est survenue lors de l'inscription."
        );
      }

      const authData = (await response.json()) as AuthResponse;

      if (command.thumbnail) {
        try {
          const thumbnailUrl = await uploadThumbnail(
            command.thumbnail,
            authData.token
          );
          await patchThumbnail(thumbnailUrl, authData.token, command.role);
        } catch (uploadErr) {
          console.warn("Upload photo échoué, inscription sans photo:", uploadErr);
        }
      }

      return authData;
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
