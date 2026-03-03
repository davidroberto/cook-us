import { act, renderHook } from "@testing-library/react-native";
import { useConversation } from "../useConversation";

jest.mock("@/features/auth/AuthContext", () => ({
  useAuth: () => ({ token: "fake-token", user: { id: 1 } }),
}));

const MOCK_API_CONVERSATION = {
  id: 42,
  participants: [
    { id: 1, authorId: 1, author: { id: 1, firstName: "Jean", lastName: "Client" }, conversationId: 42, createdAt: "2026-01-01T00:00:00.000Z", deletedAt: null },
    { id: 2, authorId: 2, author: { id: 2, firstName: "Marie", lastName: "Dupont" }, conversationId: 42, createdAt: "2026-01-01T00:00:00.000Z", deletedAt: null },
  ],
  messages: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  deletedAt: null,
};

describe("useConversation", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_API_CONVERSATION),
    });
  });

  afterEach(() => jest.resetAllMocks());

  it("démarre en état loading", () => {
    const { result } = renderHook(() => useConversation(42));
    expect(result.current.state.status).toBe("loading");
  });

  it("passe en état success après le fetch", async () => {
    const { result } = renderHook(() => useConversation(42));
    await act(async () => {});
    expect(result.current.state.status).toBe("success");
  });

  it("dérive le nom du cuisinier depuis les participants", async () => {
    const { result } = renderHook(() => useConversation(42));
    await act(async () => {});
    if (result.current.state.status !== "success") throw new Error("not success");
    expect(result.current.state.conversation.cookFirstName).toBe("Marie");
    expect(result.current.state.conversation.cookLastName).toBe("Dupont");
  });

  it("sendMessage ajoute un message client à la conversation", async () => {
    const { result } = renderHook(() => useConversation(42));
    await act(async () => {});
    await act(async () => { result.current.sendMessage("Bonjour !"); });
    if (result.current.state.status !== "success") throw new Error("not success");
    const last = result.current.state.conversation.messages.at(-1);
    expect(last?.sender).toBe("client");
    expect(last?.content).toBe("Bonjour !");
  });

  it("retry recharge la conversation", async () => {
    const { result } = renderHook(() => useConversation(42));
    await act(async () => {});
    act(() => { result.current.retry(); });
    expect(result.current.state.status).toBe("loading");
    await act(async () => {});
    expect(result.current.state.status).toBe("success");
  });

  it("passe en état error si le fetch échoue", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useConversation(42));
    await act(async () => {});
    expect(result.current.state.status).toBe("error");
  });
});
