  import { describe, it, expect, vi, beforeEach } from "vitest";

  const mockCharacter = { name: "Mario", prompt: "Eres Mario." };

describe("chatServices", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("retorna la respuesta de la IA correctamente", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "¡Wahoo!" }),
  });

    const { getAIResponse } = await import("../services/chatServices.js");
    const reply = await getAIResponse("hola", mockCharacter, []);
    expect(reply).toBe("¡Wahoo!");
  });

  it("usa respuesta mock si la API falla", async () => {
  global.fetch = vi.fn().mockRejectedValue(new Error("sin conexión"));

  const { getAIResponse } = await import("../services/chatServices.js");
  const reply = await getAIResponse("hola", mockCharacter, []);

  const frasesMario = [
    "¡Wahoo! ¡Mamma mia, qué mensaje tan genial!",
    "¡Vamos, vamos! ¡Tú puedes contar conmigo!",
    "¡Itsa me, Mario! ¿En qué te puedo ayudar?",
    "¡Mamma mia! ¡Eso es increíble!",
    "¡Wahoo! ¡Sigamos adelante!",
  ];
  expect(frasesMario).toContain(reply);
});


  it("usa respuesta mock si la API retorna error HTTP", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { getAIResponse } = await import("../services/chatServices.js");
    const reply = await getAIResponse("hola", mockCharacter, []);

    expect(typeof reply).toBe("string");
    expect(reply.length).toBeGreaterThan(0);
  });

  it("manda el historial al servidor correctamente", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "ok" }),
    });

    const historial = [
      { text: "hola", sender: "user" },
      { text: "¡Wahoo!", sender: "ai" },
  ];

    const { getAIResponse } = await import("../services/chatServices.js");
    await getAIResponse("nuevo mensaje", mockCharacter, historial);

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.history).toEqual(historial);
  });

  it("manda historial vacío si no hay conversación previa", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "ok" }),
  });

    const { getAIResponse } = await import("../services/chatServices.js");
    await getAIResponse("primer mensaje", mockCharacter, []);

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.history).toEqual([]);
  });

  it("Melina siempre pregunta el nombre en el primer mensaje si la API falla", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("sin conexión"));

    const melina = { name: "Melina", prompt: "You are Melina." };
    const { getAIResponse } = await import("../services/chatServices.js");
    const reply = await getAIResponse("hola", melina, []);

    expect(reply).toBe("Hi! Good morning! 🌟 I'm Melina, your English teacher! What's your name? 😊");
  });
});