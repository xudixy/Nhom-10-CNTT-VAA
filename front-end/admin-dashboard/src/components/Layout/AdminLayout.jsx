// src/components/Layout/AdminLayout.jsx
import { Box, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;