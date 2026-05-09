let _cache = null;

export function getConversations() {
  if (_cache) return _cache;
  try {
    _cache = JSON.parse(localStorage.getItem("conversations")) || {};
  } catch {
    _cache = {};
  }
  return _cache;
}

export function saveConversations(data) {
  _cache = data;
  localStorage.setItem("conversations", JSON.stringify(data));
}