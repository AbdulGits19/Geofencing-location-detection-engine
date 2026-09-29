from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from enum import Enum
from datetime import datetime

class GeofenceType(str, Enum):
    POLYGON = "polygon"
    CIRCLE = "circle"

# Schema for incoming point data
class GeofencePointBase(BaseModel):
    latitude: float
    longitude: float
    sequence: int

# Schema for incoming geofence creation requests
class GeofenceCreate(BaseModel):
    name: str
    type: GeofenceType
    radius: Optional[float] = None
    is_enabled: bool = True
    points: List[GeofencePointBase] = []

# Schema for outgoing API responses
class GeofenceResponse(GeofenceCreate):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)