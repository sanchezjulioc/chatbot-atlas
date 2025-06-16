
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "No message provided" });
    return;
  }

  try {
    // Conversación sencilla con contexto para saludos y conversación inicial
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres Atlas, un bot que enseña español a niños. Mantén las respuestas apropiadas para todas las edades y enfócate en saludos y conversación inicial." },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content.trim();
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error con OpenAI API" });
  }
}
