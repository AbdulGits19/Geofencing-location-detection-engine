from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str

class DeviceCreate(BaseModel):
    name: str
    user_id: int

class AnalyticsDashboard(BaseModel):
    total_geofences: int
    active_geofences: int
    total_devices: int
    total_events_logged: int
    recent_events: List[dict]