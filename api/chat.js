// Serverless Function — la API key vive SOLO aquí, nunca en el frontend
const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, character } = req.body;

  if (!message || !character) {
    return res.status(400).json({ error: "Faltan datos: message y character son requeridos." });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "API key no configurada en el servidor." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: character.prompt }]
          },
          contents: [{
            parts: [{ text: message }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error("Gemini error:", errData);
      return res.status(response.status).json({ error: "Error desde Gemini API." });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta.";

    res.status(200).json({ reply });

  } catch (err) {
    console.error("Error interno:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}