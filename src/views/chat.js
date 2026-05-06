import {renderCharacters} from "../components/characterCards.js";
import {renderMessages} from "../components/messagesContainer.js";
import {renderChatForm} from "../components/chatForm.js";

import {getConversations,saveConversations} from "../utils/storage.js";
import {addTyping,removeTyping} from "../utils/typing.js";
import {addMessage,loadConversation} from "../utils/messages.js";
import {getCurrentCharacter} from "../utils/character.js";
import {initContrastButton} from "../utils/contrast.js";

let currentCharacter = "Mario";

const conversations = getConversations();

export function renderChat(){

  return `
  <section class="chat-page">

    <h2 class="chat-title">
      Elige tu personaje y chatea con él/ella
    </h2>

    ${renderCharacters()}
    ${renderMessages()}
    ${renderChatForm()}

  </section>
  `;

}

export function initChat(){

initCharacters();
initClearButton();
initContrastButton();

  loadConversation(
    currentCharacter,
    conversations
  );

  const form =
    document.getElementById("chat-form");

  const input =
    document.getElementById("chat-input");

  form.addEventListener("submit",e => {

    e.preventDefault();

    const text =
      input.value.trim();

    if(!text) return;

    addMessage(
      text,
      "user",
      currentCharacter,
      conversations
    );

    input.value = "";

    addTyping();

    setTimeout(() => {

      removeTyping();

      const character =
        getCurrentCharacter(
          currentCharacter
        );

      addMessage(
        `${character.response} ${text}`,
        "ai",
        currentCharacter,
        conversations
      );

    },1200);

  });

  input.addEventListener("keydown",e => {

    if(e.key === "Enter"){

      e.preventDefault();

      form.requestSubmit();

    }

  });

}

function initCharacters(){

document
.querySelectorAll(".character-btn")
.forEach(btn => {

btn.addEventListener("click",() => {

document
.querySelectorAll(".character-btn")
.forEach(button => {

button.classList.remove("active");

});

btn.classList.add("active");

currentCharacter =
btn.dataset.character;

const character =
getCurrentCharacter(
currentCharacter
);

document.body.classList.remove(
"theme-mario",
"theme-naruto",
"theme-peach",
"theme-rosalina"
);

document.body.classList.add(
character.theme
);

loadConversation(
currentCharacter,
conversations
);

});

});

}

function initClearButton(){

  const btn =
    document.getElementById("clear-chat");

  btn.addEventListener("click",() => {

    conversations[currentCharacter] = [];

    saveConversations(conversations);

    loadConversation(
      currentCharacter,
      conversations
    );

});
}