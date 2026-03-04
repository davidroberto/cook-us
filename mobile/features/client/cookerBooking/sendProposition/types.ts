export type MealType = "breakfast" | "lunch" | "dinner";

export type SendPropositionCommand = {
  cookId: string;
  cookUserId: number;
  numberOfGuests: number;
  startDate: string;
  mealType: MealType;
  message?: string;
};

export type CreatedCookRequest = {
  id: number;
  cookId: string;
  guestsNumber: number;
  startDate: string;
  endDate: string | null;
  conversationId: number;
};

export type Proposition = {
  id: string;
  cookId: string;
  numberOfGuests: number;
  date: string;
  speciality: string;
  submittedAt: string;
};
