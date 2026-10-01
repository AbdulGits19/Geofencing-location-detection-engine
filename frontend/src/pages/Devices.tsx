import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RouterRoundedIcon from '@mui/icons-material/RouterRounded';
import api from '../services/api';

interface Device {
  id: number;
  name: string;
  user_id: number;
}

interface User {
  id: number;
  username: string;
  email: string;
}

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [open, setOpen] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');

  const fetchData = async () => {
    try {
      const [devRes, usrRes] = await Promise.all([
        api.get('/devices/'),
        api.get('/users/')
      ]);
      setDevices(devRes.data);
      setUsers(usrRes.data);
      if (usrRes.data.length > 0 && selectedUserId === '') {
        setSelectedUserId(usrRes.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching fleet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDevice = async () => {
    if (!deviceName.trim() || !selectedUserId) return;
    try {
      const res = await api.post('/devices/', {
        name: deviceName.trim(),
        user_id: Number(selectedUserId)
      });
      setDevices([...devices, res.data]);
      setDeviceName('');
      setOpen(false);
    } catch (error) {
      console.error("Error creating device:", error);
    }
  };

  const getUserName = (userId: number) => {
    const found = users.find(u => u.id === userId);
    return found ? found.username : `Operator #${userId}`;
  };

  if (loading) return <Typography sx={{ fontWeight: 600, color: '#64748b' }}>Loading device fleet...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Device Fleet
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mt: 0.25 }}>
            Manage tracked hardware trackers and mobile telemetry endpoints.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon fontSize="small" />}
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: '#0f172a',
            color: '#FFFFFF',
            borderRadius: '6px',
            px: 2,
            py: 0.9,
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#334155', boxShadow: 'none' }
          }}
        >
          Register Device
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead sx={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Device ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Hardware Model</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Assigned Operator</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Telemetry Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { backgroundColor: '#f8fafc' } }}>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  DEV-{device.id.toString().padStart(4, '0')}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box sx={{ p: 0.6, borderRadius: '4px', bgcolor: '#f1f5f9', color: '#475569', display: 'flex' }}>
                      <RouterRoundedIcon sx={{ fontSize: 16 }} />
                    </Box>
                    <Typography sx={{ color: '#0f172a', fontWeight: 600, fontSize: '0.875rem' }}>
                      {device.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#0f172a', fontWeight: 500, fontSize: '0.85rem' }}>
                      {getUserName(device.user_id)}
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      (USR-{device.user_id.toString().padStart(4, '0')})
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label="Online"
                    size="small"
                    sx={{
                      backgroundColor: '#f0fdf4',
                      color: '#15803d',
                      border: '1px solid #bbf7d0',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      borderRadius: '4px',
                      height: 22
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {devices.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#94a3b8', fontSize: '0.875rem' }}>
                  No devices registered in the fleet yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Register Device Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { borderRadius: '8px', width: '100%', maxWidth: 420, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', pb: 1 }}>
          Register Hardware Endpoint
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField
            label="Hardware / Device Name"
            placeholder="e.g., Realme P3 Ultra 5G"
            fullWidth
            size="small"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
          <TextField
            select
            label="Assign to Operator"
            fullWidth
            size="small"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.username} (USR-{u.id.toString().padStart(4, '0')})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateDevice}
            sx={{ bgcolor: '#FFBB2D', color: '#0f172a', fontWeight: 700, borderRadius: '6px', '&:hover': { bgcolor: '#f59e0b' } }}
          >
            Provision Device
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}