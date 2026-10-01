export interface GeofencePoint {
  latitude: number;
  longitude: number;
  sequence: number;
}

export interface Geofence {
  id: number;
  name: string;
  type: 'circle' | 'polygon';
  radius: number | null;
  is_enabled: boolean;
  points: GeofencePoint[];
}

export interface GeofenceEvent {
  id: number;
  device_id: number;
  geofence_id: number;
  event_type: 'ENTER' | 'EXIT';
  timestamp: string;
}

export interface AnalyticsDashboard {
  total_geofences: number;
  active_geofences: number;
  total_devices: number;
  total_events_logged: number;
  recent_events: { event: string; time: string }[];
}