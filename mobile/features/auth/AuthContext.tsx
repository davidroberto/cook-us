import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: (t) => setTokenState(t),
        clearToken: () => setTokenState(null),
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
