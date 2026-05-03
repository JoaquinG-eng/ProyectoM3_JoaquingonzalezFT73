import { characters } from "../data/characters.js";

import { renderCharacters} from "../components/characterButtons.js";

import { renderMessages} from "../components/messagesContainer.js";

import { renderChatForm} from "../components/chatForm.js";

let currentCharacter = "Mario";

const conversations = JSON.parse(localStorage.getItem("conversations")) || {};

function getCurrentCharacter(){

  return characters.find(char => char.name === currentCharacter);

}

export function renderChat(){
return `
  <section class="chat-page">

    <h2 class="chat-title">
      Chat con personajes IA
    </h2>

    ${renderCharacters()}
    ${renderMessages()}
    ${renderChatForm()}

  </section>
  `;

}

export function initChat(){

  initCharacters();
  loadConversation();
  initClearButton();
  initContrastButton();

  const form =
    document.getElementById("chat-form");

  const input =
    document.getElementById("chat-input");

  form.addEventListener("submit", e => {

    e.preventDefault();

    const text =
      input.value.trim();

    if(!text) return; addMessage(text, "user");

    input.value = "";

    addTyping();

    setTimeout(() => {

      removeTyping();

      addMessage( getCharacterResponse(text),
        "ai"
      );

    }, 1200);

  });

  input.addEventListener("keydown", e => { 

    if(e.key === "Enter"){ e.preventDefault(); form.requestSubmit();

    }

  });

}

function initCharacters(){

  document
    .querySelectorAll(".character-btn")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        currentCharacter =
          btn.dataset.character;

        const character =
          getCurrentCharacter();

        document.body.className =
          character.theme;

        loadConversation();

      });

    });

}

function initClearButton(){

  const btn =
    document.getElementById("clear-chat");

  btn.addEventListener("click", () => {

    conversations[currentCharacter] = [];

    localStorage.setItem(
      "conversations",
      JSON.stringify(conversations)
    );

    loadConversation();

  });

}

function initContrastButton(){

  const button =
    document.getElementById("contrast-btn");

  const savedContrast =
    localStorage.getItem("highContrast");

  if(savedContrast === "true"){ document.body.classList.add( "high-contrast");

  }

  button.addEventListener("click", () => {

    document.body.classList.toggle(
      "high-contrast"
    );

    const enabled =
      document.body.classList.contains(
        "high-contrast"
      );

    localStorage.setItem(
      "highContrast",
      enabled
    );

  });

}

function addMessage(
  text,
  sender,
  save = true
){

  const container =
    document.getElementById("messages");

  const character =
    getCurrentCharacter();

  const div =
    document.createElement("div");

  div.className =
    `message ${sender}`;

  div.innerHTML = `
    <span class="avatar">
      ${
        sender === "ai"
          ? character.avatar
          : "🧑"
      }
    </span>

    <span class="message-text"> ${text} </span>
  `;

  container.appendChild(div);

  container.scrollTop =
    container.scrollHeight;

  if(save){

    if(!conversations[currentCharacter]){

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

function loadConversation(){

  const container =
    document.getElementById("messages");

  container.innerHTML = "";

  (
    conversations[currentCharacter] || []
  ).forEach(msg => {

    addMessage(
      msg.text,
      msg.sender,
      false
    );

  });

}

function addTyping(){

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

function removeTyping(){

  const typing =
    document.getElementById("typing");

  if(typing){

    typing.remove();

  }

}

function getCharacterResponse(text){

  const character =
    getCurrentCharacter();

  return `
    ${character.response}
    ${text}
  `;

}