const chatContainer = document.getElementById("chat");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let conversation = [
  { role: "system", content: "Eres un asistente amigable que enseña español a niños. Comienza saludando y preguntando el nombre del usuario." },
  { role: "assistant", content: "¡Hola! ¿Cómo te llamas?" }
];

function appendMessage(sender, text) {
  const message = document.createElement("div");
  message.className = sender === "user" ? "user-message" : "bot-message";
  message.innerText = text;
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

appendMessage("bot", "¡Hola! ¿Cómo te llamas?");

async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage("user", input);
  userInput.value = "";

  conversation.push({ role: "user", content: input });

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation }),
    });

    const data = await response.json();
    const botReply = data.reply?.trim();

    if (botReply) {
      conversation.push({ role: "assistant", content: botReply });
      appendMessage("bot", botReply);
      speak(botReply);
    } else {
      appendMessage("bot", "Lo siento, no entendí.");
    }
  } catch (err) {
    appendMessage("bot", "Error de conexión. Intenta de nuevo.");
    console.error(err);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  speechSynthesis.speak(utterance);
}
