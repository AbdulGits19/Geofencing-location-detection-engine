import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import MapComponent from './components/MapComponent'; 
import Geofences from './pages/Geofences';
import Devices from './pages/Devices';
import Users from './pages/Users';
import EventLogs from './pages/EventLogs';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Sidebar />
          
          <Box component="main" sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Topbar />
            
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={
                  <Box sx={{ height: 'calc(100vh - 160px)', backgroundColor: '#fff', borderRadius: 4, p: 1, boxShadow: '0 12px 40px -12px rgba(26, 21, 16, 0.08)' }}>
                    <MapComponent />
                  </Box>
                } />
                <Route path="/geofences" element={<Geofences />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/users" element={<Users />} />
                <Route path="/logs" element={<EventLogs />} />
              </Routes>
            </Box>
          </Box>
          
        </Box>
      </Router>
    </ThemeProvider>
  );
}