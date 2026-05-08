// La API key NUNCA toca el frontend. Solo se llama a /api/chat
export async function getAIResponse(text, character) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, character })
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();
  return data.reply;
}