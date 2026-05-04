import { chatState } from "../state/chatState.js";
import { characters } from "../data/characters.js";

export function setCharacter(characterId) {
  const character = characters.find((c) => c.id === characterId);

  if (!character) return;

  chatState.currentCharacter = character;
  chatState.messages = [];

  applyTheme(character.theme);
}

function applyTheme(theme) {
  document.body.className = "";
  document.body.classList.add(`theme-${theme}`);
}