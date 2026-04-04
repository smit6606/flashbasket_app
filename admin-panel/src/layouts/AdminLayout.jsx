import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const DRAWER_WIDTH = 280;

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar Wrapper */}
      <Box
        component="nav"
        sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}
      >
        <Sidebar 
          open={isMobile ? sidebarOpen : true} 
          onClose={() => setSidebarOpen(false)} 
          variant={isMobile ? 'temporary' : 'permanent'} 
        />
      </Box>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minWidth: 0,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Topbar setSidebarOpen={setSidebarOpen} />
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 4, md: 5 },
            overflowY: 'auto',
            maxWidth: '100%'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
