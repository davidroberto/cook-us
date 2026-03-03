export type SendPropositionCommand = {
  cookId: string;
  numberOfGuests: number;
  startDate: string;
  endDate: string;
};

export type Proposition = {
  id: string;
  cookId: string;
  numberOfGuests: number;
  date: string;
  speciality: string;
  submittedAt: string;
};
