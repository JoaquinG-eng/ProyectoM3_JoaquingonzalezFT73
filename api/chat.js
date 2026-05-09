const apiKey = process.env.GEMINI_API_KEY;
const { GoogleGenerativeAI } = await import("@google/generative-ai");

const MAX_HISTORIAL = 30;
const MAX_TOKENS    = 5000; 

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, character, history = [] } = req.body;

  if (!message || !character) {
    return res.status(400).json({ error: "Faltan datos: message y character son requeridos." });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "API key no configurada en el servidor." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: character.prompt,
    });

    // Recortamos el historial a los últimos MAX_HISTORIAL mensajes
    let formattedHistory = history
      .slice(-MAX_HISTORIAL)
      .map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    // Conteo real de tokens con Gemini
    const tokenCount = await model.countTokens({
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ]
    });

    // Si excede el límite recortamos más agresivamente
    if (tokenCount.totalTokens > MAX_TOKENS) {
      formattedHistory = formattedHistory.slice(-5);
    }

    const chat   = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const reply  = result.response.text();

    res.status(200).json({
      reply,
      tokens: tokenCount.totalTokens
    });

  } catch (err) {
    console.error("Error interno:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}