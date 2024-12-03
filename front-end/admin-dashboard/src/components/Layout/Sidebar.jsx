import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const DRAWER_WIDTH = 240;

  const MENU_ITEMS = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: 'Sản phẩm',
      icon: <InventoryIcon />,
      path: '/dashboard/products'
    },
    {
      text: 'Danh mục',
      icon: <CategoryIcon />,
      path: '/dashboard/categories'
    },
    {
      text: 'Đơn hàng',
      icon: <ShoppingCartIcon />,
      path: '/dashboard/orders'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#1a237e',
          color: 'white',
        },
      }}
    >
      {/* Logo và tên admin */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" component="div">
          Admin Dashboard
        </Typography>
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

      {/* Thông tin user */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.light' }}>
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle2">{user.username}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Administrator
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

      {/* Menu items */}
      <List sx={{ flexGrow: 1 }}>
        {MENU_ITEMS.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                borderRadius: '0 20px 20px 0',
                margin: '4px 8px 4px 0',
                padding: '8px 16px',
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout button */}
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
              borderRadius: '0 20px 20px 0',
              margin: '4px 8px 4px 0',
              padding: '8px 16px',
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Đăng xuất" 
              primaryTypographyProps={{
                fontSize: '0.9rem',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;