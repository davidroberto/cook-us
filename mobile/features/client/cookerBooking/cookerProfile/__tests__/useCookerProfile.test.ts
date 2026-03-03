import { act, renderHook } from "@testing-library/react-native";
import { useCookerProfile } from "../useCookerProfile";
import * as repository from "../repository";
import { NotFoundError } from "../repository";
import type { Cook } from "@/features/client/cookerBooking/cookerList/types";

jest.mock("@/features/auth/AuthContext", () => ({
  useAuth: () => ({ token: "fake-token", user: { id: 1 }, isReady: true }),
}));

const MOCK_COOK: Cook = {
  id: "cook-1",
  userId: 1,
  description: "Cuisinière passionnée spécialisée dans la gastronomie française.",
  speciality: "french",
  hourlyRate: 35,
  photoUrl: null,
  isActive: true,
  isValidated: true,
  user: {
    id: 1,
    firstName: "Marie",
    lastName: "Dupont",
    email: "marie@test.com",
    thumbnail: null,
    role: "cook",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  images: [],
};

describe("useCookerProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("démarre en état loading", () => {
    jest.spyOn(repository, "getCook").mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCookerProfile("cook-1"));
    expect(result.current.state.status).toBe("loading");
  });

  it("passe en success avec les données du cuisinier après chargement", async () => {
    jest.spyOn(repository, "getCook").mockResolvedValue(MOCK_COOK);
    const { result } = renderHook(() => useCookerProfile("cook-1"));

    await act(async () => {});

    expect(result.current.state.status).toBe("success");
    if (result.current.state.status === "success") {
      expect(result.current.state.cook.id).toBe("cook-1");
    }
  });

  it('passe en not_found pour le cookId "not-found"', async () => {
    jest.spyOn(repository, "getCook").mockRejectedValue(new NotFoundError());
    const { result } = renderHook(() => useCookerProfile("not-found"));

    await act(async () => {});

    expect(result.current.state.status).toBe("not_found");
  });

  it('passe en error pour le cookId "error"', async () => {
    jest.spyOn(repository, "getCook").mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useCookerProfile("error"));

    await act(async () => {});

    expect(result.current.state.status).toBe("error");
  });

  it("passe en not_found immédiatement pour un cookId vide", async () => {
    const { result } = renderHook(() => useCookerProfile(""));

    await act(async () => {});

    expect(result.current.state.status).toBe("not_found");
  });

  it("retry repasse en loading puis error", async () => {
    jest.spyOn(repository, "getCook").mockRejectedValue(new Error("error"));
    const { result } = renderHook(() => useCookerProfile("error"));

    await act(async () => {});
    expect(result.current.state.status).toBe("error");

    act(() => {
      result.current.retry();
    });
    expect(result.current.state.status).toBe("loading");
  });

  it("retry recharge les données en success", async () => {
    jest.spyOn(repository, "getCook").mockResolvedValue(MOCK_COOK);
    const { result } = renderHook(() => useCookerProfile("cook-1"));

    await act(async () => {});
    expect(result.current.state.status).toBe("success");

    act(() => {
      result.current.retry();
    });
    expect(result.current.state.status).toBe("loading");

    await act(async () => {});
    expect(result.current.state.status).toBe("success");
  });
});
