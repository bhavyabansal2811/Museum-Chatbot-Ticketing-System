# Museum‑Chatbot‑Ticketing‑System

## Overview
A multilingual desktop chatbot that lets museum visitors book tickets, pay for them, and receive instant confirmations—all from a single Electron‑based application. The system removes long queues, eliminates manual entry errors, and captures booking data for later```markdown
# Museum‑Chatbot‑Ticketing‑System

## Overview
A multilingual desktop chatbot that lets museum visitors book tickets, pay for them, and receive instant confirmations—all from a single Electron‑based application. The system removes long queues, eliminates manual entry errors, and captures booking data for later analysis.

## Features
| Category          | Details |
|-------------------|---------|
| **Instant Booking** | Users pick a date, time‑slot, and ticket type through a conversational UI. |
| **Multilingual** | Built‑in language selector (English + additional languages). |
| **Payment Automation** | Integrates a payment gateway (e.g., Stripe, Razorpay) so the flow is fully hands‑free. |
| **Analytics** | Stores each transaction in a local database; dashboards can show daily sales, visitor demographics, etc. |
| **Desktop‑First** | Runs as a native‑looking desktop app on Windows/macOS/Linux via Electron. |
| **Error‑Free** | Atomic booking + payment transaction prevents double‑booking and lost records. |
| **Scalable** | Backend API can handle many concurrent users; the Electron front‑end remains lightweight. |

## Tech Stack
| Layer | Technology (you already know) |
|-------|--------------------------------|
| **Desktop UI** | **Electron** (Node.js + Chromium) |
| **Backend API** | **FastAPI** (Python) – exposes endpoints for creating tickets, processing payments, and fetching analytics |
| **Runtime** | **Node.js** (for Electron) |
| **Language** | **JavaScript / TypeScript** (client side) |
| **Database** | **SQLite** (file‑based DB; no extra server needed) |
| **Styling** | HTML + CSS (standard web stack) |

*You can swap the payment provider or add more languages later without changing the core stack.*

## Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your‑username>/Museum-Chatbot-Ticketing-System.git
cd Museum-Chatbot-Ticketing-System
```

### 2️⃣ Set up the **backend** (FastAPI)

```bash
# Python virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file (do not commit it)
cat <<EOF > .env
BOT_TOKEN=your_chatbot_token               # e.g., Telegram bot token
PAYMENT_KEY=your_payment_gateway_key       # e.g., Stripe secret key
DATABASE_URL=sqlite:///data/bookings.db
EOF

# Run the FastAPI server (will listen on http://127.0.0.1:8000)
 src.server:app --reload
```

> The backend now provides `/book`, `/pay`, and `/stats` endpoints that the Electron front‑end will call.

### 3️⃣ Set up the **desktop client** (Electron)

```bash
# Install Node dependencies
npm install

# Start the Electron app (it will launch a window and talk to the FastAPI server)
npm start
```

If you prefer a production build:

```bash
npm run build   # creates a packaged app for your OS
```

### 4️⃣ Test a booking flow
1. Open the Electron window.  
2. The chatbot greets you and asks for a language.  
3. Choose a date, time‑slot, and ticket quantity.  
4. Proceed to payment – the app redirects to the configured gateway and then returns a confirmation message.  
5. Check `data/bookings.db` (or open the analytics dashboard via the app) to see the recorded transaction.

## Project Structure

Museum-Chatbot-Ticketing-System/
│
├─ .gitignore
├─ README.md
├─ LICENSE
├─ requirements.txt          # Python dependencies (fastapi, uvicorn, pydantic, etc.)
├─ package.json              # Node/Electron dependencies
├─ .env                      # runtime secrets (not committed)
│
├─ data/                     # SQLite DB file lives here (git‑ignored)
│
├─ src/                      # Python backend
│   ├─ init.py
│   ├─ server.py             # FastAPI app + routes
│   └─ models.py             # Pydantic models for tickets, payments, etc.
│
├─ electron/                 # Electron front‑end
│   ├─ main.js               # creates BrowserWindow
│   ├─ preload.js            # contextBridge API for renderer
│   ├─ renderer/
│   │   ├─ index.html
│   │   ├─ style.css
│   │   └─ renderer.js       # UI logic, calls backend API
│   └─ assets/               # icons, images
│
├─ tests/                    # unit / integration tests (Python & JS)
│   ├─ test_backend.py
│   └─ test_renderer.js
└─ docs/                     # design notes, flowcharts, API spec

## License
This project is released under the **MIT License**. See the `LICENSE` file for full terms.
---  
*Developed for myself for a real project i worked on and developed myself.*
