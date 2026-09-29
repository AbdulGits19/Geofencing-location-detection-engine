from fastapi import FastAPI
from app.api import geofences, locations, dashboard
from datetime import datetime

app = FastAPI(title="Radiusly Geofence Event Detection API", version="1.0.0")

# Include the geofence endpoints
app.include_router(geofences.router)
app.include_router(locations.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"owner" : "Abdul Basith S", "status": "Lively!", "message": "Geofence Engine is running", "timestamp": datetime.utcnow().isoformat() + "Z"}