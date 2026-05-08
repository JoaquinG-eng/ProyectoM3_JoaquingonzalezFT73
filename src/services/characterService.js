// src/services/characterService.js
import { characters } from "../data/characters.js";
import { chatState } from "../state/chatState.js";

// Nota: setCharacter vive en chatState.js — no duplicar aquí
export function applyTheme(theme) {
  document.body.className = theme;
}