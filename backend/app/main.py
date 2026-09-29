from fastapi import FastAPI
from app.api import geofences
from datetime import datetime

app = FastAPI(title="Geofence Event Detection API", version="1.0.0")

# Include the geofence endpoints
app.include_router(geofences.router)

@app.get("/")
def read_root():
    return {"owner" : "Abdul Basith S", "status": "Running", "message": "Geofence Engine is running", "timestamp": datetime.utcnow().isoformat() + "Z"}