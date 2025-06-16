import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { messages } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
    });

    const reply = chatResponse.choices[0]?.message?.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error al llamar a OpenAI:", error);
    res.status(500).json({ error: "Error de servidor. Intenta de nuevo." });
  }
}
