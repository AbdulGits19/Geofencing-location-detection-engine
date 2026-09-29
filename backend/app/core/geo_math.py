import math
from typing import List
from app.models.geofence_point import GeofencePoint

def get_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the distance between two GPS coordinates in meters using the Haversine formula."""
    R = 6371000  # Radius of Earth in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def is_inside_circle(target_lat: float, target_lon: float, center_lat: float, center_lon: float, radius_meters: float) -> bool:
    """Checks if a coordinate falls within a specified radius of a center point."""
    distance = get_distance_meters(target_lat, target_lon, center_lat, center_lon)
    return distance <= radius_meters

def is_inside_polygon(target_lat: float, target_lon: float, points: List[GeofencePoint]) -> bool:
    """
    Uses the Ray-Casting algorithm to determine if a point is inside a polygon.
    The points must be ordered sequentially.
    """
    if len(points) < 3:
        return False

    inside = False
    j = len(points) - 1
    
    for i in range(len(points)):
        pi = points[i]
        pj = points[j]
        
        # Check if the target point intersects the line segment between pi and pj
        if ((pi.longitude > target_lon) != (pj.longitude > target_lon)) and \
           (target_lat < (pj.latitude - pi.latitude) * (target_lon - pi.longitude) / (pj.longitude - pi.longitude) + pi.latitude):
            inside = not inside
            
        j = i
        
    return inside