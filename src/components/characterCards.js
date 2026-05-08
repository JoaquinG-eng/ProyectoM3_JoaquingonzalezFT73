// Función PURA: solo retorna string HTML, NO accede al DOM al importar
import { characters } from "../data/characters.js";

export function renderCharacters() {
  return `
    <div class="characters">
      ${characters.map(character => `
        <button class="character-btn" data-character="${character.name}">
          ${character.avatar} ${character.name}
        </button>
      `).join("")}
    </div>
  `;
}