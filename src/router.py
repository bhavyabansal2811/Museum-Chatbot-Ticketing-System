from fastapi import APIRouter, HTTPException
from typing import List
from src.models import TicketCreate
import src.database as db

router = APIRouter(tags=["Tickets"])

@router.get("/ping")
async def ping():
    return {"message": "pong"}

@router.post("/tickets")
async def create_ticket(ticket: TicketCreate):
    try:
        ticket_id = db.create_ticket(
            date=ticket.date,
            time=ticket.time,
            name=ticket.name,
            ticket_type=ticket.ticket_type,
            price=ticket.price,
            payment_status=ticket.payment_status or "paid",
        )
        return {"id": ticket_id, "status": "created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tickets", response_model=List[dict])
async def get_tickets():
    return db.list_tickets()

@router.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: int):
    success = db.delete_ticket(ticket_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {"status": "deleted", "id": ticket_id}

@router.delete("/tickets")
async def clear_all_tickets():
    deleted_count = db.clear_all_tickets()
    return {"status": "cleared", "count": deleted_count}
