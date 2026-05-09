import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

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

    const formattedHistory = history.map(msg => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.status(200).json({ reply });

  } catch (err) {
    console.error("Error interno:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}