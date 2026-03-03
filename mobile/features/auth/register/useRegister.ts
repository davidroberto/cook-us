import { useState } from "react";
import type { AuthResponse, RegisterCommand } from "./types";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost/api";

function validateCommand(command: RegisterCommand): void {
  if (!command.firstName.trim()) throw new Error("Le prénom est requis.");
  if (!command.lastName.trim()) throw new Error("Le nom est requis.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(command.email))
    throw new Error("L'adresse email est invalide.");
  if (command.password.length < 6)
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
  if (command.role === "cook" && !command.cookProfile?.speciality)
    throw new Error("La spécialité est requise pour un compte cuisinier.");
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
        body: JSON.stringify(command),
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
