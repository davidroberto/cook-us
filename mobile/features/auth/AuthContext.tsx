import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "@/features/auth/login/types";

const STORAGE_KEY_TOKEN = "auth_token";
const STORAGE_KEY_USER = "auth_user";

type AuthContextType = {
  token: string | null;
  user: AuthUser | null;
  isReady: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function restore() {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_TOKEN),
        AsyncStorage.getItem(STORAGE_KEY_USER),
      ]);
      if (storedToken) setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // corrupted data — ignore
        }
      }
      setIsReady(true);
    }
    restore();
  }, []);

  function setAuth(t: string, u: AuthUser) {
    setToken(t);
    setUser(u);
    AsyncStorage.setItem(STORAGE_KEY_TOKEN, t);
    AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(u));
  }

  function clearAuth() {
    setToken(null);
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
    AsyncStorage.removeItem(STORAGE_KEY_USER);
  }

  return (
    <AuthContext.Provider value={{ token, user, isReady, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
