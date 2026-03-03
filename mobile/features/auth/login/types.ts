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
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
