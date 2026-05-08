import { getAIResponse } from "../services/chatService.js";
import { addMessage, getMessages, clearMessages } from "../state/chatState.js";

export function renderChat() {

  const messages = getMessages();

  return `
    <section class="chat-page">

      <header class="chat-header">

        <a href="/home" data-link class="nav-btn">Home</a>
        <a href="/chat" data-link class="nav-btn">Chat</a>
        <a href="/about" data-link class="nav-btn">About</a>

      </header>

      <div id="messages" class="messages">

        ${messages.map(m => `
          <div class="message ${m.role}">
            ${m.text}
          </div>
        `).join("")}

      </div>

      <form id="chat-form" class="chat-form">

        <input
          id="chat-input"
          placeholder="Escribe un mensaje..."
          autocomplete="off"
        />

        <button type="submit">Enviar</button>

        <button type="button" id="clear-chat">
          Limpiar
        </button>

      </form>

    </section>
  `;
}

export function initChat() {

  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("messages");
  const clearBtn = document.getElementById("clear-chat");

  if (!form || !input || !messages) return;

  // ENVIAR MENSAJE
  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    addMessage({ role: "user", text });

    input.value = "";

    messages.innerHTML = renderMessages();
    scrollBottom(messages);

    const reply = await getAIResponse(text);

    addMessage({ role: "ai", text: reply });

    messages.innerHTML = renderMessages();
    scrollBottom(messages);
  });

  // LIMPIAR CHAT
  if (clearBtn) {

    clearBtn.addEventListener("click", () => {

      clearMessages();

      messages.innerHTML = "";
    });
  }
}

// helpers internos
function renderMessages() {

  return getMessages()
    .map(m => `
      <div class="message ${m.role}">
        ${m.text}
      </div>
    `)
    .join("");
}

function scrollBottom(el) {
  el.scrollTop = el.scrollHeight;
}