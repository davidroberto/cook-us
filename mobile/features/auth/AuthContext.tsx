import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useRouter } from "expo-router";
import type { AuthUser } from "@/features/auth/login/types";
import { getApiUrl } from "@/features/api/getApiUrl";

const STORAGE_KEY_TOKEN = "auth_token";
const STORAGE_KEY_REFRESH_TOKEN = "auth_refresh_token";
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
  setAuth: (token: string, refreshToken: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  clearAuth: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const hasLoggedOut = useRef(false);
  const refreshTokenRef = useRef<string | null>(null);
  const isRefreshing = useRef(false);
  const refreshPromise = useRef<Promise<string | null> | null>(null);

  function clearAuth() {
    setToken(null);
    setUser(null);
    refreshTokenRef.current = null;
    AsyncStorage.multiRemove([
      STORAGE_KEY_TOKEN,
      STORAGE_KEY_REFRESH_TOKEN,
      STORAGE_KEY_USER,
    ]);
  }

  function handleTokenExpired() {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;
    clearAuth();
    router.replace("/login");
  }

  async function refreshAccessToken(): Promise<string | null> {
    const storedRefreshToken = refreshTokenRef.current;
    if (!storedRefreshToken) return null;

    try {
      const response = await fetch(`${getApiUrl()}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) return null;

      const data = (await response.json()) as {
        token: string;
        refreshToken: string;
      };

      setToken(data.token);
      refreshTokenRef.current = data.refreshToken;
      await AsyncStorage.multiSet([
        [STORAGE_KEY_TOKEN, data.token],
        [STORAGE_KEY_REFRESH_TOKEN, data.refreshToken],
      ]);

      return data.token;
    } catch {
      return null;
    }
  }

  async function getValidToken(): Promise<string | null> {
    if (token && !isTokenExpired(token)) return token;

    if (isRefreshing.current && refreshPromise.current) {
      return refreshPromise.current;
    }

    isRefreshing.current = true;
    refreshPromise.current = refreshAccessToken();
    const newToken = await refreshPromise.current;
    isRefreshing.current = false;
    refreshPromise.current = null;

    if (!newToken) {
      handleTokenExpired();
      return null;
    }

    return newToken;
  }

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const apiUrl = getApiUrl();
      const fullUrl = url.startsWith("http") ? url : `${apiUrl}${url}`;

      let currentToken = await getValidToken();
      if (!currentToken) {
        return new Response(null, { status: 401 });
      }

      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.status === 401) {
        currentToken = await refreshAccessToken();
        if (!currentToken) {
          handleTokenExpired();
          return response;
        }

        return fetch(fullUrl, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${currentToken}`,
          },
        });
      }

      return response;
    },
    [token],
  );

  useEffect(() => {
    async function restore() {
      const [storedToken, storedRefreshToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_TOKEN),
        AsyncStorage.getItem(STORAGE_KEY_REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEY_USER),
      ]);

      if (storedRefreshToken) {
        refreshTokenRef.current = storedRefreshToken;
      }

      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // corrupted data — ignore
          }
        }
      } else if (storedRefreshToken) {
        // Access token expiré mais refresh token disponible → refresh
        const newToken = await refreshAccessToken();
        if (newToken && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // corrupted data — ignore
          }
        } else {
          // Refresh échoué → nettoyage
          AsyncStorage.multiRemove([
            STORAGE_KEY_TOKEN,
            STORAGE_KEY_REFRESH_TOKEN,
            STORAGE_KEY_USER,
          ]);
        }
      } else if (storedToken) {
        // Token expiré, pas de refresh token → on nettoie
        AsyncStorage.multiRemove([STORAGE_KEY_TOKEN, STORAGE_KEY_USER]);
      }

      setIsReady(true);
    }
    restore();
  }, []);

  // Vérifie périodiquement si le token est expiré (toutes les 30s)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      if (isTokenExpired(token)) {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          handleTokenExpired();
        }
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [token]);

  function updateUser(u: AuthUser) {
    setUser(u);
    AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(u));
  }

  function setAuth(t: string, rt: string, u: AuthUser) {
    hasLoggedOut.current = false;
    setToken(t);
    setUser(u);
    refreshTokenRef.current = rt;
    AsyncStorage.multiSet([
      [STORAGE_KEY_TOKEN, t],
      [STORAGE_KEY_REFRESH_TOKEN, rt],
      [STORAGE_KEY_USER, JSON.stringify(u)],
    ]);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, isReady, setAuth, updateUser, clearAuth, authFetch }}
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
