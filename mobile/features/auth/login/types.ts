export type LoginCommand = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "client" | "cook";
  siret?: string | null;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: AuthUser;
};
