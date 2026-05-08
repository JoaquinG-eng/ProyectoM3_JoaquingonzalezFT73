import { characters } from "../data/characters.js";

export function getCurrentCharacter(name) {
  return characters.find(char => char.name === name) || null;
}


export function applyTheme(theme) {
  document.body.className = theme;
}