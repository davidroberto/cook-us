import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { getApiUrl } from "@/features/api/getApiUrl";

const API_URL = getApiUrl();

export interface CalendarRequest {
  id: number;
  date: string; // YYYY-MM-DD
  status: "pending" | "accepted";
}

export interface CookCalendarData {
  requests: CalendarRequest[];
  blockedDates: string[]; // YYYY-MM-DD[]
}

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: CookCalendarData };

export function useCookCalendar(year: number, month: number) {
  const { token } = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });

  const fetch_ = useCallback(async () => {
    if (!token) return;
    setState({ status: "loading" });
    try {
      const res = await fetch(
        `${API_URL}/cook/me/calendar?year=${year}&month=${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      const data: CookCalendarData = await res.json();
      setState({ status: "success", data });
    } catch {
      setState({ status: "error", message: "Impossible de charger le calendrier." });
    }
  }, [token, year, month]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  const blockDate = async (date: string) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/cook/me/unavailabilities`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { message?: string }).message ?? "Impossible de bloquer cette date.");
    }
    await fetch_();
  };

  const unblockDate = async (date: string) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/cook/me/unavailabilities/${date}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error("Impossible de débloquer cette date.");
    }
    await fetch_();
  };

  return { state, refresh: fetch_, blockDate, unblockDate };
}
