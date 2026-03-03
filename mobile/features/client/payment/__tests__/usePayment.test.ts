import { act, renderHook } from "@testing-library/react-native";
import { usePayment } from "../usePayment";

const VALID_COMMAND = {
  cardNumber: "4242424242424242",
  expiryDate: "12/25",
  cvv: "123",
};

describe("usePayment", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("état initial = idle", () => {
    const { result } = renderHook(() => usePayment());
    expect(result.current.state.status).toBe("idle");
  });

  it("passe en loading au déclenchement", () => {
    const { result } = renderHook(() => usePayment());
    act(() => {
      result.current.pay(VALID_COMMAND);
    });
    expect(result.current.state.status).toBe("loading");
  });

  it("passe en error si cardNumber invalide (pas de délai)", () => {
    const { result } = renderHook(() => usePayment());
    act(() => {
      result.current.pay({ ...VALID_COMMAND, cardNumber: "1234" });
    });
    expect(result.current.state.status).toBe("error");
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(result.current.state.status).toBe("error");
  });

  it("passe en error si expiry invalide", () => {
    const { result } = renderHook(() => usePayment());
    act(() => {
      result.current.pay({ ...VALID_COMMAND, expiryDate: "1225" });
    });
    expect(result.current.state.status).toBe("error");
    if (result.current.state.status === "error") {
      expect(result.current.state.message).toBeTruthy();
    }
  });

  it("passe en error si CVV invalide", () => {
    const { result } = renderHook(() => usePayment());
    act(() => {
      result.current.pay({ ...VALID_COMMAND, cvv: "12" });
    });
    expect(result.current.state.status).toBe("error");
    if (result.current.state.status === "error") {
      expect(result.current.state.message).toBeTruthy();
    }
  });

  it("passe en success après 1500ms avec une carte valide", () => {
    const { result } = renderHook(() => usePayment());
    act(() => {
      result.current.pay(VALID_COMMAND);
    });
    expect(result.current.state.status).toBe("loading");
    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(result.current.state.status).toBe("success");
  });
});
