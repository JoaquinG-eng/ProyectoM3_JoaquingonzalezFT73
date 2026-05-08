import { characters }from "../data/characters.js";
import { chatState, setCharacter }from "../state/chatState.js";
import { getAIResponse }from "../services/chatServices.js";
import { applyTheme }from "../services/characterService.js";
import { getConversations, saveConversations } from "../utils/storage.js";
import { addMessage, loadConversation }from "../utils/messages.js";
import { addTyping, removeTyping }from "../utils/typing.js";
import { initContrastButton }from "../utils/contrast.js";
import { renderCharacters }from "../components/characterCards.js";
import { renderChatForm }from "../components/chatForm.js";
import { renderMessages }from "../components/messagesContainer.js";

export function renderChat() {
  
  const html = `
    <section class="chat-page">
      <h2 class="chat-title">Elige tu personaje</h2>
      ${renderCharacters()}
      ${renderMessages()}
      ${renderChatForm()}
    </section>
  `;

  // Inicializar eventos DESPUÉS de que el DOM exista
  setTimeout(() => initChat(), 0);

  return html;
}

function initChat() {
  const conversations = getConversations();

  // ── Selección de personaje ──────────────────────────────────
  document.querySelectorAll(".character-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.character;
      const character = characters.find(c => c.name === name);
      if (!character) return;

setCharacter(character);

      document.querySelectorAll(".character-btn")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      applyTheme(character.theme);
      loadConversation(name, conversations);
    });
  });

  // ── Enviar mensaje 
  const form = document.getElementById("chat-form");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    if (!chatState.selectedCharacter) {
      alert("Primero elige un personaje.");
      return;
    }

    const characterName = chatState.selectedCharacter.name;
    input.value = "";

    addMessage(text, "user", characterName, conversations);
    addTyping();

    try {
      const reply = await getAIResponse(text, chatState.selectedCharacter);
      removeTyping();
      addMessage(reply, "ai", characterName, conversations);
    } catch (err) {
      removeTyping();
      addMessage("Error al conectar con la IA. Revisá la consola.", "ai", characterName, conversations, false);
      console.error("Chat error:", err);
    }
  });

  // ── Limpiar historial 
  const clearBtn = document.getElementById("clear-chat");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const name = chatState.selectedCharacter?.name;
      if (!name) return;
      conversations[name] = [];
      saveConversations(conversations);
      const container = document.getElementById("messages");
      if (container) container.innerHTML = "";
    });
  }

  // ── Alto contraste 
  initContrastButton();
}