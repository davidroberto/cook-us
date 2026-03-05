export type LoginCommand = {
  email: string;
  password: string;
  expoPushToken?: string;
};

export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "client" | "cook";
  siret?: string | null;
  address?: {
    street: string | null;
    postalCode: string | null;
    city: string | null;
  } | null;
  thumbnail?: string | null;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: AuthUser;
};
