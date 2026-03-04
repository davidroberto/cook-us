import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { COOK_REQUEST_MESSAGE_PREFIX } from "@/features/messaging/useConversation";
import { getApiUrl } from "@/features/api/getApiUrl";
import type { CreatedCookRequest, SendPropositionCommand } from "./types";

const BASE_URL = getApiUrl();
const API_URL = `${BASE_URL}/cook-request`;

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
    throw new Error("Le nombre de convives doit être un entier supérieur à 0.");
  }
  if (!isValidDateString(command.startDate)) {
    throw new Error("La date de début doit être au format JJ-MM-AAAA.");
  }
  if (!isDateTodayOrFuture(command.startDate)) {
    throw new Error("La date de début doit être aujourd'hui ou dans le futur.");
  }
  if (!command.mealType) {
    throw new Error("Le type de repas est requis.");
  }
}

export function useSendProposition() {
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendProposition = async (
    command: SendPropositionCommand
  ): Promise<{ conversationId: number } | null> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      validateCommand(command);

      const cookRequestResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          guestsNumber: command.numberOfGuests,
          startDate: parseDDMMYYYY(command.startDate).toISOString(),
          endDate: null,
          cookId: command.cookId,
          mealType: command.mealType,
          message: command.message || undefined,
        }),
      });

      if (!cookRequestResponse.ok) {
        const errorData = await cookRequestResponse.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message ??
            "Une erreur est survenue lors de l'envoi de la proposition."
        );
      }

      const createdRequest: CreatedCookRequest = await cookRequestResponse.json();
      const conversationId = createdRequest.conversationId;

      await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message:
            COOK_REQUEST_MESSAGE_PREFIX +
            JSON.stringify({
              startDate: command.startDate,
              guestsNumber: command.numberOfGuests,
              mealType: command.mealType,
              message: command.message || undefined,
              cookRequestId: createdRequest.id,
            }),
        }),
      });

      setIsSuccess(true);
      return { conversationId };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inattendue est survenue."
      );
      setIsSuccess(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, isSuccess, sendProposition };
}
