from pydantic import BaseModel, Field
from typing import Optional

class TicketCreate(BaseModel):
    date: str = Field(..., description="Date of visit in YYYY-MM-DD format", example="2026-12-25")
    time: str = Field(..., description="Time slot for the visit", example="10:00 AM")
    name: str = Field(..., description="Full name of the visitor", example="John Doe")
    ticket_type: str = Field(..., description="Category of ticket (Adult, Child, Senior)", example="Adult")
    price: float = Field(..., ge=0, description="Ticket price paid", example=100.0)
    payment_status: Optional[str] = Field("paid", description="Payment status (paid/pending)")

class TicketResponse(BaseModel):
    id: int
    date: str
    time: str
    name: str
    ticket_type: str
    price: float
    payment_status: str
    created_at: str
