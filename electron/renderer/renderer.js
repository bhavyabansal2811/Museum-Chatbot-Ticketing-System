// renderer.js – Chatbot UI logic, FAQs, validation & Admin Dashboard

const i18n = {
  en: {
    welcome:    'Welcome to the National Heritage Museum! 🏛️\nI can help you book tickets or answer questions about museum hours, exhibits, and location.\n\nPlease enter your visit date (e.g., 2026-12-25 or YYYY-MM-DD):',
    askDate:    'Please enter the visit date (YYYY-MM-DD):',
    askTime:    'Choose a time slot (e.g., 10:00 AM, 12:00 PM, 02:00 PM, 04:00 PM):',
    askName:    'Enter full name of primary visitor:',
    askType:    'Choose ticket category – Adult (₹100), Child (₹50), or Senior (₹70):',
    processing: '⏳ Processing booking & generating ticket pass...',
    payment:    '💳 Payment simulated & verified! ✅',
    confirm:    (id, price, name, date, slot, type) => 
      `🎉 Booking Confirmed!\n━━━━━━━━━━━━━━━━━━━━\n🎫 Ticket ID: #${id}\n👤 Visitor: ${name}\n📅 Date: ${date} (${slot})\n🏷️ Category: ${type}\n💰 Amount Paid: ₹${price}\n━━━━━━━━━━━━━━━━━━━━\nPlease show this ID at entry counter. Enjoy your visit!`,
    error:      '❌ Could not connect to backend server. Make sure FastAPI server is running.',
    restart:    'Type anything or click Reset to book another ticket.',
    placeholder:'Type your reply here...',
    resetToast: 'Chat session reset.',
    valEmpty:   'Please provide a non-empty response.',
    valDate:    'Please enter a valid date in YYYY-MM-DD format (e.g. 2026-12-25).',
    valName:    'Please enter a valid name (at least 2 letters).',
    valType:    'Please choose: Adult, Child, or Senior.',
  },
  hi: {
    welcome:    'राष्ट्रीय संग्रहालय में आपका स्वागत है! 🏛️\nमैं टिकट बुक करने और समय, प्रदर्शनी, व पते के बारे में जानकारी देने में मदद कर सकता हूँ।\n\nकृपया अपनी यात्रा की तारीख दर्ज करें (उदा. 2026-12-25 या YYYY-MM-DD):',
    askDate:    'कृपया यात्रा की तारीख दर्ज करें (YYYY-MM-DD):',
    askTime:    'समय स्लॉट चुनें (उदा. 10:00 AM, 12:00 PM, 02:00 PM, 04:00 PM):',
    askName:    'मुख्य आगंतुक का पूरा नाम दर्ज करें:',
    askType:    'टिकट श्रेणी चुनें – वयस्क (₹100), बच्चा (₹50), या वरिष्ठ (₹70):',
    processing: '⏳ बुकिंग प्रक्रिया और टिकट तैयार किया जा रहा है...',
    payment:    '💳 भुगतान सत्यापित और सफल रहा! ✅',
    confirm:    (id, price, name, date, slot, type) => 
      `🎉 बुकिंग की पुष्टि हुई!\n━━━━━━━━━━━━━━━━━━━━\n🎫 टिकट ID: #${id}\n👤 आगंतुक: ${name}\n📅 तारीख: ${date} (${slot})\n🏷️ श्रेणी: ${type}\n💰 भुगतान: ₹${price}\n━━━━━━━━━━━━━━━━━━━━\nकृपया काउंटर पर यह ID दिखाएं। यात्रा शुभ हो!`,
    error:      '❌ बैकएंड सर्वर से संपर्क नहीं हो सका। कृपया सुनिश्चित करें कि सर्वर चल रहा है।',
    restart:    'नया टिकट बुक करने के लिए कुछ भी टाइप करें या Reset दबाएं।',
    placeholder:'यहाँ अपना जवाब टाइप करें...',
    resetToast: 'चैट सत्र रीसेट कर दिया गया है।',
    valEmpty:   'कृपया खाली जवाब न दें।',
    valDate:    'कृपया YYYY-MM-DD प्रारूप में मान्य तिथि दर्ज करें।',
    valName:    'कृपया मान्य नाम दर्ज करें (कम से कम 2 अक्षर)।',
    valType:    'कृपया चुनें: वयस्क, बच्चा, या वरिष्ठ।',
  },
};

let lang = 'en';
let step = 0;
let booking = {};

// DOM Elements
const chatBox       = document.getElementById('chat');
const input         = document.getElementById('user-input');
const sendBtn       = document.getElementById('send-btn');
const resetBtn      = document.getElementById('reset-btn');
const dashboardBtn  = document.getElementById('dashboard-btn');
const langSelect    = document.getElementById('lang');
const toast         = document.getElementById('toast');

// Modal Elements
const modal         = document.getElementById('dashboard-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const refreshDashBtn= document.getElementById('refresh-dashboard-btn');
const statTotalTix  = document.getElementById('stat-total-tickets');
const statTotalRev  = document.getElementById('stat-total-revenue');
const statCatSplit  = document.getElementById('stat-category-split');
const ticketsTbody  = document.getElementById('tickets-tbody');

// ── Toast & Chat Helpers ──────────────────────────────────────────────────────

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.className = `toast ${isError ? 'toast-error' : 'toast-info'}`;
  setTimeout(() => {
    toast.className = 'toast hidden';
  }, 3200);
}

function addMessage(text, sender = 'bot') {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.innerText = text;
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

// ── Validation Helpers ────────────────────────────────────────────────────────

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
  } else if (lower.includes('adult') || lower.includes('वयस्क') || lower.includes('general')) {
    return { type: 'Adult', price: 100 };
  }
  return null;
}

// ── Conversational FAQs / Museum Knowledge ────────────────────────────────────

function checkFaq(query) {
  const q = query.toLowerCase();
  if (q.includes('timing') || q.includes('time') || q.includes('hours') || q.includes('open') || q.includes('समय')) {
    return lang === 'hi' 
      ? '⏰ संग्रहालय मंगलवार से रविवार सुबह 10:00 बजे से शाम 6:00 बजे तक खुला रहता है (सोमवार को बंद रहता है)।'
      : '⏰ The museum is open Tuesday to Sunday from 10:00 AM to 06:00 PM (Closed on Mondays).';
  }
  if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('कहाँ') || q.includes('पता')) {
    return lang === 'hi'
      ? '📍 संग्रहालय हेरिटेज चौक, राजपथ, नई दिल्ली में स्थित है। निकटतम मेट्रो स्टेशन: सेंट्रल सेक्रेटेरिएट।'
      : '📍 Location: National Heritage Square, Rajpath, New Delhi. Nearest Metro: Central Secretariat.';
  }
  if (q.includes('price') || q.includes('fee') || q.includes('cost') || q.includes('दर') || q.includes('दाम')) {
    return lang === 'hi'
      ? '🎟️ टिकट दरें:\n• वयस्क: ₹100\n• बच्चा (5-12 वर्ष): ₹50\n• वरिष्ठ नागरिक: ₹70'
      : '🎟️ Ticket Rates:\n• Adult: ₹100\n• Child (5-12 yrs): ₹50\n• Senior Citizen: ₹70';
  }
  if (q.includes('parking') || q.includes('गाड़ी')) {
    return lang === 'hi'
      ? '🚗 हाँ, संग्रहालय परिसर में आगंतुकों के लिए निःशुल्क 2-व्हीलर और 4-व्हीलर पार्किंग उपलब्ध है।'
      : '🚗 Yes, dedicated free visitor parking is available for 2-wheelers and 4-wheelers inside gate #2.';
  }
  return null;
}

// ── Booking Flow ──────────────────────────────────────────────────────────────

async function handleInput(text) {
  text = text.trim();
  if (!text) {
    showToast(i18n[lang].valEmpty, true);
    return;
  }

  addMessage(text, 'user');
  input.value = '';

  // Check if it's an FAQ question first
  const faqAnswer = checkFaq(text);
  if (faqAnswer) {
    addMessage(faqAnswer, 'bot');
    if (step === 0) {
      setTimeout(() => botSay('askDate'), 500);
    }
    return;
  }

  switch (step) {
    case 0: // Date step
      if (!validateDate(text)) {
        showToast(i18n[lang].valDate, true);
        botSay('askDate');
        return;
      }
      booking.date = text;
      step++;
      botSay('askTime');
      break;

    case 1: // Time step
      booking.time = text;
      step++;
      botSay('askName');
      break;

    case 2: // Name step
      if (!validateName(text)) {
        showToast(i18n[lang].valName, true);
        botSay('askName');
        return;
      }
      booking.name = text;
      step++;
      botSay('askType');
      break;

    case 3: // Category & Submit
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
          botSay('confirm', result.id, booking.price, booking.name, booking.date, booking.time, booking.ticket_type);
          setTimeout(() => {
            botSay('restart');
            step = 0;
            booking = {};
          }, 1500);
        }, 800);
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
}

// ── Admin Dashboard Logic ─────────────────────────────────────────────────────

async function loadDashboard() {
  ticketsTbody.innerHTML = '<tr><td colspan="7" class="loading-cell">Loading real-time data from SQLite...</td></tr>';
  
  const tickets = await window.api.getTickets();

  if (!tickets || tickets.error) {
    ticketsTbody.innerHTML = `<tr><td colspan="7" class="error-cell">❌ Error loading data: ${tickets?.error || 'Backend offline'}</td></tr>`;
    return;
  }

  if (tickets.length === 0) {
    ticketsTbody.innerHTML = '<tr><td colspan="7" class="empty-cell">No tickets booked yet.</td></tr>';
    statTotalTix.textContent = '0';
    statTotalRev.textContent = '₹0';
    statCatSplit.textContent = '0 / 0 / 0';
    return;
  }

  // Aggregate metrics
  let totalRev = 0;
  let adultCount = 0;
  let childCount = 0;
  let seniorCount = 0;

  ticketsTbody.innerHTML = '';

  tickets.forEach(t => {
    totalRev += Number(t.price);
    const cat = (t.ticket_type || '').toLowerCase();
    if (cat.includes('adult')) adultCount++;
    else if (cat.includes('child')) childCount++;
    else if (cat.includes('senior')) seniorCount++;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#${t.id}</strong></td>
      <td>${escapeHtml(t.name)}</td>
      <td>${t.date}</td>
      <td>${t.time}</td>
      <td><span class="badge badge-${cat}">${t.ticket_type}</span></td>
      <td>₹${Number(t.price).toFixed(2)}</td>
      <td><span class="badge badge-paid">${t.payment_status || 'paid'}</span></td>
    `;
    ticketsTbody.appendChild(tr);
  });

  statTotalTix.textContent = tickets.length;
  statTotalRev.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
  statCatSplit.textContent = `${adultCount} / ${childCount} / ${seniorCount}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

// ── Event Listeners ───────────────────────────────────────────────────────────

sendBtn.addEventListener('click', () => handleInput(input.value));
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleInput(input.value);
});

resetBtn.addEventListener('click', () => {
  startFlow();
  showToast(i18n[lang].resetToast);
});

dashboardBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  loadDashboard();
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

refreshDashBtn.addEventListener('click', () => {
  loadDashboard();
  showToast('Dashboard refreshed');
});

// Close modal if user clicks outside modal-content
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

langSelect.addEventListener('change', (e) => {
  lang = e.target.value;
  setPlaceholder();
  startFlow();
});

// ── Init ──────────────────────────────────────────────────────────────────────
setPlaceholder();
startFlow();
