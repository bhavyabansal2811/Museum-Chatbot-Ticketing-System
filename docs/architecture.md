# System Architecture – Museum Chatbot Ticketing System

## Overview

```
┌─────────────────────────────────────────────────────┐
│                  Electron Desktop App               │
│                                                     │
│  ┌──────────────┐   contextBridge   ┌────────────┐  │
│  │  Renderer    │ ◄───────────────► │  Preload   │  │
│  │  (HTML/CSS/  │                   │  (preload  │  │
│  │   JS UI)     │                   │   .js)     │  │
│  └──────┬───────┘                   └─────┬──────┘  │
│         │                                 │         │
│         └──────── fetch (HTTP) ───────────┘         │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP REST (localhost:8000)
                           ▼
         ┌─────────────────────────────────┐
         │         FastAPI Backend         │
         │                                 │
         │  server.py ──► router.py        │
         │                   │             │
         │             models.py           │
         │                   │             │
         │             database.py         │
         │                   │             │
         └───────────────────┼─────────────┘
                             │ SQL queries
                             ▼
                    ┌─────────────────┐
                    │   SQLite DB     │
                    │  tickets.db     │
                    └─────────────────┘
```

## Component Breakdown

| Component | File(s) | Responsibility |
|-----------|---------|----------------|
| **Main Process** | `electron/main.js` | Creates `BrowserWindow`, loads `preload.js`, handles `ipcMain` events |
| **Preload Bridge** | `electron/preload.js` | Exposes safe `api.bookTicket()` via `contextBridge` to the renderer |
| **Renderer UI** | `electron/renderer/` | Bilingual chatbot UI; step-based booking flow; validation; toast alerts |
| **API Server** | `src/server.py` | Mounts FastAPI app, adds CORS middleware, includes router |
| **Router** | `src/router.py` | Defines `/ping`, `POST /tickets`, `GET /tickets` endpoints |
| **Data Models** | `src/models.py` | Pydantic schemas (`TicketCreate`, `TicketResponse`) for validation |
| **Database Layer** | `src/database.py` | SQLite connection pool; `create_ticket()` and `list_tickets()` helpers |
| **Config** | `src/config.py` | Reads `.env`; exposes `DB_PATH` to other modules |
| **Analytics CLI** | `src/stats.py` | Admin tool for revenue reports and daily booking stats |

## Data Flow

```
User types → Renderer validates input
         → api.bookTicket(data) via contextBridge
         → fetch POST http://127.0.0.1:8000/tickets
         → FastAPI router validates Pydantic model
         → database.create_ticket() inserts into SQLite
         → Returns { id, status: "created" }
         → Renderer shows mock payment → confirmation
```

## Multilingual Support

- Language toggle (English / Hindi) in the UI header.
- All chatbot messages are sourced from a `i18n` dictionary in `renderer.js`.
- Ticket type parsing supports both English and Hindi keywords.
