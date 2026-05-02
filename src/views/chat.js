let currentCharacter = "Mario";

const conversations =
  JSON.parse(
    localStorage.getItem("conversations")
  ) || {};

export function renderChat() {
  return `
  <section class="chat-page">

    <h2 class="chat-title">
      Chat con personajes IA
    </h2>

    <div class="characters">

      <button
        class="character-btn"
        data-character="Peach"
        data-theme="theme-peach"
      >
        Princesa Peach
      </button>

      <button
        class="character-btn"
        data-character="Naruto"
        data-theme="theme-naruto"
      >
        Naruto
      </button>

      <button
        class="character-btn"
        data-character="Rosalina"
        data-theme="theme-rosalina"
      >
        Rosalina
      </button>

      <button
        class="character-btn"
        data-character="Mario"
        data-theme="theme-mario"
      >
        Mario Bros
      </button>

    </div>

    <div
      id="messages"
      class="messages"
    ></div>

    <form
      id="chat-form"
      class="chat-form"
    >

<form
  id="chat-form"
  class="chat-form"
>

  <input
    id="chat-input"
    class="chat-input"
    type="text"
    placeholder="Escribe un mensaje..."
  >

  <button type="submit">
    Enviar
  </button>

  <button
    type="button"
    id="clear-chat"
    class="clear-btn"
  >
    Limpiar
  </button>

</form>

  </section>
  `;
}

export function initChat() {

  initCharacters();
  loadConversation();
  initClearButton();

  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    addMessage(text, "user");

    input.value = "";

    addTyping();

    setTimeout(() => {

      removeTyping();

      addMessage(
        getCharacterResponse(text),
        "ai"
      );

    }, 1200);

  });

  input.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

      e.preventDefault();

      form.requestSubmit();

    }

  });

}

function initCharacters() {

  const buttons =
    document.querySelectorAll(".character-btn");

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      currentCharacter =
        button.dataset.character;

      document.body.className =
        button.dataset.theme;

      loadConversation();

    });

  });

}
function initClearButton() {

  const button =
    document.getElementById("clear-chat");

  button.addEventListener("click", () => {

    conversations[currentCharacter] = [];

    localStorage.setItem(
      "conversations",
      JSON.stringify(conversations)
    );

    loadConversation();

  });

}

function addMessage(
  text,
  sender,
  save = true
) {

  const container =
    document.getElementById("messages");

  const div =
    document.createElement("div");

  div.className =
    `message ${sender}`;

  const avatars = {
    Mario: "🍄",
    Peach: "🍑",
    Naruto: "🍥",
    Rosalina: "🌌"
  };

  const avatar =
    sender === "ai"
      ? avatars[currentCharacter]
      : "🧑";

  div.innerHTML = `
    <span class="avatar">
      ${avatar}
    </span>

    <span class="message-text">
      ${text}
    </span>
  `;

  container.appendChild(div);

  container.scrollTop =
    container.scrollHeight;

  if (save) {

if (!conversations[currentCharacter]) {
      
conversations[currentCharacter] = [];
    
}
conversations[currentCharacter].push({
      text,
      sender
    });

    localStorage.setItem(
      "conversations",
      JSON.stringify(conversations)
    );

  }

}

function loadConversation() {

  const container =
    document.getElementById("messages");

  container.innerHTML = "";

  const savedMessages =
    conversations[currentCharacter] || [];

  savedMessages.forEach(message => {

    addMessage(
      message.text,
      message.sender,
      false
    );

  });

}

function addTyping() {

  const container =
    document.getElementById("messages");

  const div =
    document.createElement("div");

  div.id = "typing";

  div.className =
    "message ai typing";

  div.textContent =
    "Escribiendo...";

  container.appendChild(div);

}

function removeTyping() {

  const typing =
    document.getElementById("typing");

  if (typing) {

    typing.remove();

  }

}

function getCharacterResponse(text) {

  if (currentCharacter === "Peach") {

    return `¡Hola! 🍑 Estoy feliz de ayudarte con: ${text}`;

  }

  if (currentCharacter === "Naruto") {

    return `¡Este es mi camino ninja! ${text}`;

  }

  if (currentCharacter === "Rosalina") {

    return `Las estrellas iluminan tu camino ✨ ${text}`;

  }

  if (currentCharacter === "Mario") {

    return `¡It's-a me, Mario! 🍄 ${text}`;

  }

  return text;

}