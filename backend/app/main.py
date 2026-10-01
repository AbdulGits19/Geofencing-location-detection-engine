from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import geofences, locations, dashboard
from datetime import datetime

app = FastAPI(title="Radiusly Geofence Event Detection API", version="1.0.0")

# Explicitly whitelist the Vite development servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(geofences.router)
app.include_router(locations.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {
        "owner" : "Abdul Basith S", 
        "status": "Lively!", 
        "message": "Geofence Engine is running", 
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }