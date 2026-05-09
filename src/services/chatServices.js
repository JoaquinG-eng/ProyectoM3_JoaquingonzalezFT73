const mockResponses = {
  Mario: [
    "¡Wahoo! ¡Mamma mia, qué mensaje tan genial!",
    "¡Vamos, vamos! ¡Tú puedes contar conmigo!",
    "¡Itsa me, Mario! ¿En qué te puedo ayudar?",
    "¡Mamma mia! ¡Eso es increíble!",
    "¡Wahoo! ¡Sigamos adelante!",
  ],
  Naruto: [
    "¡Dattebayo! ¡Nunca me rindo, eso es mi camino ninja!",
    "¡Cree en mí! ¡Yo creo en ti!",
    "¡Voy a ser Hokage, ya verás! ¡Dattebayo!",
    "¡Eso es exactamente lo que haría un verdadero ninja!",
    "¡No me rendiré jamás, ese es mi juramento!",
  ],
  Rosalina: [
    "Las estrellas me susurran que todo tiene su momento...",
    "Como el cosmos, todo fluye en perfecta armonía.",
    "Los Lumas y yo hemos visto muchas cosas en el universo...",
    "La luz de las estrellas siempre encuentra su camino.",
    "El universo tiene sus propios planes para todos nosotros.",
  ],
  Peach: [
    "¡Oh, qué amable de tu parte! Gracias desde el Reino Champiñón.",
    "¡Eso es maravilloso! Estoy muy contenta de escucharlo.",
    "En el Reino Champiñón siempre hay lugar para la bondad.",
    "¡Oh my! ¡Qué cosa tan dulce has dicho!",
    "Siempre es un placer conversar contigo, de verdad.",
  ],
};

function getMockResponse(characterName) {
  const responses = mockResponses[characterName] || ["..."];
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function getAIResponse(text, character, history = []) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, character, history }),
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    return data.reply;

  } catch {
    // Si falla la API (Live Server, sin conexión, etc.) usa respuesta mock
    return getMockResponse(character.name);
  }
}