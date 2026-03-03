import { render, screen } from "@testing-library/react-native";
import { MessageBubble } from "../components/MessageBubble";
import type { Message } from "../types";

const systemMessage: Message = {
  id: 1,
  content: "Demande envoyée à Marie Dupont.",
  sender: "system",
  sentAt: "2026-06-15T10:00:00.000Z",
};

const clientMessage: Message = {
  id: 2,
  content: "Bonjour, je confirme ma venue.",
  sender: "client",
  sentAt: "2026-06-15T10:01:00.000Z",
};

const cookMessage: Message = {
  id: 3,
  content: "Parfait, à bientôt !",
  sender: "cook",
  sentAt: "2026-06-15T10:02:00.000Z",
};

describe("MessageBubble", () => {
  it("affiche un message système avec le bon testID", () => {
    render(<MessageBubble message={systemMessage} />);
    expect(screen.getByTestId("message-bubble-system")).toBeTruthy();
  });

  it("affiche le contenu du message système", () => {
    render(<MessageBubble message={systemMessage} />);
    expect(screen.getByText("Demande envoyée à Marie Dupont.")).toBeTruthy();
  });

  it("affiche un message client avec le bon testID", () => {
    render(<MessageBubble message={clientMessage} />);
    expect(screen.getByTestId("message-bubble-client")).toBeTruthy();
  });

  it("affiche le contenu du message client", () => {
    render(<MessageBubble message={clientMessage} />);
    expect(screen.getByText("Bonjour, je confirme ma venue.")).toBeTruthy();
  });

  it("affiche un message cuisinier avec le bon testID", () => {
    render(<MessageBubble message={cookMessage} />);
    expect(screen.getByTestId("message-bubble-cook")).toBeTruthy();
  });

  it("affiche le contenu du message cuisinier", () => {
    render(<MessageBubble message={cookMessage} />);
    expect(screen.getByText("Parfait, à bientôt !")).toBeTruthy();
  });
});
