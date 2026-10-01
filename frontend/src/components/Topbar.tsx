import { useState, useEffect } from 'react';
import { Box, InputBase, Typography, Avatar, Select, MenuItem } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';

export default function Topbar() {
  const [time, setTime] = useState(new Date());
  const [activeUser, setActiveUser] = useState('Abdul');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      mb: 4, pb: 2.5, borderBottom: '1px solid #e2e8f0'
    }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF',
        border: '1px solid #cbd5e1', borderRadius: '6px', px: 1.5, py: 0.75, width: '320px'
      }}>
        <SearchRoundedIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 18 }} />
        <InputBase placeholder="Search zones, devices, logs..." sx={{ flex: 1, fontSize: '0.85rem', color: '#0f172a', fontWeight: 500 }} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#334155' }}>
            <AccessTimeFilledRoundedIcon sx={{ fontSize: 13 }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>
              {time.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
            <LocationOnRoundedIcon sx={{ fontSize: 13 }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Hyderabad Node</Typography>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.25, backgroundColor: '#FFFFFF',
          border: '1px solid #cbd5e1', px: 1.25, py: 0.5, borderRadius: '6px'
        }}>
          <Avatar variant="rounded" sx={{ bgcolor: '#FFBB2D', color: '#0f172a', width: 26, height: 26, fontWeight: 800, fontSize: '0.8rem', borderRadius: '4px' }}>
            {activeUser.charAt(0)}
          </Avatar>
          <Select
            value={activeUser}
            onChange={(e) => setActiveUser(e.target.value)}
            variant="standard"
            disableUnderline
            sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a', '& .MuiSelect-select': { py: 0 } }}
          >
            <MenuItem value="Abdul">Abdul (Admin)</MenuItem>
            <MenuItem value="Prasad">Prasad</MenuItem>
            <MenuItem value="Matthews">Matthews</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
}