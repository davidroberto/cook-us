export interface TransactionItem {
  id: number;
  startDate: string;
  endDate: string | null;
  guestsNumber: number;
  mealType: string;
  totalPaid: number | null;
  cook: {
    id: string;
    firstName: string;
    lastName: string;
    speciality: string;
  };
}
