import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../utils/storage.js", () => ({
  getConversations: vi.fn(() => ({})),
  _clearCache: vi.fn(),
}));

const { getConversations } = await import("../utils/storage.js");
const { getAIResponse }    = await import("../services/chatServices.js");

const mockCharacter = { name: "Mario", prompt: "Eres Mario." };

describe("chatServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna la respuesta de la IA correctamente", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "¡Wahoo!", tokens: 42 }),
    });
    getConversations.mockReturnValue({});

    const reply = await getAIResponse("hola", mockCharacter);
    expect(reply).toBe("¡Wahoo!");
  });

  it("usa respuesta mock si la API falla", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("sin conexión"));
    getConversations.mockReturnValue({});

    const reply = await getAIResponse("hola", mockCharacter);

    // Verifica que devuelva alguna de las frases mock de Mario
    const frasesMario = [
      "¡Wahoo! ¡Mamma mia, qué mensaje tan genial!",
      "¡Vamos, vamos! ¡Tú puedes contar conmigo!",
      "¡Itsa me, Mario! ¿En qué te puedo ayudar?",
      "¡Mamma mia! ¡Eso es increíble!",
      "¡Wahoo! ¡Sigamos adelante!",
    ];
    expect(frasesMario).toContain(reply);
  });

  it("manda el historial del personaje al servidor", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "ok", tokens: 100 }),
    });

    const historial = [
      { text: "hola", sender: "user" },
      { text: "¡Wahoo!", sender: "ai" },
    ];
    getConversations.mockReturnValue({ Mario: historial });

    await getAIResponse("nuevo mensaje", mockCharacter);

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.history).toEqual(historial);
  });

  it("manda historial vacío si no hay conversación previa", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "ok", tokens: 10 }),
    });
    getConversations.mockReturnValue({});

    await getAIResponse("primer mensaje", mockCharacter);

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.history).toEqual([]);
  });

  it("loggea tokens estimados localmente", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "ok", tokens: 50 }),
    });
    const consoleSpy = vi.spyOn(console, "log");
    getConversations.mockReturnValue({});

    await getAIResponse("hola", mockCharacter);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Tokens estimados (local):")
    );
  });

  it("loggea tokens reales cuando Gemini los devuelve", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "ok", tokens: 123 }),
    });
    const consoleSpy = vi.spyOn(console, "log");
    getConversations.mockReturnValue({});

    await getAIResponse("hola", mockCharacter);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Tokens reales (Gemini): 123")
    );
  });
});