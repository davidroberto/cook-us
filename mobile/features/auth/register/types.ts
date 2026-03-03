export type CookSpeciality =
  | "french_cooking"
  | "italian_cooking"
  | "asian_cooking"
  | "mexican_cooking"
  | "vegetarian_cooking"
  | "pastry_cooking"
  | "japanese_cooking"
  | "indian_cooking"
  | "autre";

export type RegisterCommand = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "client" | "cook";
  cookProfile?: {
    speciality: CookSpeciality;
  };
};

export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "client" | "cook";
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export const COOK_SPECIALITIES: { value: CookSpeciality; label: string }[] = [
  { value: "french_cooking", label: "Française" },
  { value: "italian_cooking", label: "Italienne" },
  { value: "asian_cooking", label: "Asiatique" },
  { value: "mexican_cooking", label: "Mexicaine" },
  { value: "vegetarian_cooking", label: "Végétarienne" },
  { value: "pastry_cooking", label: "Pâtisserie" },
  { value: "japanese_cooking", label: "Japonaise" },
  { value: "indian_cooking", label: "Indienne" },
  { value: "autre", label: "Autre" },
];
