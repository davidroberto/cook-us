import { useState } from "react";
import type { SendPropositionCommand } from "./types";

const API_URL = "http://localhost:8080/api/cook-request";

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
  if (!isValidDateString(command.startDate)) {
    throw new Error("La date de début doit être au format JJ-MM-AAAA.");
  }
  if (!isDateTodayOrFuture(command.startDate)) {
    throw new Error("La date de début doit être aujourd'hui ou dans le futur.");
  }
  if (!isValidDateString(command.endDate)) {
    throw new Error("La date de fin doit être au format JJ-MM-AAAA.");
  }
  if (parseDDMMYYYY(command.endDate) < parseDDMMYYYY(command.startDate)) {
    throw new Error("La date de fin doit être après la date de début.");
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

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestsNumber: command.numberOfGuests,
          startDate: parseDDMMYYYY(command.startDate).toISOString(),
          endDate: parseDDMMYYYY(command.endDate).toISOString(),
          cookId: command.cookId,
          clientId: 1, // TODO: remplacer par l'ID de l'utilisateur authentifié
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message ??
            "Une erreur est survenue lors de l'envoi de la proposition."
        );
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
