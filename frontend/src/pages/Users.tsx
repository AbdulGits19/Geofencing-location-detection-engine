import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Avatar, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import api from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/');
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!username.trim() || !email.trim()) return;
    try {
      const res = await api.post('/users/', {
        username: username.trim(),
        email: email.trim()
      });
      setUsers([...users, res.data]);
      setUsername('');
      setEmail('');
      setOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  if (loading) return <Typography sx={{ fontWeight: 600, color: '#64748b' }}>Loading user directory...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            User Directory
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mt: 0.25 }}>
            Manage authorized personnel and spatial telemetry operators.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddAlt1RoundedIcon fontSize="small" />}
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
          Add User
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
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Operator ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Operator Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Email Address</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.6, py: 1.75 }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, idx) => (
              <TableRow key={user.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { backgroundColor: '#f8fafc' } }}>
                <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  USR-{user.id.toString().padStart(4, '0')}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: '#FFBB2D',
                        color: '#0f172a',
                        width: 28,
                        height: 28,
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        borderRadius: '4px',
                        border: '1px solid #f59e0b'
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                      {user.username}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#475569', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  {user.email}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={idx === 0 ? 'Lead Admin' : 'Operator'}
                    size="small"
                    sx={{
                      backgroundColor: idx === 0 ? '#fef3c7' : '#f1f5f9',
                      color: idx === 0 ? '#b45309' : '#475569',
                      border: `1px solid ${idx === 0 ? '#fde68a' : '#e2e8f0'}`,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      borderRadius: '4px',
                      height: 22
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#94a3b8', fontSize: '0.875rem' }}>
                  No users found in directory.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { borderRadius: '8px', width: '100%', maxWidth: 420, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', pb: 1 }}>
          Provision New Operator
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField
            label="Full Name / Username"
            placeholder="e.g.,Vikram"
            fullWidth
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email Address"
            placeholder="vikram@radiusly.io"
            type="email"
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateUser}
            sx={{ bgcolor: '#FFBB2D', color: '#0f172a', fontWeight: 700, borderRadius: '6px', '&:hover': { bgcolor: '#f59e0b' } }}
          >
            Create Operator
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}