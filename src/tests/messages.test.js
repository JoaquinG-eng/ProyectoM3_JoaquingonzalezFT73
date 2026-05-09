import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock del DOM
document.body.innerHTML = `<div id="messages"></div>`;

// Mock de dependencias
vi.mock("../services/characterService.js", () => ({
  getCurrentCharacter: (name) => ({
    name,
    avatar: "🍄",
  }),
}));

vi.mock("../utils/storage.js", () => ({
  getConversations: () => ({}),
  saveConversations: vi.fn(),
}));

const { addMessage, loadConversation } = await import("../utils/messages.js");

describe("messages", () => {
  beforeEach(() => {
    document.getElementById("messages").innerHTML = "";
  });

  it("addMessage agrega un mensaje del user al DOM", () => {
    const conversations = {};
    addMessage("hola", "user", "Mario", conversations);
    const msgs = document.querySelectorAll(".message");
    expect(msgs.length).toBe(1);
    expect(msgs[0].classList.contains("user")).toBe(true);
  });

  it("addMessage agrega un mensaje de la IA al DOM", () => {
    const conversations = {};
    addMessage("¡Wahoo!", "ai", "Mario", conversations);
    const msgs = document.querySelectorAll(".message");
    expect(msgs[0].classList.contains("ai")).toBe(true);
  });

  it("addMessage guarda en conversations cuando save es true", () => {
    const conversations = {};
    addMessage("hola", "user", "Mario", conversations);
    expect(conversations["Mario"]).toHaveLength(1);
    expect(conversations["Mario"][0]).toEqual({ text: "hola", sender: "user" });
  });

  it("addMessage NO guarda en conversations cuando save es false", () => {
    const conversations = {};
    addMessage("error", "ai", "Mario", conversations, false);
    expect(conversations["Mario"]).toBeUndefined();
  });

  it("loadConversation renderiza mensajes previos", () => {
    const conversations = {
      Mario: [
        { text: "hola", sender: "user" },
        { text: "¡Wahoo!", sender: "ai" },
      ],
    };
    loadConversation("Mario", conversations);
    const msgs = document.querySelectorAll(".message");
    expect(msgs.length).toBe(2);
  });

  it("loadConversation limpia el contenedor antes de cargar", () => {
    document.getElementById("messages").innerHTML = "<div>viejo</div>";
    const conversations = { Mario: [] };
    loadConversation("Mario", conversations);
    expect(document.getElementById("messages").innerHTML).toBe("");
  });
});