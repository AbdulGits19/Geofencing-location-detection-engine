import enum
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class GeofenceType(enum.Enum):
    POLYGON = "polygon"
    CIRCLE = "circle"

class Geofence(Base):
    __tablename__ = "geofences"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(Enum(GeofenceType), nullable=False)
    radius = Column(Float, nullable=True)  # Only populated if type is CIRCLE
    is_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # One-to-many relationship with the points that make up the boundary
    # cascade="all, delete-orphan" ensures if a geofence is deleted, its points vanish too
    points = relationship("GeofencePoint", back_populates="geofence", cascade="all, delete-orphan")