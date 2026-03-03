import { useState } from "react";
import type { SendPropositionCommand } from "./types";

// POUR PASSER AUX VRAIES API : changer USE_FAKE_DATA de true à false
const USE_FAKE_DATA = true;

function parseDDMMYYYY(value: string): Date {
  const [day, month, year] = value.split("-");
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

function isValidDateString(value: string): boolean {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return false;
  const [day, month, year] = value.split("-");
  const d = parseInt(day, 10);
  const m = parseInt(month, 10) - 1;
  const y = parseInt(year, 10);
  const date = new Date(y, m, d);
  return (
    !isNaN(date.getTime()) &&
    date.getDate() === d &&
    date.getMonth() === m &&
    date.getFullYear() === y
  );
}

function isDateTodayOrFuture(value: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseDDMMYYYY(value) >= today;
}

function validateCommand(command: SendPropositionCommand): void {
  if (!command.cookId) {
    throw new Error("Le cuisinier est requis.");
  }
  if (!Number.isInteger(command.numberOfGuests) || command.numberOfGuests < 1) {
    throw new Error(
      "Le nombre de convives doit être un entier supérieur à 0."
    );
  }
  if (!isValidDateString(command.date)) {
    throw new Error("La date doit être au format JJ-MM-AAAA.");
  }
  if (!isDateTodayOrFuture(command.date)) {
    throw new Error("La date doit être aujourd'hui ou dans le futur.");
  }
  if (!command.speciality) {
    throw new Error("La spécialité est requise.");
  }
}

export function useSendProposition() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendProposition = async (
    command: SendPropositionCommand
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      validateCommand(command);

      if (USE_FAKE_DATA) {
        await new Promise<void>((resolve) => setTimeout(resolve, 500));
      } else {
        const response = await fetch("http://localhost/api/propositions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(command),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            (errorData as { message?: string }).message ??
              "Une erreur est survenue lors de l'envoi de la proposition."
          );
        }
      }

      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inattendue est survenue."
      );
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, isSuccess, sendProposition };
}
