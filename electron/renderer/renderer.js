// renderer.js – Chatbot UI logic with validation, reset, and FastAPI integration

const i18n = {
  en: {
    welcome:    'Welcome to the Museum Ticket Booking System! 🏛️',
    askDate:    'Please enter the visit date (e.g., 2025-12-25 or YYYY-MM-DD):',
    askTime:    'Choose a time slot (e.g., 10:00 AM, 12:00 PM, 2:00 PM):',
    askName:    'Enter your full name:',
    askType:    'Choose ticket type – Adult (₹100), Child (₹50), or Senior (₹70):',
    processing: '⏳ Processing your booking...',
    payment:    '💳 Mock payment processed successfully! ✅',
    confirm:    (id, price) => `🎉 Booking confirmed! Ticket ID: #${id} | Paid: ₹${price}. Enjoy your visit!`,
    error:      '❌ Could not connect to backend server. Please make sure the API is running.',
    restart:    'Type anything or click Reset to book another ticket.',
    placeholder:'Type your reply here...',
    resetToast: 'Chat session reset.',
    valEmpty:   'Please provide a non-empty response.',
    valDate:    'Please enter a valid date (YYYY-MM-DD).',
    valName:    'Please enter a valid name (at least 2 letters).',
    valType:    'Please choose: Adult, Child, or Senior.',
  },
  hi: {
    welcome:    'संग्रहालय टिकट बुकिंग प्रणाली में आपका स्वागत है! 🏛️',
    askDate:    'कृपया यात्रा की तारीख दर्ज करें (उदा. 2025-12-25 या YYYY-MM-DD):',
    askTime:    'समय स्लॉट चुनें (उदा. 10:00 AM, 12:00 PM, 2:00 PM):',
    askName:    'अपना पूरा नाम दर्ज करें:',
    askType:    'टिकट प्रकार चुनें – वयस्क (₹100), बच्चा (₹50), या वरिष्ठ (₹70):',
    processing: '⏳ आपकी बुकिंग प्रक्रिया हो रही है...',
    payment:    '💳 नकली भुगतान सफलतापूर्वक पूरा हुआ! ✅',
    confirm:    (id, price) => `🎉 बुकिंग की पुष्टि हुई! टिकट ID: #${id} | भुगतान: ₹${price}। आपकी यात्रा शुभ हो!`,
    error:      '❌ बैकएंड सर्वर से संपर्क नहीं हो सका। कृपया सुनिश्चित करें कि सर्वर चल रहा है।',
    restart:    'नया टिकट बुक करने के लिए कुछ भी टाइप करें या Reset दबाएं।',
    placeholder:'यहाँ अपना जवाब टाइप करें...',
    resetToast: 'चैट रीसेट कर दी गई है।',
    valEmpty:   'कृपया खाली जवाब न दें।',
    valDate:    'कृपया मान्य तिथि (YYYY-MM-DD) दर्ज करें।',
    valName:    'कृपया वैध नाम दर्ज करें (कम से कम 2 अक्षर)।',
    valType:    'कृपया चुनें: वयस्क, बच्चा, या वरिष्ठ।',
  },
};

let lang = 'en';
let step = 0;
let booking = {};

const chatBox    = document.getElementById('chat');
const input      = document.getElementById('user-input');
const sendBtn    = document.getElementById('send-btn');
const resetBtn   = document.getElementById('reset-btn');
const langSelect = document.getElementById('lang');
const toast      = document.getElementById('toast');

// ── Helpers ──────────────────────────────────────────────────────────────────

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.className = `toast ${isError ? 'toast-error' : 'toast-info'}`;
  setTimeout(() => {
    toast.className = 'toast hidden';
  }, 3000);
}

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

// ── Validation Helpers ───────────────────────────────────────────────────────

function validateDate(str) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d.getTime());
}

function validateName(str) {
  return str.trim().length >= 2;
}

function parseTicketType(str) {
  const lower = str.toLowerCase();
  if (lower.includes('child') || lower.includes('बच्चा')) {
    return { type: 'Child', price: 50 };
  } else if (lower.includes('senior') || lower.includes('वरिष्ठ')) {
    return { type: 'Senior', price: 70 };
  } else if (lower.includes('adult') || lower.includes('वयस्क') || lower === 'general') {
    return { type: 'Adult', price: 100 };
  }
  return null;
}

// ── Booking flow ──────────────────────────────────────────────────────────────

async function handleInput(text) {
  text = text.trim();
  if (!text) {
    showToast(i18n[lang].valEmpty, true);
    return;
  }

  addMessage(text, 'user');
  input.value = '';

  switch (step) {
    case 0: // Validate and store Date
      if (!validateDate(text)) {
        showToast(i18n[lang].valDate, true);
        botSay('askDate');
        return;
      }
      booking.date = text;
      step++;
      botSay('askTime');
      break;

    case 1: // Store Time Slot
      booking.time = text;
      step++;
      botSay('askName');
      break;

    case 2: // Validate and store Name
      if (!validateName(text)) {
        showToast(i18n[lang].valName, true);
        botSay('askName');
        return;
      }
      booking.name = text;
      step++;
      botSay('askType');
      break;

    case 3: // Validate Type & Submit
      const typeInfo = parseTicketType(text);
      if (!typeInfo) {
        showToast(i18n[lang].valType, true);
        botSay('askType');
        return;
      }

      booking.ticket_type = typeInfo.type;
      booking.price = typeInfo.price;
      booking.payment_status = 'paid';

      botSay('processing');

      // Call backend API via contextBridge
      const result = await window.api.bookTicket(booking);

      if (!result || result.error) {
        botSay('error');
        showToast(result?.error || 'Connection failed', true);
      } else {
        botSay('payment');
        setTimeout(() => {
          botSay('confirm', result.id, booking.price);
          setTimeout(() => {
            botSay('restart');
            step = 0;
            booking = {};
          }, 1200);
        }, 1000);
      }
      break;

    default:
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
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleInput(input.value);
});

resetBtn.addEventListener('click', () => {
  startFlow();
  showToast(i18n[lang].resetToast);
});

langSelect.addEventListener('change', (e) => {
  lang = e.target.value;
  setPlaceholder();
  startFlow();
});

// ── Init ──────────────────────────────────────────────────────────────────────
setPlaceholder();
startFlow();
