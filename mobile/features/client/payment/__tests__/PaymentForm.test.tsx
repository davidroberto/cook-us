import { fireEvent, render, screen } from "@testing-library/react-native";
import { PaymentForm } from "../components/PaymentForm";
import { usePayment } from "../usePayment";

jest.mock("../usePayment");

const mockGoHome = jest.fn();

const BASE_PROPS = {
  cookRequestId: "1",
  amount: 150,
  cookFirstName: "Marie",
  cookLastName: "Dupont",
  startDate: "15-06-2026",
  endDate: "15-06-2026",
  onGoHome: mockGoHome,
};

const mockPay = jest.fn();

describe("PaymentForm", () => {
  beforeEach(() => {
    (usePayment as jest.Mock).mockReturnValue({
      state: { status: "idle" },
      pay: mockPay,
    });
  });

  // --- Affichage ---

  it("affiche OrderSummary avec les props correctes", () => {
    render(<PaymentForm {...BASE_PROPS} />);
    expect(screen.getByTestId("order-summary")).toBeTruthy();
    expect(screen.getByTestId("order-amount")).toHaveTextContent("150 €");
    expect(screen.getByTestId("order-cook")).toHaveTextContent("Marie Dupont");
  });

  it("affiche les 3 champs carte", () => {
    render(<PaymentForm {...BASE_PROPS} />);
    expect(screen.getByTestId("card-number-input")).toBeTruthy();
    expect(screen.getByTestId("expiry-input")).toBeTruthy();
    expect(screen.getByTestId("cvv-input")).toBeTruthy();
  });

  it('affiche le bouton "Valider le paiement"', () => {
    render(<PaymentForm {...BASE_PROPS} />);
    expect(screen.getByTestId("pay-button")).toBeTruthy();
    expect(screen.getByText("Valider le paiement")).toBeTruthy();
  });

  it("n'affiche pas de bannière d'erreur ni l'écran de succès par défaut", () => {
    render(<PaymentForm {...BASE_PROPS} />);
    expect(screen.queryByTestId("error-message")).toBeNull();
    expect(screen.queryByTestId("payment-success")).toBeNull();
  });

  // --- États du hook ---

  it("affiche un spinner et désactive le bouton pendant le chargement", () => {
    (usePayment as jest.Mock).mockReturnValue({
      state: { status: "loading" },
      pay: mockPay,
    });
    render(<PaymentForm {...BASE_PROPS} />);
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    expect(screen.queryByText("Valider le paiement")).toBeNull();
    expect(screen.getByTestId("pay-button")).toBeDisabled();
  });

  it("affiche l'écran de confirmation avec le bouton retour quand status = success", () => {
    (usePayment as jest.Mock).mockReturnValue({
      state: { status: "success" },
      pay: mockPay,
    });
    render(<PaymentForm {...BASE_PROPS} />);
    expect(screen.getByTestId("payment-success")).toBeTruthy();
    expect(screen.getByTestId("go-home-button")).toBeTruthy();
    expect(screen.getByText("Retour à l'accueil")).toBeTruthy();
  });

  it("appelle onGoHome au clic sur le bouton retour", () => {
    (usePayment as jest.Mock).mockReturnValue({
      state: { status: "success" },
      pay: mockPay,
    });
    render(<PaymentForm {...BASE_PROPS} />);
    fireEvent.press(screen.getByTestId("go-home-button"));
    expect(mockGoHome).toHaveBeenCalledTimes(1);
  });

  it("affiche error-message avec le message quand status = error", () => {
    (usePayment as jest.Mock).mockReturnValue({
      state: { status: "error", message: "Numéro de carte invalide (16 chiffres requis)." },
      pay: mockPay,
    });
    render(<PaymentForm {...BASE_PROPS} />);
    expect(screen.getByTestId("error-message")).toBeTruthy();
    expect(
      screen.getByText("Numéro de carte invalide (16 chiffres requis)."),
    ).toBeTruthy();
  });

  // --- Interactions ---

  it("appelle pay() avec les bonnes valeurs au clic", () => {
    render(<PaymentForm {...BASE_PROPS} />);
    fireEvent.changeText(screen.getByTestId("card-number-input"), "4242 4242 4242 4242");
    fireEvent.changeText(screen.getByTestId("expiry-input"), "12/25");
    fireEvent.changeText(screen.getByTestId("cvv-input"), "123");
    fireEvent.press(screen.getByTestId("pay-button"));
    expect(mockPay).toHaveBeenCalledWith({
      cardNumber: "4242 4242 4242 4242",
      expiryDate: "12/25",
      cvv: "123",
    });
  });
});
