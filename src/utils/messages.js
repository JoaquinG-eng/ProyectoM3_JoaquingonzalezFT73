import { getCurrentCharacter } from "../services/characterService.js";
import { saveConversations }   from "./storage.js";

export function addMessage(text, sender, currentCharacterName, conversations, save = true) {
  const container = document.getElementById("messages");
  if (!container) return;

  const character = getCurrentCharacter(currentCharacterName);

  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerHTML = `
    <span class="avatar">${sender === "ai" ? (character?.avatar ?? "🤖") : "🧑"}</span>
    <span class="message-text">${text}</span>
  `;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;

  if (save) {
    if (!conversations[currentCharacterName]) {
      conversations[currentCharacterName] = [];
    }
    conversations[currentCharacterName].push({ text, sender });
    saveConversations(conversations);
  }
}

export function loadConversation(currentCharacterName, conversations) {
  const container = document.getElementById("messages");
  if (!container) return;

  container.innerHTML = "";

  const msgs = conversations[currentCharacterName] || [];
  msgs.forEach(msg => {
    addMessage(msg.text, msg.sender, currentCharacterName, conversations, false);
  });
}