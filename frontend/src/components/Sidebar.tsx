import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';

const DRAWER_WIDTH = 250;

const menuItems = [
  { text: 'Live Telemetry', icon: <DashboardRoundedIcon fontSize="small" />, path: '/' },
  { text: 'Map View', icon: <MapRoundedIcon fontSize="small" />, path: '/map' },
  { text: 'Geofence Rules', icon: <FormatListBulletedRoundedIcon fontSize="small" />, path: '/geofences' },
  { text: 'Device Fleet', icon: <DevicesRoundedIcon fontSize="small" />, path: '/devices' },
  { text: 'User Directory', icon: <PeopleAltRoundedIcon fontSize="small" />, path: '/users' },
  { text: 'Event Audit Logs', icon: <ReceiptLongRoundedIcon fontSize="small" />, path: '/logs' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #e2e8f0',
          boxShadow: 'none',
          px: 2,
          py: 3,
        },
      }}
    >
      <Box sx={{ px: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box sx={{
          backgroundColor: '#FFBB2D',
          borderRadius: '6px',
          p: 0.75,
          display: 'flex',
          border: '1px solid #f59e0b',
        }}>
          <TrackChangesRoundedIcon sx={{ fontSize: 22, color: '#0f172a' }} />
        </Box>
        <Typography variant="h5" sx={{
          fontWeight: 900,
          letterSpacing: '-1px',
          color: '#0f172a',
          textTransform: 'lowercase',
        }}>
          radiusly.
        </Typography>
      </Box>

      <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem disablePadding key={item.text}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: '6px',
                  py: 1,
                  px: 1.5,
                  backgroundColor: isActive ? '#FFBB2D' : 'transparent',
                  color: isActive ? '#0f172a' : '#64748b',
                  '&:hover': {
                    backgroundColor: isActive ? '#FFBB2D' : '#f8fafc',
                    color: '#0f172a',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 34 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  slotProps={{
                    primary: {
                      sx: { fontWeight: isActive ? 700 : 500, fontSize: '0.875rem' }
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}