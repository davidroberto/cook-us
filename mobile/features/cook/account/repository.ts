import { getApiUrl } from "@/features/api/getApiUrl";

export interface CookProfile {
  description: string | null;
  speciality: string;
  hourlyRate: number | null;
  city: string | null;
  photoUrl: string | null;
}

export interface UpdateCookProfileData {
  description?: string;
  speciality?: string;
  hourlyRate?: number;
  city?: string;
  photoUrl?: string;
}

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

export const getCookProfile = (token: string): Promise<CookProfile> =>
  apiFetch<CookProfile>("/cook/profile", token, { method: "GET" });

export const updateCookProfile = (
  token: string,
  data: UpdateCookProfileData
): Promise<CookProfile> =>
  apiFetch<CookProfile>("/cook/profile", token, {
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

export const uploadPhoto = async (
  token: string,
  uri: string
): Promise<{ url: string }> => {
  const filename = uri.split("/").pop() ?? "photo.jpg";
  const ext = filename.split(".").pop() ?? "jpg";
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  const formData = new FormData();
  formData.append("file", { uri, name: filename, type: mimeType } as unknown as Blob);

  const res = await fetch(`${getApiUrl()}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Erreur upload");
  }
  return res.json() as Promise<{ url: string }>;
};
