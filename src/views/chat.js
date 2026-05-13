  import {characters}from "../data/characters.js";
  import {chatState, setCharacter, restoreCharacter} from "../state/chatState.js";
  import {getAIResponse }from "../services/chatServices.js";
  import {applyTheme }from "../services/characterService.js";
  import {getConversations, saveConversations} from "../utils/storage.js";
  import {addMessage, loadConversation}from "../utils/messages.js";
  import {addTyping, removeTyping}from "../utils/typing.js";
  import {initContrastButton}from "../utils/contrast.js";
  import {renderCharacters}from "../components/characterCards.js";
  import {renderChatForm}from "../components/chatForm.js";
  import {renderMessages}from "../components/messagesContainer.js";
  import {isLimitReached, getLimitMessage, getMsUntilReset, formatTimeRemaining} from "../utils/tokenLimit.js";


  let _countdownInterval = null;

  export function renderChat() {

    if (_countdownInterval) {
      clearInterval(_countdownInterval);
      _countdownInterval = null;
    }

    const html = `
      <section class="chat-page">
        <h2 class="chat-title">Elige tu personaje</h2>
        ${renderCharacters()}
        ${renderMessages()}
        ${renderChatForm()}
      </section>
    `;

    setTimeout(() => initChat(), 0);
    return html;
  }


  function showWarning(message) {
    const container = document.getElementById("messages");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "message ai";
    div.innerHTML = `
      <span class="avatar">⚠️</span>
      <span class="message-text">${message}</span>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    setTimeout(() => div.remove(), 3000);
  }

  function showEmptyState() {
    const container = document.getElementById("messages");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "message ai";
    div.innerHTML = `
      <span class="avatar">👾</span>
      <span class="message-text">Elegí un personaje para comenzar a chatear 👆</span>
    `;
    container.appendChild(div);
  }


  function showTokenLimitMessage(characterName) {
    const container = document.getElementById("messages");
    if (!container) return;


    const existing = document.getElementById("token-limit-msg");
    if (existing) existing.remove();

    const avatar = characters.find(c => c.name === characterName)?.avatar ?? "🤖";

    const div = document.createElement("div");
    div.id = "token-limit-msg";
    div.className = "message ai token-limit-message";
    div.innerHTML = `
      <span class="avatar">${avatar}</span>
      <span class="message-text">
        ${getLimitMessage(characterName)}
        <br/>
        <span class="token-countdown" id="token-countdown"></span>
      </span>
    `;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;


    function updateCountdown() {
      const el = document.getElementById("token-countdown");
      if (!el) {
        clearInterval(_countdownInterval);
        _countdownInterval = null;
        return;
      }

      const ms = getMsUntilReset();
      if (ms <= 0) {
        el.textContent = "¡Ya podés volver a chatear!";
        clearInterval(_countdownInterval);
        _countdownInterval = null;
        setInputEnabled(true);
        return;
      }

      el.textContent = `⏱ Tiempo restante: ${formatTimeRemaining(ms)}`;
    }

    updateCountdown();
    _countdownInterval = setInterval(updateCountdown, 1000);
  }

  function setInputEnabled(enabled) {
    const input     = document.getElementById("chat-input");
    const submitBtn = document.querySelector("#chat-form button[type='submit']");

    if (input)     input.disabled     = !enabled;
    if (submitBtn) submitBtn.disabled = !enabled;

    if (input) {
      input.placeholder = enabled
        ? "Escribe un mensaje..."
        : "Límite de tokens alcanzado — esperá el tiempo indicado";}
  }


  function initChat() {
    const conversations = getConversations();


    const restored = restoreCharacter(characters);
    if (restored) {
      applyTheme(restored.theme);
      loadConversation(restored.name, conversations);
      document.querySelectorAll(".character-btn").forEach(b => {
        if (b.dataset.character === restored.name) b.classList.add("active");
      });


      if (isLimitReached()) {
        showTokenLimitMessage(restored.name);
        setInputEnabled(false);
      }
  } else {showEmptyState();
  }


    document.querySelectorAll(".character-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name      = btn.dataset.character;
        const character = characters.find(c => c.name === name);
        if (!character) return;

        setCharacter(character);

        document.querySelectorAll(".character-btn")
          .forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        applyTheme(character.theme);
        loadConversation(name, conversations);


        if (isLimitReached()) {
          showTokenLimitMessage(name);
          setInputEnabled(false);
        } else {
          setInputEnabled(true);

          const existing = document.getElementById("token-limit-msg");
          if (existing) existing.remove();
        }
      });
    });

    
    const form = document.getElementById("chat-form");
    if (!form) return;

    form.addEventListener("submit", async e => {
      e.preventDefault();

      const input = document.getElementById("chat-input");
      const text  = input.value.trim();

      if (!chatState.selectedCharacter) {
        showWarning("Primero elegí un personaje 👆");
        return;
      }

      if (!text) {
        showWarning("Escribí un mensaje antes de enviar 📝");
        return;
      }


      if (isLimitReached()) {
        showTokenLimitMessage(chatState.selectedCharacter.name);
        setInputEnabled(false);
        return;
      }

    const characterName = chatState.selectedCharacter.name;
    const history       = [...(conversations[characterName] || [])];
    input.value = "";

      addMessage(text, "user", characterName, conversations);
      addTyping();

      try {
        const reply = await getAIResponse(text, chatState.selectedCharacter, history);
        removeTyping();
        addMessage(reply, "ai", characterName, conversations);

      } catch (err) {
        removeTyping();

        if (err.message === "TOKEN_LIMIT") {

          showTokenLimitMessage(characterName);
          setInputEnabled(false);
        } else {
          addMessage(
            "Error al conectar con la IA. Revisá la consola.",
            "ai", characterName, conversations, false
          );
          console.error("Chat error:", err);
        }
      }
    });

    const clearBtn = document.getElementById("clear-chat");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        const name = chatState.selectedCharacter?.name;
        if (!name) {
          showWarning("Primero elegí un personaje 👆");
          return;
        }
        conversations[name] = [];
        saveConversations(conversations);
        const container = document.getElementById("messages");
        if (container) container.innerHTML = "";


        if (isLimitReached()) {
          showTokenLimitMessage(name);
          setInputEnabled(false);
        }
      });
    }


    initContrastButton();
  }