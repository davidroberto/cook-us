import { fireEvent, render, screen } from "@testing-library/react-native";
import { SendPropositionForm } from "../components/SendPropositionForm";
import { useSendProposition } from "../useSendProposition";

jest.mock("../useSendProposition");

const BASE_PROPS = {
  cookId: "cook-1",
  cookFirstName: "Marie",
  cookLastName: "Dupont",
  cookSpeciality: "Gastronomie française",
};

const mockSendProposition = jest.fn();

describe("SendPropositionForm", () => {
  beforeEach(() => {
    (useSendProposition as jest.Mock).mockReturnValue({
      error: null,
      isLoading: false,
      isSuccess: false,
      sendProposition: mockSendProposition,
    });
  });

  // --- Affichage ---

  it("affiche le nom complet du cuisinier", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    expect(screen.getByTestId("cook-name")).toHaveTextContent("Marie Dupont");
  });

  it("affiche la spécialité du cuisinier", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    expect(screen.getByTestId("cook-speciality")).toHaveTextContent(
      "Gastronomie française",
    );
  });

  it("affiche le champ nombre de convives avec son placeholder", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    const input = screen.getByTestId("number-of-guests-input");
    expect(input.props.placeholder).toBe("Ex : 4");
  });

  it("affiche le champ date de début avec son placeholder", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    const input = screen.getByTestId("start-date-input");
    expect(input.props.placeholder).toBe("JJ-MM-AAAA");
  });

  it("affiche le champ date de fin avec son placeholder", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    const input = screen.getByTestId("end-date-input");
    expect(input.props.placeholder).toBe("JJ-MM-AAAA");
  });

  it("affiche le bouton d'envoi", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    expect(screen.getByTestId("submit-button")).toBeTruthy();
    expect(screen.getByText("Envoyer la proposition")).toBeTruthy();
  });

  // --- Interactions ---

  it("met à jour le champ nombre de convives", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    fireEvent.changeText(screen.getByTestId("number-of-guests-input"), "8");
    expect(screen.getByTestId("number-of-guests-input").props.value).toBe("8");
  });

  it("n'accepte pas de lettres dans le champ nombre de convives", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    fireEvent.changeText(screen.getByTestId("number-of-guests-input"), "abc");
    expect(screen.getByTestId("number-of-guests-input").props.value).toBe("");
  });

  it("met à jour le champ date de début", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    fireEvent.changeText(screen.getByTestId("start-date-input"), "15-06-2026");
    expect(screen.getByTestId("start-date-input").props.value).toBe("15-06-2026");
  });

  it("met à jour le champ date de fin", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    fireEvent.changeText(screen.getByTestId("end-date-input"), "16-06-2026");
    expect(screen.getByTestId("end-date-input").props.value).toBe("16-06-2026");
  });

  it("appelle sendProposition avec les bonnes données au clic sur le bouton", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    fireEvent.changeText(screen.getByTestId("number-of-guests-input"), "4");
    fireEvent.changeText(screen.getByTestId("start-date-input"), "15-06-2026");
    fireEvent.changeText(screen.getByTestId("end-date-input"), "16-06-2026");
    fireEvent.press(screen.getByTestId("submit-button"));
    expect(mockSendProposition).toHaveBeenCalledWith({
      cookId: "cook-1",
      numberOfGuests: 4,
      startDate: "15-06-2026",
      endDate: "16-06-2026",
    });
  });

  // --- États du hook ---

  it("affiche un spinner et désactive le bouton pendant le chargement", () => {
    (useSendProposition as jest.Mock).mockReturnValue({
      error: null,
      isLoading: true,
      isSuccess: false,
      sendProposition: mockSendProposition,
    });
    render(<SendPropositionForm {...BASE_PROPS} />);
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    expect(screen.queryByText("Envoyer la proposition")).toBeNull();
    expect(screen.getByTestId("submit-button")).toBeDisabled();
  });

  it("affiche la bannière de succès après envoi réussi", () => {
    (useSendProposition as jest.Mock).mockReturnValue({
      error: null,
      isLoading: false,
      isSuccess: true,
      sendProposition: mockSendProposition,
    });
    render(<SendPropositionForm {...BASE_PROPS} />);
    expect(screen.getByTestId("success-message")).toBeTruthy();
    expect(screen.getByText("Proposition envoyée avec succès !")).toBeTruthy();
  });

  it("affiche la bannière d'erreur avec le message correspondant", () => {
    (useSendProposition as jest.Mock).mockReturnValue({
      error: "La date doit être au format JJ-MM-AAAA.",
      isLoading: false,
      isSuccess: false,
      sendProposition: mockSendProposition,
    });
    render(<SendPropositionForm {...BASE_PROPS} />);
    expect(screen.getByTestId("error-message")).toBeTruthy();
    expect(
      screen.getByText("La date doit être au format JJ-MM-AAAA."),
    ).toBeTruthy();
  });

  it("n'affiche pas de bannière d'erreur ni de succès par défaut", () => {
    render(<SendPropositionForm {...BASE_PROPS} />);
    expect(screen.queryByTestId("error-message")).toBeNull();
    expect(screen.queryByTestId("success-message")).toBeNull();
  });
});
