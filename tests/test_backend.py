import pytest
import os
from fastapi.testclient import TestClient
from src.server import app
import src.database as db

client = TestClient(app)

def test_ping_endpoint():
    """Verify that backend server health check responds with pong."""
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"message": "pong"}

def test_create_ticket_success():
    """Verify booking a new ticket via POST /tickets."""
    payload = {
        "date": "2026-12-25",
        "time": "10:00 AM",
        "name": "Aarav Sharma",
        "ticket_type": "Adult",
        "price": 100.0,
        "payment_status": "paid"
    }
    response = client.post("/tickets", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["status"] == "created"
    assert isinstance(data["id"], int)

def test_create_ticket_validation_failure():
    """Verify that invalid payloads are rejected with HTTP 422."""
    bad_payload = {
        "date": "2026-12-25",
        # missing time, name, ticket_type, price
    }
    response = client.post("/tickets", json=bad_payload)
    assert response.status_code == 422

def test_get_tickets():
    """Verify retrieving list of all tickets via GET /tickets."""
    response = client.get("/tickets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    # Check structure of the latest created ticket
    ticket = data[0]
    assert "id" in ticket
    assert "name" in ticket
    assert "ticket_type" in ticket
    assert "price" in ticket
    assert "payment_status" in ticket
