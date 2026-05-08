export function getConversations() {
  try {
    return JSON.parse(localStorage.getItem("conversations")) || {};
  } catch {
    return {};
  }
}

export function saveConversations(data) {
  localStorage.setItem("conversations", JSON.stringify(data));
}