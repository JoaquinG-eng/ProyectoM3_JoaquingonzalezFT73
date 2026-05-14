  import { addTokens, isLimitReached } from "../utils/tokenLimit.js";

const mockResponses = {
  Mario: [
    "¡Wahoo! ¡Mamma mia, qué mensaje tan genial!",
    "¡Vamos, vamos! ¡Tú puedes contar conmigo!",
    "¡Itsa me, Mario! ¿En qué te puedo ayudar?",
    "¡Mamma mia! ¡Eso es increíble!",
    "¡Wahoo! ¡Sigamos adelante!",
  ],
  Naruto: [
    "¡Nunca me rindo, eso es mi camino ninja!",
    "¡Cree en mí! ¡Yo creo en ti!",
    "¡Voy a ser Hokage, ya verás!",
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
  Melina: [
    "Ooh, look at this! You can do it like this... let me show you! 📚",
    "Okay so, here's the thing — it's actually easier than it looks! Check this out... ✨",
    "Yep! That's it, you can do it like this! Super simple once you get it 😊",
    "Weeell done!! Congratulations!! I knew you could do it!! 🎉🌟",
    "Amazing!! Congratulations, seriously!! You're on fire today!! 🔥✨",
    "Did you understand? Take your time, no rush at all 😊",
    "Did that make sense? If not, let's go through it again together! 🦋",
    "No worries at all! Let me explain it a different way... 📖",
    "That's okay! Learning takes time and you're doing great! Let's try again 💪",
    "Hmm, let me think of a better example for you... okay so imagine... 🌟",
  ],
};

function getMockResponse(characterName, history = []) {
  if (characterName === "Melina" && history.length === 0) {
    return "Hi! Good morning! 🌟 I'm Melina, your English teacher! What's your name? 😊";
  }
  const responses = mockResponses[characterName] || ["..."];
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function getAIResponse(text, character, history = []) {

  if (isLimitReached()) {
    throw new Error("TOKEN_LIMIT");
  }

try {
    const response = await fetch("/api/chat", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ message: text, character, history }),
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();

    if (data.tokens) {
      addTokens(data.tokens);
}

    if (isLimitReached()) {
      throw new Error("TOKEN_LIMIT");
    }

    return data.reply;

  } 
  catch (err) {
  if (err.message === "TOKEN_LIMIT") throw err;
  return getMockResponse(character.name, history);
  }
}