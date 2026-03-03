export type SendPropositionCommand = {
  cookId: string;
  numberOfGuests: number;
  date: string;
  speciality: string;
};

export type Proposition = {
  id: string;
  cookId: string;
  numberOfGuests: number;
  date: string;
  speciality: string;
  submittedAt: string;
};
