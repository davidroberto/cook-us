import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "./login/types";

type AuthContextType = {
  token: string | null;
  user: AuthUser | null;
  setToken: (token: string) => void;
  setAuth: (token: string, user: AuthUser) => void;
  clearToken: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<AuthUser | null>(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setToken: (t) => setTokenState(t),
        setAuth: (t, u) => {
          setTokenState(t);
          setUserState(u);
        },
        clearToken: () => {
          setTokenState(null);
          setUserState(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
