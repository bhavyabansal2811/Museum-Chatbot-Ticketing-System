// renderer.js – Chatbot UI logic with FastAPI backend integration

// i18n strings
const i18n = {
  en: {
    welcome:    'Welcome to the Museum Ticket Booking System! 🏛️',
    askDate:    'Please enter the visit date (e.g., 2025-12-25):',
    askTime:    'Choose a time slot (e.g., 10:00 AM, 12:00 PM, 2:00 PM):',
    askName:    'Enter your full name:',
    askType:    'Choose ticket type – Adult, Child, or Senior:',
    processing: '⏳ Processing your booking...',
    payment:    '💳 Mock payment processed successfully! ✅',
    confirm:    (id) => `🎉 Booking confirmed! Your ticket ID is #${id}. Enjoy your visit!`,
    error:      '❌ Something went wrong. Please try again.',
    restart:    'Type anything to start a new booking.',
    placeholder:'Type your reply here...',
  },
  hi: {
    welcome:    'संग्रहालय टिकट बुकिंग प्रणाली में आपका स्वागत है! 🏛️',
    askDate:    'कृपया यात्रा की तारीख दर्ज करें (जैसे 2025-12-25):',
    askTime:    'समय स्लॉट चुनें (जैसे 10:00 AM, 12:00 PM, 2:00 PM):',
    askName:    'अपना पूरा नाम दर्ज करें:',
    askType:    'टिकट प्रकार चुनें – वयस्क, बच्चा, या वरिष्ठ:',
    processing: '⏳ आपकी बुकिंग प्रक्रिया हो रही है...',
    payment:    '💳 नकली भुगतान सफलतापूर्वक प्रक्रिया हुई! ✅',
    confirm:    (id) => `🎉 बुकिंग की पुष्टि हुई! आपका टिकट ID #${id} है। आपकी यात्रा शुभ हो!`,
    error:      '❌ कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    restart:    'नई बुकिंग शुरू करने के लिए कुछ टाइप करें।',
    placeholder:'यहाँ अपना जवाब टाइप करें...',
  },
};

let lang = 'en';
let step = 0;
let booking = {};

const chatBox   = document.getElementById('chat');
const input     = document.getElementById('user-input');
const sendBtn   = document.getElementById('send-btn');
const langSelect = document.getElementById('lang');

// ── Helpers ──────────────────────────────────────────────────────────────────

function addMessage(text, sender = 'bot') {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function botSay(key, ...args) {
  const val = i18n[lang][key];
  addMessage(typeof val === 'function' ? val(...args) : val, 'bot');
}

function setPlaceholder() {
  input.placeholder = i18n[lang].placeholder;
}

// ── Booking flow ──────────────────────────────────────────────────────────────

async function handleInput(text) {
  text = text.trim();
  if (!text) return;

  addMessage(text, 'user');
  input.value = '';

  switch (step) {
    case 0: // ask date
      booking.date = text;
      step++;
      botSay('askTime');
      break;

    case 1: // ask time
      booking.time = text;
      step++;
      botSay('askName');
      break;

    case 2: // ask name
      booking.name = text;
      step++;
      botSay('askType');
      break;

    case 3: // ask ticket type → submit
      booking.ticket_type = text;
      booking.price = booking.ticket_type.toLowerCase() === 'child' ? 50 : 100;
      booking.payment_status = 'paid';

      botSay('processing');

      // Call FastAPI backend via preload bridge
      const result = await window.api.bookTicket(booking);

      if (result.error) {
        botSay('error');
      } else {
        botSay('payment');
        setTimeout(() => {
          botSay('confirm', result.id);
          setTimeout(() => {
            botSay('restart');
            step = 0;
            booking = {};
          }, 1000);
        }, 1000);
      }
      break;

    default:
      step = 0;
      booking = {};
      startFlow();
  }
}

function startFlow() {
  chatBox.innerHTML = '';
  step = 0;
  booking = {};
  botSay('welcome');
  botSay('askDate');
}

// ── Event listeners ───────────────────────────────────────────────────────────

sendBtn.addEventListener('click', () => handleInput(input.value));
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleInput(input.value); });

langSelect.addEventListener('change', (e) => {
  lang = e.target.value;
  setPlaceholder();
  startFlow();
});

// ── Init ──────────────────────────────────────────────────────────────────────
setPlaceholder();
startFlow();
