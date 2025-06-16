
const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const btnSend = document.getElementById('btnSend');
const btnSpeak = document.getElementById('btnSpeak');

let recognizing = false;
let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        recognizing = true;
        btnSpeak.textContent = '🎙️ (Escuchando...)';
    };

    recognition.onerror = (event) => {
        console.error(event.error);
        recognizing = false;
        btnSpeak.textContent = '🎙️';
    };

    recognition.onend = () => {
        recognizing = false;
        btnSpeak.textContent = '🎙️';
    };

    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        sendMessage();
    };
} else {
    btnSpeak.disabled = true;
    btnSpeak.title = "Reconocimiento de voz no soportado en este navegador.";
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = text;
    msgDiv.appendChild(textDiv);
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    appendMessage('user', message);
    userInput.value = '';
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message})
        });
        const data = await res.json();
        if (data.reply) {
            appendMessage('bot', data.reply);
            speakText(data.reply);
        }
    } catch (error) {
        appendMessage('bot', 'Error de conexión. Intenta de nuevo.');
        speakText('Error de conexión. Intenta de nuevo.');
    }
}

btnSend.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
});

btnSpeak.addEventListener('click', () => {
    if (recognizing) {
        recognition.stop();
        return;
    }
    recognition.start();
});

// Inicio con saludo del bot
window.onload = () => {
    const saludoInicial = "Hola, ¿cómo te llamas?";
    appendMessage('bot', saludoInicial);
    speakText(saludoInicial);
};
