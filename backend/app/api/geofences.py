from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.geofence import Geofence
from app.models.geofence_point import GeofencePoint
from app.schemas.geofence import GeofenceCreate, GeofenceResponse
router = APIRouter(prefix="/geofences", tags=["Geofences"])

@router.post("/", response_model=GeofenceResponse)
def create_geofence(geofence: GeofenceCreate, db: Session = Depends(get_db)):
    # 1. Save the main geofence record
    db_geofence = Geofence(
        name=geofence.name,
        type=geofence.type.value,
        radius=geofence.radius,
        is_enabled=geofence.is_enabled
    )
    db.add(db_geofence)
    db.commit()
    db.refresh(db_geofence)

    # 2. Save the associated boundary points
    for point in geofence.points:
        db_point = GeofencePoint(
            geofence_id=db_geofence.id,
            latitude=point.latitude,
            longitude=point.longitude,
            sequence=point.sequence
        )
        db.add(db_point)
    
    db.commit()
    db.refresh(db_geofence)
    return db_geofence

@router.get("/", response_model=List[GeofenceResponse])
def get_geofences(db: Session = Depends(get_db)):
    return db.query(Geofence).all()