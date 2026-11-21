from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import src.database as db

app = FastAPI()

@app.get("/ping")
async def ping():
    return {"message": "pong"}

class TicketCreate(BaseModel):
    date: str
    time: str
    name: str
    ticket_type: str
    price: float
    payment_status: str = "paid"

@app.post("/tickets")
async def create_ticket(ticket: TicketCreate):
    ticket_id = db.create_ticket(
        date=ticket.date,
        time=ticket.time,
        name=ticket.name,
        ticket_type=ticket.ticket_type,
        price=ticket.price,
        payment_status=ticket.payment_status,
    )
    return {"id": ticket_id, "status": "created"}

@app.get("/tickets", response_model=List[dict])
async def get_tickets():
    return db.list_tickets()
