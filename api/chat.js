const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {

  const { message, character } = req.body;

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

  const data = await response.json();

  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta";

  res.status(200).json({ reply });
}