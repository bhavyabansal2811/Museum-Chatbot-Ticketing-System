# Quick Start Guide

## Prerequisites

Make sure you have these installed:
- **Node.js** v18+ – https://nodejs.org
- **Python** 3.10+ – https://python.org
- **Git** – https://git-scm.com

---

## 1. Clone the Repository

```bash
git clone https://github.com/bhavyabansal2811/Museum-Chatbot-Ticketing-System.git
cd Museum-Chatbot-Ticketing-System
```

---

## 2. Set Up the Backend (FastAPI)

```bash
# Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Copy the sample environment file
cp .env.example .env

# Start the FastAPI server
uvicorn src.server:app --reload --host 127.0.0.1 --port 8000
```

The API will be live at **http://127.0.0.1:8000**  
Swagger docs available at **http://127.0.0.1:8000/docs**

---

## 3. Set Up the Desktop App (Electron)

Open a **new terminal tab** (keep the backend running):

```bash
# Install Node.js dependencies
npm install

# Launch the Electron desktop app
npm start
```

A desktop window will open with the Museum Ticket Chatbot. 🏛️

---

## 4. Book a Ticket (Demo Flow)

1. Select language: **English** or **हिंदी**
2. Enter visit date (e.g. `2026-12-25`)
3. Choose a time slot (e.g. `10:00 AM`)
4. Enter your full name
5. Choose ticket type: `Adult` (₹100), `Child` (₹50), or `Senior` (₹70)
6. See mock payment success and booking confirmation with ticket ID ✅

---

## 5. Run Tests

**Backend tests (pytest):**
```bash
python -m pytest tests/test_backend.py -v
```

**Frontend tests (Jest):**
```bash
npm test
```

---

## 6. View Analytics

Run the admin analytics CLI to see booking stats:

```bash
python src/stats.py
```

Output includes total tickets sold, revenue, category breakdown, and daily visitor trends.

---

## 7. Build a Desktop Installer

```bash
npm run make
```

This creates a distributable installer for your OS in the `out/` folder.
