from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.device import Device
from app.models.geofence import Geofence
from app.models.event import GeofenceEvent
from app.schemas.extended import UserCreate, DeviceCreate, AnalyticsDashboard
from app.schemas.location import GeofenceEventResponse

router = APIRouter(tags=["Dashboard & System"])

@router.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(username=user.username, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/devices/")
def create_device(device: DeviceCreate, db: Session = Depends(get_db)):
    db_device = Device(name=device.name, user_id=device.user_id)
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

@router.get("/events/", response_model=list[GeofenceEventResponse])
def get_event_history(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(GeofenceEvent).order_by(GeofenceEvent.timestamp.desc()).limit(limit).all()

@router.get("/analytics/", response_model=AnalyticsDashboard)
def get_analytics(db: Session = Depends(get_db)):
    total_geo = db.query(Geofence).count()
    active_geo = db.query(Geofence).filter(Geofence.is_enabled == True).count()
    total_dev = db.query(Device).count()
    total_evt = db.query(GeofenceEvent).count()
    
    recent = db.query(GeofenceEvent).order_by(GeofenceEvent.timestamp.desc()).limit(5).all()
    
    return {
        "total_geofences": total_geo,
        "active_geofences": active_geo,
        "total_devices": total_dev,
        "total_events_logged": total_evt,
        "recent_events": [{"event": e.event_type, "time": e.timestamp} for e in recent]
    }