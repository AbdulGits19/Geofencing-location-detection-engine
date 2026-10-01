import { useEffect, useState } from 'react';
import { Typography, Box, Paper, Chip, Button, TextField, MenuItem } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import api from '../services/api';
import type { AnalyticsDashboard } from '../types';

const COLORS = ['#FFBB2D', '#e2e8f0'];

// Helper: Forces naive UTC strings from MySQL/FastAPI to be parsed as UTC before converting to IST
const formatISTTime = (rawTime: string) => {
  const isoUtc = rawTime.endsWith('Z') ? rawTime : `${rawTime.replace(' ', 'T')}Z`;
  return new Date(isoUtc).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [simDevice, setSimDevice] = useState(1);
  const [simLat, setSimLat] = useState('19.1100');
  const [simLon, setSimLon] = useState('73.0170');
  const [pingResult, setPingResult] = useState<string | null>(null);

  const fetchAnalytics = () => {
    api.get('/analytics/')
       .then(res => setData(res.data))
       .catch(console.error);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleSimulatePing = async () => {
    try {
      const res = await api.post('/locations/', {
        device_id: Number(simDevice),
        latitude: parseFloat(simLat),
        longitude: parseFloat(simLon),
      });
      if (res.data && res.data.length > 0) {
        // Show ALL transitions if a ping exits an old zone and enters a new one simultaneously
        const summary = res.data
          .map((e: { event_type: string; geofence_id: number }) => `${e.event_type} (ZONE-${e.geofence_id.toString().padStart(4, '0')})`)
          .join(' & ');
        setPingResult(`Triggered: ${summary}`);
      } else {
        setPingResult('Ping logged (No boundary transition)');
      }
      fetchAnalytics();
    } catch {
      setPingResult('Failed to transmit ping');
    }
  };

  if (!data) return <Typography sx={{ fontWeight: 600, color: '#64748b' }}>Synchronizing telemetry...</Typography>;

  const pieData = [
    { name: 'Active', value: data.active_geofences },
    { name: 'Inactive', value: Math.max(0, data.total_geofences - data.active_geofences) },
  ];

  const barData = [
    { name: 'Total Fences', count: data.total_geofences },
    { name: 'Active Fences', count: data.active_geofences },
    { name: 'Devices', count: data.total_devices },
    { name: 'Transitions', count: data.total_events_logged },
  ];

  const stats = [
    { label: 'Total Geofences', value: data.total_geofences, sub: 'Configured zones' },
    { label: 'Active Boundaries', value: data.active_geofences, sub: 'Enforcing rules' },
    { label: 'Tracked Devices', value: data.total_devices, sub: 'Online endpoints' },
    { label: 'Logged Transitions', value: data.total_events_logged, sub: 'ENTER / EXIT events' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 4 }}>
      <Box>
        <Typography variant="h5" sx={{ color: '#0f172a' }}>Live Telemetry</Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mt: 0.25 }}>
          Real-time spatial metrics and boundary enforcement status.
        </Typography>
      </Box>

      {/* Top 4 KPI Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
        {stats.map((stat, idx) => (
          <Paper key={idx} sx={{ p: 2.5, borderRadius: '8px', borderTop: idx === 0 ? '3px solid #FFBB2D' : '1px solid #e2e8f0' }}>
            <Typography sx={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {stat.label}
            </Typography>
            <Typography variant="h4" sx={{ color: '#0f172a', my: 0.75 }}>
              {stat.value}
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>
              {stat.sub}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Middle Visualizations Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2.5 }}>
        <Paper sx={{ p: 3, borderRadius: '8px', height: 320, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
            System Composition
          </Typography>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 6, border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                <Bar dataKey="count" fill="#FFBB2D" radius={[4, 4, 0, 0]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: '8px', height: 320, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 1, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
            Boundary Status ({data.active_geofences}/{data.total_geofences} Active)
          </Typography>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: 6, border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      {/* Bottom Row: Recent Transitions & Ping Simulator */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2.5 }}>
        <Paper sx={{ p: 3, borderRadius: '8px' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
            Recent Activity Stream
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {data.recent_events.map((evt, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.25, px: 2, borderRadius: '6px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    label={evt.event}
                    size="small"
                    sx={{
                      borderRadius: '4px',
                      height: 22,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      bgcolor: evt.event === 'ENTER' ? '#dcfce7' : '#fee2e2',
                      color: evt.event === 'ENTER' ? '#166534' : '#991b1b',
                    }}
                  />
                  <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                    Boundary state transition recorded
                  </Typography>
                </Box>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {formatISTTime(evt.time)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: '8px', bgcolor: '#0f172a', color: '#fff', border: 'none' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFBB2D', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5, mb: 0.5 }}>
            Telemetry Ping Simulator
          </Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', mb: 2 }}>
            Transmit coordinates to evaluate boundary transitions.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              select
              label="Device"
              value={simDevice}
              onChange={(e) => setSimDevice(Number(e.target.value))}
              size="small"
              sx={{ bgcolor: '#1e293b', borderRadius: '6px', '& .MuiSelect-select': { color: '#fff', fontSize: '0.85rem' }, label: { color: '#94a3b8' } }}
            >
              {[1, 2, 3, 4, 5, 6].map(id => <MenuItem key={id} value={id}>DEV-000{id}</MenuItem>)}
            </TextField>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <TextField
                label="Latitude"
                value={simLat}
                onChange={(e) => setSimLat(e.target.value)}
                size="small"
                sx={{ bgcolor: '#1e293b', borderRadius: '6px', input: { color: '#fff', fontSize: '0.85rem' }, label: { color: '#94a3b8' } }}
              />
              <TextField
                label="Longitude"
                value={simLon}
                onChange={(e) => setSimLon(e.target.value)}
                size="small"
                sx={{ bgcolor: '#1e293b', borderRadius: '6px', input: { color: '#fff', fontSize: '0.85rem' }, label: { color: '#94a3b8' } }}
              />
            </Box>
            <Button
              variant="contained"
              endIcon={<SendRoundedIcon fontSize="small" />}
              onClick={handleSimulatePing}
              sx={{ bgcolor: '#FFBB2D', color: '#0f172a', fontWeight: 700, py: 1, borderRadius: '6px', '&:hover': { bgcolor: '#f59e0b' } }}
            >
              Send Ping
            </Button>
            {pingResult && (
              <Typography sx={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', fontFamily: 'monospace' }}>
                {pingResult}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}