import { describe, it, expect, beforeEach, vi } from "vitest";
import { getConversations, saveConversations, _clearCache } from "../utils/storage.js";

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

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
    _clearCache(); // limpia el _cache entre tests
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

  it("saveConversaciones persiste en localStorage", () => {
    const data = { Naruto: [{ text: "dattebayo", sender: "ai" }] };
    saveConversations(data);
    const raw = JSON.parse(localStorage.getItem("conversations"));
    expect(raw).toEqual(data);
  });

  it("retorna {} si localStorage tiene JSON corrupto", () => {
    vi.spyOn(localStorage, "getItem").mockReturnValueOnce("esto no es json{{");
    const result = getConversations();
    expect(result).toEqual({});
  });
});