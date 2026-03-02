import { render, screen } from "@testing-library/react-native";
import { CookerCard } from "../components/Card";
import type { CookerCardData } from "../types";

const BASE_COOKER: CookerCardData = {
  id: "cook-test-1",
  first_name: "Arjun",
  last_name: "Sharma",
  speciality: "indian",
  thumbnail: "https://example.com/photo.jpg",
  hourly_rate: 35,
  city: "Paris",
};

describe("CookerCard", () => {
  it("affiche le nom complet du cuisinier", () => {
    render(<CookerCard cooker={BASE_COOKER} />);
    expect(screen.getByTestId("cooker-name")).toHaveTextContent("Arjun Sharma");
  });

  it("affiche le libellé de spécialité traduit", () => {
    render(<CookerCard cooker={BASE_COOKER} />);
    expect(screen.getByTestId("cooker-speciality")).toHaveTextContent(
      "Cuisine indienne"
    );
  });

  it("affiche la ville", () => {
    render(<CookerCard cooker={BASE_COOKER} />);
    expect(screen.getByTestId("cooker-city")).toHaveTextContent("Paris");
  });

  it("affiche le tarif horaire", () => {
    render(<CookerCard cooker={BASE_COOKER} />);
    expect(screen.getByTestId("cooker-rate")).toHaveTextContent("35 €/h");
  });

  it("affiche l'image avec la bonne source quand un thumbnail est fourni", () => {
    render(<CookerCard cooker={BASE_COOKER} />);
    const image = screen.getByTestId("cooker-thumbnail");
    expect(image.props.source).toEqual({
      uri: "https://example.com/photo.jpg",
    });
  });

  it("affiche les initiales quand thumbnail est null", () => {
    const cookerWithoutPhoto: CookerCardData = {
      ...BASE_COOKER,
      thumbnail: null,
    };
    render(<CookerCard cooker={cookerWithoutPhoto} />);
    expect(screen.queryByTestId("cooker-thumbnail")).toBeNull();
    expect(screen.getByText("AS")).toBeTruthy();
  });

  it("affiche le libellé correct pour chaque spécialité", () => {
    const specialities: Array<{
      key: CookerCardData["speciality"];
      label: string;
    }> = [
      { key: "indian", label: "Cuisine indienne" },
      { key: "french", label: "Cuisine française" },
      { key: "italian", label: "Cuisine italienne" },
      { key: "japanese", label: "Cuisine japonaise" },
      { key: "mexican", label: "Cuisine mexicaine" },
    ];

    specialities.forEach(({ key, label }) => {
      const { unmount } = render(
        <CookerCard cooker={{ ...BASE_COOKER, speciality: key }} />
      );
      expect(screen.getByTestId("cooker-speciality")).toHaveTextContent(label);
      unmount();
    });
  });

  it("a le testID cooker-card sur le conteneur", () => {
    render(<CookerCard cooker={BASE_COOKER} />);
    expect(screen.getByTestId("cooker-card")).toBeTruthy();
  });
});
