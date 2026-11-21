// renderer.js – simple chatbot UI logic

// i18n strings for English and Hindi
const i18n = {
  en: {
    welcome: 'Welcome! I can help you book a museum ticket.',
    askDate: 'Please select a date (YYYY-MM-DD):',
    askTime: 'Select a time slot (e.g., 10:00 AM):',
    askName: 'Your name:',
    confirm: 'Booking confirmed! 🎉',
    payment: 'Processing mock payment... ✅',
  },
  hi: {
    welcome: 'स्वागत है! मैं आपके लिए संग्रहालय टिकट बुक कर सकता हूँ।',
    askDate: 'कृपया एक तिथि चुनें (YYYY-MM-DD):',
    askTime: 'समय स्लॉट चुनें (उदा., 10:00 AM):',
    askName: 'आपका नाम:',
    confirm: 'बुकिंग पुष्टि हुई! 🎉',
    payment: 'नकली भुगतान प्रक्रिया चल रही है... ✅',
  },
};

let currentLang = 'en';
const chatBox = document.getElementById('chat');
const langSelect = document.getElementById('lang');

function addMessage(text, sender = 'bot') {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function botSpeak(key) {
  const msg = i18n[currentLang][key];
  if (msg) addMessage(msg, 'bot');
}

// Simple state machine for the mock booking flow
let step = 0;
let booking = {};

function handleUserInput(input) {
  addMessage(input, 'user');
  switch (step) {
    case 0:
      booking.date = input.trim();
      step++;
      botSpeak('askTime');
      break;
    case 1:
      booking.time = input.trim();
      step++;
      botSpeak('askName');
      break;
    case 2:
      booking.name = input.trim();
      step++;
      botSpeak('payment');
      // mock async payment
      setTimeout(() => {
        botSpeak('confirm');
        // Reset for next booking
        step = 0;
        booking = {};
        botSpeak('welcome');
      }, 1000);
      break;
    default:
      botSpeak('welcome');
      step = 0;
  }
}

// Listen for user input via prompt (quick implementation)
function askNextQuestion() {
  const promptText = {
    en: 'Your reply:',
    hi: 'आपका जवाब:',
  }[currentLang];
  const reply = window.prompt(promptText);
  if (reply !== null) {
    handleUserInput(reply);
  }
}

// Init UI
function init() {
  botSpeak('welcome');
  botSpeak('askDate');
  askNextQuestion();
}

// Language switch handler
langSelect.addEventListener('change', (e) => {
  currentLang = e.target.value;
  // Clear chat and restart
  chatBox.innerHTML = '';
  step = 0;
  booking = {};
  init();
});

// Start the flow
init();
