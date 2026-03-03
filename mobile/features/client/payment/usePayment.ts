import { useState } from "react";
import type { PaymentCommand, PaymentState } from "./types";

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

export function usePayment() {
  const [state, setState] = useState<PaymentState>({ status: "idle" });

  const pay = (command: PaymentCommand): void => {
    const validationError = validatePaymentCommand(command);
    if (validationError) {
      setState({ status: "error", message: validationError });
      return;
    }

    setState({ status: "loading" });

    setTimeout(() => {
      setState({ status: "success" });
    }, 1500);
  };

  return { state, pay };
}
