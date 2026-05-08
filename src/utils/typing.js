export function addTyping() {
  const container = document.getElementById("messages");
  if (!container) return;

  const div = document.createElement("div");
  div.id = "typing";
  div.className = "message ai typing";
  div.textContent = "Escribiendo...";

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

export function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}