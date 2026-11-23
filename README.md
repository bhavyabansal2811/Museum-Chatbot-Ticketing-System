# Museum‑Chatbot‑Ticketing‑System

![CI/CD Pipeline](https://github.com/bhavyabansal2811/Museum-Chatbot-Ticketing-System/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

## Overview
A multilingual desktop chatbot that lets museum visitors book tickets, pay for them, and receive instant confirmations—all from a single Electron‑based application. The system removes long queues, eliminates manual entry errors, and captures booking data for later analysis.

## Features
| Category | Details |
|----------|---------|
| **Instant Booking** | Users pick a date, time‑slot, and ticket type through a conversational UI. |
| **Multilingual** | Built‑in language selector (English + Hindi). |
| **Mock Payment** | Simulates payment flow with instant confirmation and unique ticket ID. |
| **Analytics CLI** | Stores each transaction in SQLite; admin script shows daily sales and revenue. |
| **Desktop‑First** | Runs as a native desktop app on Windows/macOS/Linux via Electron. |
| **Input Validation** | Validates date format, name length, and ticket category with error toasts. |
| **Modular Backend** | FastAPI with clean separation of models, router, database, and config layers. |
| **Tested & CI/CD** | Unit tests (pytest + Jest) run automatically on every push via GitHub Actions. |

## Tech Stack
| Layer | Technology |
|-------|-----------|
| **Desktop UI** | Electron.js (Node.js + Chromium) |
| **Backend API** | FastAPI (Python) |
| **Database** | SQLite (file‑based, no server needed) |
| **Language** | JavaScript (frontend), Python (backend) |
| **Testing** | pytest (backend), Jest (frontend) |
| **CI/CD** | GitHub Actions |

## Quick Start

See [docs/quick-start.md](docs/quick-start.md) for the full setup guide.

```bash
# Backend
pip install -r requirements.txt
uvicorn src.server:app --reload

# Frontend (new terminal)
npm install && npm start
```

## Project Structure
```
Museum-Chatbot-Ticketing-System/
├── electron/              # Electron desktop app
│   ├── main.js            # Main process
│   ├── preload.js         # Secure contextBridge
│   └── renderer/          # UI (HTML, CSS, JS)
├── src/                   # FastAPI backend
│   ├── server.py          # App entry + CORS
│   ├── router.py          # API endpoints
│   ├── models.py          # Pydantic schemas
│   ├── database.py        # SQLite helpers
│   ├── config.py          # .env loader
│   └── stats.py           # Admin analytics CLI
├── tests/                 # Test suites
│   ├── test_backend.py    # pytest API tests
│   └── test_renderer.js   # Jest UI tests
├── docs/                  # Documentation
│   ├── architecture.md    # System design diagram
│   ├── api_spec.md        # REST API reference
│   └── quick-start.md     # Setup guide
├── .github/workflows/     # GitHub Actions CI/CD
├── requirements.txt       # Python dependencies
├── package.json           # Node dependencies
└── .env.example           # Sample config
```

## Documentation
- [Architecture Diagram](docs/architecture.md)
- [API Specification](docs/api_spec.md)
- [Quick Start Guide](docs/quick-start.md)

## License
This project is released under the **MIT License**. See the `LICENSE` file for full terms.

---
*Developed by Bhavya Bansal*
