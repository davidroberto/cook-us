import { act, renderHook } from "@testing-library/react-native";
import { useCookerProfile } from "../useCookerProfile";

// Durée du délai simulé dans le fake API
const FAKE_DELAY = 1200;

describe("useCookerProfile", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("démarre en état loading", () => {
    const { result } = renderHook(() => useCookerProfile("cook-1"));
    expect(result.current.state.status).toBe("loading");
  });

  it("passe en success avec les données du cuisinier après chargement", async () => {
    const { result } = renderHook(() => useCookerProfile("cook-1"));

    await act(async () => {
      jest.advanceTimersByTime(FAKE_DELAY);
    });

    expect(result.current.state.status).toBe("success");
    if (result.current.state.status === "success") {
      expect(result.current.state.cook.id).toBe("cook-1");
    }
  });

  it('passe en not_found pour le cookId "not-found"', async () => {
    const { result } = renderHook(() => useCookerProfile("not-found"));

    await act(async () => {
      jest.advanceTimersByTime(FAKE_DELAY);
    });

    expect(result.current.state.status).toBe("not_found");
  });

  it('passe en error pour le cookId "error"', async () => {
    const { result } = renderHook(() => useCookerProfile("error"));

    await act(async () => {
      jest.advanceTimersByTime(FAKE_DELAY);
    });

    expect(result.current.state.status).toBe("error");
  });

  it("passe en not_found immédiatement pour un cookId vide", async () => {
    const { result } = renderHook(() => useCookerProfile(""));

    await act(async () => {
      jest.runAllTimers();
    });

    expect(result.current.state.status).toBe("not_found");
  });

  it("retry repasse en loading puis error", async () => {
    const { result } = renderHook(() => useCookerProfile("error"));

    // Attendre l'erreur initiale
    await act(async () => {
      jest.advanceTimersByTime(FAKE_DELAY);
    });
    expect(result.current.state.status).toBe("error");

    // Déclencher le retry → doit repasser en loading
    act(() => {
      result.current.retry();
    });
    expect(result.current.state.status).toBe("loading");
  });

  it("retry recharge les données en success", async () => {
    const { result } = renderHook(() => useCookerProfile("cook-1"));

    // Premier chargement
    await act(async () => {
      jest.advanceTimersByTime(FAKE_DELAY);
    });
    expect(result.current.state.status).toBe("success");

    // Retry
    act(() => {
      result.current.retry();
    });
    expect(result.current.state.status).toBe("loading");

    // Second chargement
    await act(async () => {
      jest.advanceTimersByTime(FAKE_DELAY);
    });
    expect(result.current.state.status).toBe("success");
  });
});
