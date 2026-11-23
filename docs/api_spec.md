# API Specification – Museum Chatbot Ticketing System

**Base URL:** `http://127.0.0.1:8000`

---

## Endpoints

### GET `/ping`
Health check to verify the backend is running.

**Response:**
```json
{ "message": "pong" }
```

---

### POST `/tickets`
Book a new museum ticket. Stores the booking in SQLite and returns the ticket ID.

**Request Body:**
```json
{
  "date":           "2026-12-25",
  "time":           "10:00 AM",
  "name":           "Bhavya Bansal",
  "ticket_type":    "Adult",
  "price":          100.0,
  "payment_status": "paid"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | ✅ | Visit date (YYYY-MM-DD) |
| `time` | string | ✅ | Time slot (e.g. "10:00 AM") |
| `name` | string | ✅ | Full name of visitor |
| `ticket_type` | string | ✅ | Adult / Child / Senior |
| `price` | float | ✅ | Ticket price (₹) |
| `payment_status` | string | ❌ | Defaults to `"paid"` |

**Success Response (200):**
```json
{ "id": 1, "status": "created" }
```

**Validation Error (422):**
```json
{
  "detail": [
    { "loc": ["body", "name"], "msg": "field required", "type": "value_error.missing" }
  ]
}
```

---

### GET `/tickets`
Retrieve a list of all booked tickets, sorted by most recent first.

**Response (200):**
```json
[
  {
    "id": 1,
    "date": "2026-12-25",
    "time": "10:00 AM",
    "name": "Bhavya Bansal",
    "ticket_type": "Adult",
    "price": 100.0,
    "payment_status": "paid",
    "created_at": "2026-12-24T18:30:00"
  }
]
```

---

## Running the API

```bash
uvicorn src.server:app --reload --host 127.0.0.1 --port 8000
```

Interactive docs (Swagger UI) available at: `http://127.0.0.1:8000/docs`
