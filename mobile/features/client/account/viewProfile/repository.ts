import type { AuthUser } from "@/features/auth/login/types";
import { getApiUrl } from "@/features/api/getApiUrl";

const apiFetch = async <T>(
  url: string,
  token: string,
  options: RequestInit
): Promise<T> => {
  const res = await fetch(`${getApiUrl()}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Erreur réseau");
  }
  return res.json() as Promise<T>;
};

export const getProfile = (token: string): Promise<AuthUser> =>
  apiFetch<AuthUser>("/auth/me", token, { method: "GET" });

export const updateProfile = (
  token: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    street?: string | null;
    postalCode?: string | null;
    city?: string | null;
  }
): Promise<AuthUser> =>
  apiFetch<AuthUser>("/auth/me", token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const changePassword = (
  token: string,
  data: { currentPassword: string; newPassword: string }
): Promise<{ message: string }> =>
  apiFetch<{ message: string }>("/auth/change-password", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
