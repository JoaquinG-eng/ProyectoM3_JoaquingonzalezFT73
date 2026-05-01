import { characters } from "../data/characters.js";
import { setCharacter } from "../state/chatState.js";

const container = document.getElementById("character-list");

export function renderCharacters(applyTheme) {
  container.innerHTML = "";

  characters.forEach((char) => {
    const btn = document.createElement("button");
    btn.textContent = char.name;

    btn.onclick = () => {
      setCharacter(char);
      applyTheme(char.theme);
    };

    container.appendChild(btn);
  });
}