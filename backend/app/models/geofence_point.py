from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class GeofencePoint(Base):
    __tablename__ = "geofence_points"

    id = Column(Integer, primary_key=True, index=True)
    geofence_id = Column(Integer, ForeignKey("geofences.id", ondelete="CASCADE"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    sequence = Column(Integer, nullable=False)  # The order to connect the dots for a polygon

    geofence = relationship("Geofence", back_populates="points")