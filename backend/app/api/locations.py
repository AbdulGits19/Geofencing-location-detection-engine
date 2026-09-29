from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.location import LocationEvent
from app.models.event import GeofenceEvent
from app.models.geofence import Geofence, GeofenceType
from app.schemas.location import LocationCreate, GeofenceEventResponse
from app.core import geo_math

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.post("/", response_model=List[GeofenceEventResponse])
def process_location(location: LocationCreate, db: Session = Depends(get_db)):
    # 1. Log the raw incoming location
    db_location = LocationEvent(
        device_id=location.device_id,
        latitude=location.latitude,
        longitude=location.longitude
    )
    db.add(db_location)
    db.commit()

    # 2. Fetch all active geofences to evaluate
    active_geofences = db.query(Geofence).filter(Geofence.is_enabled == True).all()
    triggered_events = []

    for fence in active_geofences:
        is_currently_inside = False
        
        if fence.type == GeofenceType.CIRCLE and fence.points:
            # Circle uses the first point as the center
            center = fence.points[0]
            is_currently_inside = geo_math.is_inside_circle(
                location.latitude, location.longitude,
                center.latitude, center.longitude,
                fence.radius
            )
        elif fence.type == GeofenceType.POLYGON and len(fence.points) >= 3:
            is_currently_inside = geo_math.is_inside_polygon(
                location.latitude, location.longitude,
                fence.points
            )

        # 3. Check the previous state to detect a transition
        last_event = db.query(GeofenceEvent).filter(
            GeofenceEvent.device_id == location.device_id,
            GeofenceEvent.geofence_id == fence.id
        ).order_by(GeofenceEvent.timestamp.desc()).first()

        was_inside = (last_event.event_type == 'ENTER') if last_event else False

        # 4. Evaluate transitions
        event_type = None
        if is_currently_inside and not was_inside:
            event_type = 'ENTER'
        elif not is_currently_inside and was_inside:
            event_type = 'EXIT'

        # 5. Record state change if applicable
        if event_type:
            new_event = GeofenceEvent(
                device_id=location.device_id,
                geofence_id=fence.id,
                event_type=event_type
            )
            db.add(new_event)
            triggered_events.append(new_event)

    db.commit()
    
    # Refresh to attach generated IDs and timestamps before returning
    for event in triggered_events:
        db.refresh(event)
        
    return triggered_events