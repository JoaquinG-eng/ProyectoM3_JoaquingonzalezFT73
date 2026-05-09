import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

// Importar después del mock
const { getConversations, saveConversations } = await import("../utils/storage.js");

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("retorna objeto vacío si no hay nada en localStorage", () => {
    const result = getConversations();
    expect(result).toEqual({});
  });

  it("guarda y recupera conversaciones correctamente", () => {
    const data = { Mario: [{ text: "hola", sender: "user" }] };
    saveConversations(data);
    const result = getConversations();
    expect(result).toEqual(data);
  });

  it("saveConversations persiste en localStorage", () => {
    const data = { Naruto: [{ text: "dattebayo", sender: "ai" }] };
    saveConversations(data);
    const raw = JSON.parse(localStorage.getItem("conversations"));
    expect(raw).toEqual(data);
  });
});