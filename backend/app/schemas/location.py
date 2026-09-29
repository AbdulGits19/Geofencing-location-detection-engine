from pydantic import BaseModel, ConfigDict
from datetime import datetime

class LocationCreate(BaseModel):
    device_id: int
    latitude: float
    longitude: float

class GeofenceEventResponse(BaseModel):
    id: int
    device_id: int
    geofence_id: int
    event_type: str
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)