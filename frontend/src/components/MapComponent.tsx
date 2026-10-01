import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Polygon, Popup } from 'react-leaflet';
import api from '../services/api';
import type { Geofence } from '../types';

export default function MapComponent() {
  const [geofences, setGeofences] = useState<Geofence[]>([]);

  useEffect(() => {
    const fetchGeofences = async () => {
      try {
        const response = await api.get('/geofences/');
        setGeofences(response.data);
      } catch (error) {
        console.error("Error fetching geofences:", error);
      }
    };
    fetchGeofences();
  }, []);

  // Centering the map to encompass the South Indian data points
  const mapCenter: [number, number] = [14.4426, 79.9772];

  return (
    <div style={{ height: '70vh', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {geofences.map((gf) => {
          if (gf.type === 'circle' && gf.points.length > 0) {
            const center = gf.points[0];
            return (
              <Circle
                key={gf.id}
                center={[center.latitude, center.longitude]}
                radius={gf.radius || 0}
                pathOptions={{ color: gf.is_enabled ? '#3b82f6' : '#9ca3af' }}
              >
                <Popup>
                  <strong>{gf.name}</strong><br />
                  Radius: {gf.radius}m
                </Popup>
              </Circle>
            );
          } else if (gf.type === 'polygon' && gf.points.length > 0) {
            // Sort polygon points by sequence to ensure the shape draws correctly
            const positions: [number, number][] = gf.points
              .sort((a, b) => a.sequence - b.sequence)
              .map(p => [p.latitude, p.longitude]);
            
            return (
              <Polygon
                key={gf.id}
                positions={positions}
                pathOptions={{ color: gf.is_enabled ? '#8b5cf6' : '#9ca3af' }}
              >
                <Popup>
                  <strong>{gf.name}</strong><br />
                  Type: Polygon
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
}