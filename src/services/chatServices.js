export async function getAIResponse(text, character) {

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, character })
  });

  const data = await response.json();

  return data.reply;
}