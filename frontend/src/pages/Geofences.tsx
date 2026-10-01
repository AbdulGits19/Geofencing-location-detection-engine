import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Switch, IconButton,
  Chip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import api from '../services/api';
import type { Geofence } from '../types';

interface PointInput {
  latitude: string;
  longitude: string;
}

export default function Geofences() {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'circle' | 'polygon'>('circle');
  const [radius, setRadius] = useState('500');
  const [points, setPoints] = useState<PointInput[]>([
    { latitude: '17.4485', longitude: '78.3912' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchGeofences = async () => {
    try {
      const response = await api.get('/geofences/');
      setGeofences(response.data);
    } catch (error) {
      console.error("Error fetching geofences:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeofences();
  }, []);

  // Switch default coordinate inputs when toggling between circle & polygon
  const handleTypeChange = (newType: 'circle' | 'polygon') => {
    setType(newType);
    if (newType === 'circle') {
      setPoints([{ latitude: '17.4485', longitude: '78.3912' }]);
    } else {
      setPoints([
        { latitude: '17.4485', longitude: '78.3912' },
        { latitude: '17.4520', longitude: '78.3950' },
        { latitude: '17.4450', longitude: '78.3980' },
      ]);
    }
  };

  const handlePointChange = (index: number, field: 'latitude' | 'longitude', value: string) => {
    const updated = [...points];
    updated[index][field] = value;
    setPoints(updated);
  };

  const handleAddVertex = () => {
    setPoints([...points, { latitude: '', longitude: '' }]);
  };

  const handleRemoveVertex = (index: number) => {
    if (points.length <= 3) return;
    setPoints(points.filter((_, i) => i !== index));
  };

  const handleCreateGeofence = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        type,
        radius: type === 'circle' ? parseFloat(radius) || 500 : null,
        is_enabled: true,
        points: points.map((pt, idx) => ({
          latitude: parseFloat(pt.latitude),
          longitude: parseFloat(pt.longitude),
          sequence: idx + 1,
        })),
      };

      const res = await api.post('/geofences/', payload);
      setGeofences([...geofences, res.data]);
      setName('');
      setOpen(false);
    } catch (error) {
      console.error("Error creating geofence:", error);
      alert("Failed to create boundary. Check coordinate values.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      setGeofences(geofences.map(gf => gf.id === id ? { ...gf, is_enabled: !currentStatus } : gf));
      await api.put(`/geofences/${id}?is_enabled=${!currentStatus}`);
    } catch {
      fetchGeofences();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this boundary?")) return;
    try {
      await api.delete(`/geofences/${id}`);
      setGeofences(geofences.filter(gf => gf.id !== id));
    } catch (error) {
      console.error("Error deleting geofence:", error);
    }
  };

  if (loading) return <Typography sx={{ fontWeight: 600, color: '#64748b' }}>Loading rules...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Geofence Rules
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mt: 0.25 }}>
            Manage spatial boundaries and trigger zones across your network.
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
            px: 2.25,
            py: 1,
            fontSize: '0.85rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#334155', boxShadow: 'none' }
          }}
        >
          New Boundary
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
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Zone Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Geometry</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Scale / Vertices</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Active</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {geofences.map((gf) => (
              <TableRow key={gf.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { backgroundColor: '#f8fafc' } }}>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  {gf.name}
                </TableCell>
                <TableCell>
                  <Chip
                    label={gf.type}
                    size="small"
                    sx={{
                      backgroundColor: gf.type === 'circle' ? '#eff6ff' : '#fdf2f8',
                      color: gf.type === 'circle' ? '#1d4ed8' : '#be185d',
                      border: `1px solid ${gf.type === 'circle' ? '#bfdbfe' : '#fbcfe8'}`,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      borderRadius: '4px',
                      height: 24,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#475569', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  {gf.type === 'circle' ? `${gf.radius}m radius` : `${gf.points.length} vertices`}
                </TableCell>
                <TableCell>
                  <Switch
                    size="small"
                    checked={gf.is_enabled}
                    onChange={() => handleToggle(gf.id, gf.is_enabled)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#0f172a' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FFBB2D', opacity: 1 },
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(gf.id)}
                    sx={{ color: '#64748b', borderRadius: '6px', '&:hover': { color: '#ef4444', backgroundColor: '#fef2f2' } }}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {geofences.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#94a3b8', fontSize: '0.875rem' }}>
                  No boundaries found. Click "New Boundary" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create New Boundary Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { borderRadius: '8px', width: '100%', maxWidth: 480, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', pb: 1 }}>
          Create Spatial Boundary
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField
            label="Boundary Zone Name"
            placeholder="e.g., Sriharikota Launchpad Zone"
            fullWidth
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: type === 'circle' ? '1fr 1fr' : '1fr', gap: 1.5 }}>
            <TextField
              select
              label="Geometry Type"
              size="small"
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as 'circle' | 'polygon')}
            >
              <MenuItem value="circle">Circle (Center + Radius)</MenuItem>
              <MenuItem value="polygon">Polygon (Multi-Vertex)</MenuItem>
            </TextField>

            {type === 'circle' && (
              <TextField
                label="Radius (Meters)"
                type="number"
                size="small"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              />
            )}
          </Box>

          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
            {type === 'circle' ? 'Center Coordinates' : `Polygon Vertices (${points.length})`}
          </Typography>

          {points.map((pt, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TextField
                label={type === 'circle' ? 'Latitude' : `Vertex ${index + 1} Lat`}
                size="small"
                fullWidth
                value={pt.latitude}
                onChange={(e) => handlePointChange(index, 'latitude', e.target.value)}
              />
              <TextField
                label={type === 'circle' ? 'Longitude' : `Vertex ${index + 1} Lon`}
                size="small"
                fullWidth
                value={pt.longitude}
                onChange={(e) => handlePointChange(index, 'longitude', e.target.value)}
              />
              {type === 'polygon' && points.length > 3 && (
                <IconButton size="small" onClick={() => handleRemoveVertex(index)} sx={{ color: '#ef4444' }}>
                  <RemoveCircleOutlineRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}

          {type === 'polygon' && (
            <Button
              size="small"
              onClick={handleAddVertex}
              sx={{ alignSelf: 'flex-start', color: '#0f172a', fontWeight: 700, fontSize: '0.75rem' }}
            >
              + Add Another Vertex
            </Button>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={submitting || !name.trim()}
            onClick={handleCreateGeofence}
            sx={{ bgcolor: '#FFBB2D', color: '#0f172a', fontWeight: 700, borderRadius: '6px', '&:hover': { bgcolor: '#f59e0b' } }}
          >
            {submitting ? 'Saving...' : 'Deploy Boundary'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}