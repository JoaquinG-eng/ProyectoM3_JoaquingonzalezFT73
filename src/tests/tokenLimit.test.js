import { describe, it, expect, beforeEach } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    (key)        => store[key] ?? null,
    setItem:    (key, value) => { store[key] = String(value); },
    removeItem: (key)        => { delete store[key]; },
    clear:      ()           => { store = {}; },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

const {
  addTokens,
  isLimitReached,
  getUsedTokens,
  MAX_TOKENS,
  getMsUntilReset,
  formatTimeRemaining,
  getLimitMessage,
} = await import("../utils/tokenLimit.js");

describe("tokenLimit", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ── MAX_TOKENS ────────────────────────────────────────────────────
  it("MAX_TOKENS vale 50000", () => {
    expect(MAX_TOKENS).toBe(50000);
  });

  // ── getUsedTokens ─────────────────────────────────────────────────
  it("getUsedTokens retorna 0 si no hay estado", () => {
    expect(getUsedTokens()).toBe(0);
  });

  it("getUsedTokens retorna los tokens acumulados", () => {
    addTokens(1000);
    addTokens(500);
    expect(getUsedTokens()).toBe(1500);
  });

  // ── addTokens ─────────────────────────────────────────────────────
  it("addTokens ignora valores <= 0", () => {
    addTokens(0);
    addTokens(-100);
    expect(getUsedTokens()).toBe(0);
  });

  it("addTokens acumula correctamente múltiples llamadas", () => {
    addTokens(200);
    addTokens(300);
    expect(getUsedTokens()).toBe(500);
  });

  // ── isLimitReached ────────────────────────────────────────────────
  it("isLimitReached retorna false si no hay tokens usados", () => {
    expect(isLimitReached()).toBe(false);
  });

  it("isLimitReached retorna false si los tokens no superan el límite", () => {
    addTokens(1000);
    expect(isLimitReached()).toBe(false);
  });

  it("isLimitReached retorna true si se supera el límite", () => {
    addTokens(50000);
    expect(isLimitReached()).toBe(true);
  });

  it("isLimitReached resetea el estado si ya pasaron las 24h", () => {
    const expiredState = {
      tokens: 50000,
      resetAt: Date.now() - 1000,
    };
    localStorage.setItem("tokenLimit", JSON.stringify(expiredState));
    expect(isLimitReached()).toBe(false);
    expect(getUsedTokens()).toBe(0);
  });

  // ── getMsUntilReset ───────────────────────────────────────────────
  it("getMsUntilReset retorna 0 si no hay estado", () => {
    expect(getMsUntilReset()).toBe(0);
  });

  it("getMsUntilReset retorna ms positivos después de addTokens", () => {
    addTokens(100);
    expect(getMsUntilReset()).toBeGreaterThan(0);
  });

  // ── formatTimeRemaining ───────────────────────────────────────────
  it("formatTimeRemaining retorna 0s si ms <= 0", () => {
    expect(formatTimeRemaining(0)).toBe("0s");
    expect(formatTimeRemaining(-100)).toBe("0s");
  });

  it("formatTimeRemaining formatea segundos correctamente", () => {
    expect(formatTimeRemaining(30000)).toBe("30s");
  });

  it("formatTimeRemaining formatea minutos y segundos correctamente", () => {
    expect(formatTimeRemaining(90000)).toBe("1m 30s");
  });

  it("formatTimeRemaining formatea horas, minutos y segundos correctamente", () => {
    expect(formatTimeRemaining(3661000)).toBe("1h 1m 1s");
  });

  // ── getLimitMessage ───────────────────────────────────────────────
  it("getLimitMessage retorna string con strong para Mario", () => {
    addTokens(100);
    const msg = getLimitMessage("Mario");
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
    expect(msg).toContain("strong");
  });

  it("getLimitMessage retorna fallback para personaje desconocido", () => {
    addTokens(100);
    const msg = getLimitMessage("Personaje Desconocido");
    expect(typeof msg).toBe("string");
    expect(msg).toContain("Límite de tokens");
  });

  it("getLimitMessage retorna mensajes distintos por personaje", () => {
    addTokens(100);
    const mario    = getLimitMessage("Mario");
    const naruto   = getLimitMessage("Naruto");
    const rosalina = getLimitMessage("Rosalina");
    const melina   = getLimitMessage("Melina");

    expect(mario).not.toBe(naruto);
    expect(rosalina).not.toBe(melina);
  });
});