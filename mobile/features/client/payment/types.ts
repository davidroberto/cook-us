export type PaymentCommand = {
  cardNumber: string;
  expiryDate: string; // MM/AA
  cvv: string;
};

export type PaymentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };
