export function addTyping(){

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

export function removeTyping(){

const typing =
document.getElementById("typing");

if(typing){

typing.remove();

}

}