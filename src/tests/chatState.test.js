import { describe, it, expect, beforeEach } from "vitest";

const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, "sessionStorage", { value: sessionStorageMock });

const { chatState, setCharacter, restoreCharacter } = await import("../state/chatState.js");

const mockCharacters = [
  { name: "Mario", theme: "theme-mario", avatar: "🍄", prompt: "Eres Mario." },
  { name: "Naruto", theme: "theme-naruto", avatar: "🍥", prompt: "Eres Naruto." },
];

describe("chatState", () => {
  beforeEach(() => {
    sessionStorage.clear();
    chatState.selectedCharacter = null;
  });

  it("setCharacter guarda el personaje en estado y sessionStorage", () => {
    setCharacter(mockCharacters[0]);
    expect(chatState.selectedCharacter).toEqual(mockCharacters[0]);
    expect(sessionStorage.getItem("selectedCharacter")).toBe("Mario");
  });

  it("restoreCharacter recupera el personaje desde sessionStorage", () => {
    sessionStorage.setItem("selectedCharacter", "Naruto");
    const restored = restoreCharacter(mockCharacters);
    expect(restored).toEqual(mockCharacters[1]);
    expect(chatState.selectedCharacter).toEqual(mockCharacters[1]);
  });

  it("restoreCharacter retorna null si no hay personaje guardado", () => {
    const restored = restoreCharacter(mockCharacters);
    expect(restored).toBeNull();
  });

  it("restoreCharacter retorna null si el personaje no existe", () => {
    sessionStorage.setItem("selectedCharacter", "Goku");
    const restored = restoreCharacter(mockCharacters);
    expect(restored).toBeNull();
  });
});