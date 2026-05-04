import {getCurrentCharacter}from "./character.js";

import {saveConversations}from "./storage.js";

export function addMessage(
text,
sender,
currentCharacter,
conversations,
save = true
){

const container =
document.getElementById("messages");

const character =
getCurrentCharacter(currentCharacter);

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

<span class="message-text">
${text}
</span>
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

saveConversations(conversations);

}

}

export function loadConversation(
currentCharacter,
conversations
){

const container =
document.getElementById("messages");

container.innerHTML = "";

(
conversations[currentCharacter] || []
).forEach(msg => {

addMessage(
msg.text,
msg.sender,
currentCharacter,
conversations,
false
);

});

}