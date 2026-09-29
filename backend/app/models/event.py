from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class GeofenceEvent(Base):
    __tablename__ = "geofence_events"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id", ondelete="CASCADE"), nullable=False)
    geofence_id = Column(Integer, ForeignKey("geofences.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(20), nullable=False)  # Will store 'ENTER' or 'EXIT'
    timestamp = Column(DateTime(timezone=True), server_default=func.now())