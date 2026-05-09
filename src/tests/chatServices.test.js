import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCharacter = {
  name: "Mario",
  prompt: "Eres Mario.",
};

describe("getAIResponse", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("retorna la respuesta de la IA cuando fetch es exitoso", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "¡Wahoo!" }),
    });

    const { getAIResponse } = await import("../services/chatServices.js");
    const reply = await getAIResponse("hola", mockCharacter, []);
    expect(reply).toBe("¡Wahoo!");
  });

  it("retorna respuesta mock cuando fetch falla", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { getAIResponse } = await import("../services/chatServices.js");
    const reply = await getAIResponse("hola", mockCharacter, []);
    expect(typeof reply).toBe("string");
    expect(reply.length).toBeGreaterThan(0);
  });

  it("retorna respuesta mock cuando fetch retorna error HTTP", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { getAIResponse } = await import("../services/chatServices.js");
    const reply = await getAIResponse("hola", mockCharacter, []);
    expect(typeof reply).toBe("string");
    expect(reply.length).toBeGreaterThan(0);
  });
});