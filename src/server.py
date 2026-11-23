from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.router import router as ticket_router

app = FastAPI(
    title="Museum Chatbot Ticketing System API",
    description="Backend service managing museum ticket bookings and visitor queries",
    version="1.0.0"
)

# Enable CORS for desktop/client access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(ticket_router)
