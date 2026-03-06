import { useState } from "react";
import type { PaymentCommand, PaymentState } from "./types";
import { getApiUrl } from "@/features/api/getApiUrl";

const API_URL = getApiUrl();

function validatePaymentCommand(command: PaymentCommand): string | null {
  const digits = command.cardNumber.replace(/\s/g, "");
  if (!/^\d{16}$/.test(digits)) {
    return "Numéro de carte invalide (16 chiffres requis).";
  }
  if (!/^\d{2}\/\d{2}$/.test(command.expiryDate)) {
    return "Date d'expiration invalide (format MM/AA requis).";
  }
  if (!/^\d{3}$/.test(command.cvv)) {
    return "CVV invalide (3 chiffres requis).";
  }
  return null;
}

export function usePayment(cookRequestId: string, token: string | null) {
  const [state, setState] = useState<PaymentState>({ status: "idle" });

  const pay = async (command: PaymentCommand): Promise<void> => {
    const validationError = validatePaymentCommand(command);
    if (validationError) {
      setState({ status: "error", message: validationError });
      return;
    }

    setState({ status: "loading" });

    try {
      const response = await fetch(
        `${API_URL}/cook-request/${cookRequestId}/pay`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.message ?? "Une erreur est survenue lors du paiement."
        );
      }

      setState({ status: "success" });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors du paiement.",
      });
    }
  };

  return { state, pay };
}
