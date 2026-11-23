"""
Museum Ticketing System - Admin Analytics CLI
Run this script to inspect booking statistics, revenue, and daily trends.
Usage:
    python -m src.stats
    or
    python src/stats.py
"""

import sys
import sqlite3
from collections import defaultdict
from src.database import get_connection

def generate_report():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, date, time, name, ticket_type, price, payment_status, created_at FROM tickets")
    rows = cur.fetchall()

    if not rows:
        print("\n" + "="*50)
        print("       MUSEUM TICKETING SYSTEM - ANALYTICS       ")
        print("="*50)
        print("  No tickets booked yet.")
        print("="*50 + "\n")
        return

    total_tickets = len(rows)
    total_revenue = sum(row["price"] for row in rows)

    type_counts = defaultdict(int)
    type_revenue = defaultdict(float)
    date_counts = defaultdict(int)

    for row in rows:
        t_type = row["ticket_type"].capitalize()
        type_counts[t_type] += 1
        type_revenue[t_type] += row["price"]
        date_counts[row["date"]] += 1

    print("\n" + "="*55)
    print("      🏛️  MUSEUM TICKETING SYSTEM - ANALYTICS REPORT     ")
    print("="*55)
    print(f"  Total Tickets Issued : {total_tickets}")
    print(f"  Total Revenue        : ₹{total_revenue:,.2f}")
    print("-"*55)
    print("  Category Breakdown:")
    for cat, count in sorted(type_counts.items()):
        rev = type_revenue[cat]
        print(f"    • {cat:<10} : {count:>4} tickets  |  ₹{rev:>8,.2f}")
    print("-"*55)
    print("  Bookings by Visit Date:")
    for v_date, count in sorted(date_counts.items()):
        print(f"    • {v_date:<12} : {count:>4} visitors")
    print("="*55 + "\n")

if __name__ == "__main__":
    generate_report()
