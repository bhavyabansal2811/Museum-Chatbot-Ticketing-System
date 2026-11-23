import os
import sqlite3
from datetime import datetime
from src.config import DB_PATH

def get_connection():
    """Return a SQLite connection with foreign keys enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON;')
    return conn

def init_db():
    """Create the tickets table if it doesn't exist."""
    with get_connection() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                name TEXT NOT NULL,
                ticket_type TEXT NOT NULL,
                price REAL NOT NULL,
                payment_status TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
        ''')
        conn.commit()

def create_ticket(date: str, time: str, name: str, ticket_type: str, price: float, payment_status: str = "paid") -> int:
    """Insert a new ticket and return its id."""
    created_at = datetime.utcnow().isoformat()
    with get_connection() as conn:
        cur = conn.execute(
            '''
            INSERT INTO tickets (date, time, name, ticket_type, price, payment_status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''',
            (date, time, name, ticket_type, price, payment_status, created_at)
        )
        conn.commit()
        return cur.lastrowid

def list_tickets():
    """Return a list of all tickets as dicts."""
    with get_connection() as conn:
        cur = conn.execute('SELECT * FROM tickets ORDER BY id DESC')
        rows = cur.fetchall()
        return [dict(row) for row in rows]

def delete_ticket(ticket_id: int) -> bool:
    """Delete a specific ticket by its ID."""
    with get_connection() as conn:
        cur = conn.execute('DELETE FROM tickets WHERE id = ?', (ticket_id,))
        conn.commit()
        return cur.rowcount > 0

def clear_all_tickets() -> int:
    """Delete all tickets from the database."""
    with get_connection() as conn:
        cur = conn.execute('DELETE FROM tickets')
        conn.commit()
        return cur.rowcount

# Initialize DB on module import
init_db()
