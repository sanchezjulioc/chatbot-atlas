const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");

let conversation = [
  { role: "system", content: "Eres un tutor que enseña español básico a niños. Comienza saludando y preguntando el nombre del estudiante." },
  { role: "assistant", content: "Hola, ¿cómo te llamas?" }
];

appendMessage("bot", "Hola, ¿cómo te llamas?");
speak("Hola, ¿cómo te llamas?");

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  conversation.push({ role: "user", content: text });
  userInput.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation }),
    });

    const data = await response.json();
    const reply = data.reply?.trim();

    if (reply) {
      appendMessage("bot", reply);
      conversation.push({ role: "assistant", content: reply });
      speak(reply);
    } else {
      appendMessage("bot", "Lo siento, no entendí.");
    }
  } catch (err) {
    console.error(err);
    appendMessage("bot", "Error de conexión.");
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

micBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "es-ES";
  recognition.start();
  recognition.onresult = (event) => {
    const speech = event.results[0][0].transcript;
    userInput.value = speech;
    sendMessage();
  };
});

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  speechSynthesis.speak(utterance);
}
