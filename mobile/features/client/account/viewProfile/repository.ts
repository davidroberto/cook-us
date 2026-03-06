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

function getMimeType(uri: string): string {
  const ext = uri.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    heic: "image/heic",
    heif: "image/heif",
    webp: "image/webp",
  };
  return mimeTypes[ext ?? ""] ?? "image/jpeg";
}

export const uploadProfileThumbnail = async (token: string, uri: string): Promise<string> => {
  const mimeType = getMimeType(uri);
  const filename = uri.split("/").pop() ?? "profile.jpg";
  const formData = new FormData();
  formData.append("file", { uri, type: mimeType, name: filename } as unknown as Blob);

  const response = await fetch(`${getApiUrl()}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Upload échoué (${response.status})${body ? ": " + body : ""}`);
  }

  const data = (await response.json()) as { url: string };
  const relativeUrl = data.url;
  if (relativeUrl.startsWith("http")) return relativeUrl;
  const baseUrl = getApiUrl().replace(/\/api$/, "");
  return `${baseUrl}${relativeUrl}`;
};

export const getProfile = (token: string): Promise<AuthUser> =>
  apiFetch<AuthUser>("/auth/me", token, { method: "GET" });

export const updateProfile = (
  token: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    thumbnail?: string | null;
    street?: string;
    postalCode?: string;
    city?: string;
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
