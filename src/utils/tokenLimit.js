const MAX_DAILY_TOKENS = 50000;
const STORAGE_KEY = "tokenLimit";
const RESET_HOURS = 24;

const limitMessages = {
  Mario: (time) =>
    `¡Mamma mia! 😅 ¡Nos quedamos sin tokens por hoy! El tiempo de espera es de <strong>${time}</strong>. ¡Wahoo, hasta pronto!`,

  Naruto: (time) =>
    `¡Rayos sabio pervertido! 😤 Me quedé sin chakra... digo, sin tokens. El tiempo de espera es de <strong>${time}</strong>. ¡Cuando vuelva seré más fuerte!`,

  Rosalina: (time) =>
    `Las estrellas me susurran que es hora de descansar... ✨ Los tokens se han agotado por hoy. El tiempo de espera es de <strong>${time}</strong>. Hasta que nos volvamos a ver bajo el cosmos.`,

  Melina: (time) =>
    `Oh no! We've run out of tokens for today! ⏰ Come back in <strong>${time}</strong> and we'll keep learning together! You're doing amazing! 🦋`,
};

function getState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addTokens(count) {
  if (!count || count <= 0) return;

  let state = getState();
  const now = Date.now();

  if (!state || now >= state.resetAt) {
    state = {
      tokens: 0,
      resetAt: now + RESET_HOURS * 60 * 60 * 1000,
    };
  }

  state.tokens += count;
  saveState(state);
}

export function isLimitReached() {
  const state = getState();
  if (!state) return false;

  const now = Date.now();

  if (now >= state.resetAt) {
    saveState({ tokens: 0, resetAt: now + RESET_HOURS * 60 * 60 * 1000 });
    return false;
  }

  return state.tokens >= MAX_DAILY_TOKENS;
}

export function getMsUntilReset() {
  const state = getState();
  if (!state) return 0;
  return Math.max(0, state.resetAt - Date.now());
}

export function formatTimeRemaining(ms) {
  if (ms <= 0) return "0s";

  const totalSeconds = Math.floor(ms / 1000);
  const hours        = Math.floor(totalSeconds / 3600);
  const minutes      = Math.floor((totalSeconds % 3600) / 60);
  const seconds      = totalSeconds % 60;

  const parts = [];
  if (hours   > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
}

export function getLimitMessage(characterName) {
  const ms   = getMsUntilReset();
  const time = formatTimeRemaining(ms);
  const fn   = limitMessages[characterName];
  return fn ? fn(time) : `Límite de tokens alcanzado. Tiempo de espera: <strong>${time}</strong>.`;
}

// ── NUEVAS EXPORTACIONES ──
export const MAX_TOKENS = MAX_DAILY_TOKENS;

export function getUsedTokens() {
  const state = getState();
  if (!state) return 0;
  if (Date.now() >= state.resetAt) return 0;
  return state.tokens || 0;
}