import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import api from '../services/api';
import type { GeofenceEvent } from '../types';

export default function EventLogs() {
  const [events, setEvents] = useState<GeofenceEvent[]>([]);

  useEffect(() => {
    api.get('/events/?limit=100')
       .then(res => setEvents(res.data))
       .catch(console.error);
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#0f172a' }}>Event Audit Logs</Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mt: 0.25 }}>
          Immutable ledger of all spatial boundary transitions.
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table size="medium">
          <TableHead sx={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5 }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5 }}>Transition</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5 }}>Device ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5 }}>Geofence ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((evt) => (
              <TableRow key={evt.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { backgroundColor: '#f8fafc' } }}>
                <TableCell sx={{ color: '#475569', fontSize: '0.85rem', fontFamily: 'monospace' }}>
  {new Date(evt.timestamp.endsWith('Z') ? evt.timestamp : `${evt.timestamp.replace(' ', 'T')}Z`).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </TableCell>
                <TableCell>
                  <Chip
                    label={evt.event_type}
                    size="small"
                    sx={{
                      backgroundColor: evt.event_type === 'ENTER' ? '#f0fdf4' : '#fef2f2',
                      color: evt.event_type === 'ENTER' ? '#15803d' : '#b91c1c',
                      border: `1px solid ${evt.event_type === 'ENTER' ? '#bbf7d0' : '#fecaca'}`,
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      borderRadius: '4px',
                      height: 22,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  DEV-{evt.device_id.toString().padStart(4, '0')}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  ZONE-{evt.geofence_id.toString().padStart(4, '0')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}