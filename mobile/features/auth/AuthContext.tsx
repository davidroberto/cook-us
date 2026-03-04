import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "expo-router";
import type { AuthUser } from "@/features/auth/login/types";

const STORAGE_KEY_TOKEN = "auth_token";
const STORAGE_KEY_USER = "auth_user";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

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
  const router = useRouter();
  const hasLoggedOut = useRef(false);

  function clearAuth() {
    setToken(null);
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
    AsyncStorage.removeItem(STORAGE_KEY_USER);
  }

  function handleTokenExpired() {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;
    clearAuth();
    router.replace("/login");
  }

  useEffect(() => {
    async function restore() {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_TOKEN),
        AsyncStorage.getItem(STORAGE_KEY_USER),
      ]);

      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // corrupted data — ignore
          }
        }
      } else if (storedToken) {
        // Token expiré → on nettoie le storage
        AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
        AsyncStorage.removeItem(STORAGE_KEY_USER);
      }

      setIsReady(true);
    }
    restore();
  }, []);

  // Vérifie périodiquement si le token est expiré (toutes les 30s)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        handleTokenExpired();
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [token]);

  function setAuth(t: string, u: AuthUser) {
    hasLoggedOut.current = false;
    setToken(t);
    setUser(u);
    AsyncStorage.setItem(STORAGE_KEY_TOKEN, t);
    AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(u));
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
