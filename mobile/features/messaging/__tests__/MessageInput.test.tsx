import { fireEvent, render, screen } from "@testing-library/react-native";
import { MessageInput } from "../components/MessageInput";

describe("MessageInput", () => {
  it("affiche le champ de saisie avec son placeholder", () => {
    render(<MessageInput onSend={jest.fn()} />);
    expect(screen.getByTestId("message-text-input").props.placeholder).toBe(
      "Écrire un message..."
    );
  });

  it("affiche le bouton d'envoi", () => {
    render(<MessageInput onSend={jest.fn()} />);
    expect(screen.getByTestId("message-send-button")).toBeTruthy();
  });

  it("désactive le bouton quand le champ est vide", () => {
    render(<MessageInput onSend={jest.fn()} />);
    expect(screen.getByTestId("message-send-button")).toBeDisabled();
  });

  it("active le bouton après saisie de texte", () => {
    render(<MessageInput onSend={jest.fn()} />);
    fireEvent.changeText(screen.getByTestId("message-text-input"), "Bonjour");
    expect(screen.getByTestId("message-send-button")).not.toBeDisabled();
  });

  it("appelle onSend avec le contenu saisi", () => {
    const onSend = jest.fn();
    render(<MessageInput onSend={onSend} />);
    fireEvent.changeText(screen.getByTestId("message-text-input"), "Bonjour");
    fireEvent.press(screen.getByTestId("message-send-button"));
    expect(onSend).toHaveBeenCalledWith("Bonjour");
  });

  it("vide le champ après envoi", () => {
    render(<MessageInput onSend={jest.fn()} />);
    fireEvent.changeText(screen.getByTestId("message-text-input"), "Bonjour");
    fireEvent.press(screen.getByTestId("message-send-button"));
    expect(screen.getByTestId("message-text-input").props.value).toBe("");
  });

  it("n'appelle pas onSend si le message est composé uniquement d'espaces", () => {
    const onSend = jest.fn();
    render(<MessageInput onSend={onSend} />);
    fireEvent.changeText(screen.getByTestId("message-text-input"), "   ");
    fireEvent.press(screen.getByTestId("message-send-button"));
    expect(onSend).not.toHaveBeenCalled();
  });
});
