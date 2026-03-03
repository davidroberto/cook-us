import { fireEvent, render, screen } from "@testing-library/react-native";
import { ProfileCard } from "../components/ProfileCard";
import type { CookerProfile } from "../types";

const BASE_COOK: CookerProfile = {
  id: "cook-test-1",
  firstName: "Marie",
  lastName: "Dupont",
  photoUrl: "https://example.com/photo.jpg",
  description:
    "Cuisinière passionnée spécialisée dans la gastronomie française.",
  speciality: "Gastronomie française",
  hourlyRate: 35,
};

describe("ProfileCard", () => {
  it("affiche le nom complet du cuisinier", () => {
    render(<ProfileCard cook={BASE_COOK} onProposeCreneau={jest.fn()} />);
    expect(screen.getByTestId("profile-name")).toHaveTextContent(
      "Marie Dupont",
    );
  });

  it("affiche la spécialité", () => {
    render(<ProfileCard cook={BASE_COOK} onProposeCreneau={jest.fn()} />);
    expect(screen.getByTestId("profile-speciality")).toHaveTextContent(
      "Gastronomie française",
    );
  });

  it("affiche le tarif horaire au format X€/h", () => {
    render(<ProfileCard cook={BASE_COOK} onProposeCreneau={jest.fn()} />);
    expect(screen.getByTestId("profile-rate")).toHaveTextContent("35€/h");
  });

  it('affiche "Tarif sur demande" quand hourlyRate est null', () => {
    render(
      <ProfileCard
        cook={{ ...BASE_COOK, hourlyRate: null }}
        onProposeCreneau={jest.fn()}
      />,
    );
    expect(screen.getByTestId("profile-rate")).toHaveTextContent(
      "Tarif sur demande",
    );
  });

  it("affiche la description quand elle est renseignée", () => {
    render(<ProfileCard cook={BASE_COOK} onProposeCreneau={jest.fn()} />);
    expect(screen.getByTestId("profile-description")).toHaveTextContent(
      /Cuisinière passionnée/,
    );
  });

  it("masque la description quand elle est null", () => {
    render(
      <ProfileCard
        cook={{ ...BASE_COOK, description: null }}
        onProposeCreneau={jest.fn()}
      />,
    );
    expect(screen.queryByTestId("profile-description")).toBeNull();
  });

  it("affiche l'image avec la bonne source quand photoUrl est fourni", () => {
    render(<ProfileCard cook={BASE_COOK} onProposeCreneau={jest.fn()} />);
    const image = screen.getByTestId("profile-avatar");
    expect(image.props.source).toEqual({
      uri: "https://example.com/photo.jpg",
    });
  });

  it("affiche les initiales quand photoUrl est null", () => {
    render(
      <ProfileCard
        cook={{ ...BASE_COOK, photoUrl: null }}
        onProposeCreneau={jest.fn()}
      />,
    );
    expect(screen.queryByTestId("profile-avatar")).toBeNull();
    expect(screen.getByTestId("profile-avatar-fallback")).toBeTruthy();
    expect(screen.getByText("MD")).toBeTruthy();
  });

  it("affiche le bouton Proposer un créneau", () => {
    render(<ProfileCard cook={BASE_COOK} onProposeCreneau={jest.fn()} />);
    expect(screen.getByTestId("propose-creneau-button")).toBeTruthy();
  });

  it("appelle onProposeCreneau au clic sur le bouton", () => {
    const onProposeCreneau = jest.fn();
    render(
      <ProfileCard cook={BASE_COOK} onProposeCreneau={onProposeCreneau} />,
    );
    fireEvent.press(screen.getByTestId("propose-creneau-button"));
    expect(onProposeCreneau).toHaveBeenCalledTimes(1);
  });

  it("a le testID profile-card sur le conteneur", () => {
    render(<ProfileCard cook={BASE_COOK} onProposeCreneau={jest.fn()} />);
    expect(screen.getByTestId("profile-card")).toBeTruthy();
  });
});
