import { useLocation, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  DashboardRounded as DashboardIcon,
  Inventory2Rounded as InventoryIcon,
  CategoryRounded as CategoryIcon,
  SchemaRounded as SubcategoryIcon,
  LocalMallRounded as OrdersIcon,
  HistoryRounded as PastOrdersIcon,
  GroupRounded as UsersIcon,
  LogoutRounded as LogoutIcon,
  ChevronLeftRounded as BackIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 280;

const navItems = [
  { group: 'Operational Analytics', items: [
    { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { name: 'Orders Hub', path: '/orders', icon: <OrdersIcon /> },
    { name: 'Past Orders', path: '/past-orders', icon: <PastOrdersIcon /> },
    { name: 'User Registry', path: '/users', icon: <UsersIcon /> },
  ]},
  { group: 'Inventory Logistics', items: [
    { name: 'Product Catalog', path: '/products', icon: <InventoryIcon /> },
    { name: 'Categories', path: '/categories', icon: <CategoryIcon /> },
    { name: 'Subcategories', path: '/subcategories', icon: <SubcategoryIcon /> },
  ]},
];

export default function Sidebar({ open, onClose, variant }) {
  const location = useLocation();
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const isLinkActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDark = theme.palette.mode === 'dark';

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderRight: `1px solid ${theme.palette.divider}`,
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: theme.transitions.create('background-color'),
        },
      }}
    >
      {/* Brand Identity */}
      <Box sx={{ px: 3.5, pt: 5, pb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>F</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                Flash<Typography component="span" sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1.2rem' }}>Basket</Typography>
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '0.6rem' }}>
                Enterprise V2
              </Typography>
            </Box>
          </Box>
        </motion.div>
        
        {variant === 'temporary' && (
          <IconButton onClick={onClose} size="small">
            <BackIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <List sx={{ width: '100%', mb: 4 }}>
          {navItems.map((group) => (
            <Box key={group.group} sx={{ mb: 4 }}>
              <Typography
                sx={{
                  color: 'text.disabled',
                  fontWeight: 800,
                  px: 2,
                  mb: 1.5,
                  display: 'block',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontSize: '0.65rem'
                }}
              >
                {group.group}
              </Typography>
              {group.items.map((item) => {
                const active = isLinkActive(item.path);
                return (
                  <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      onClick={variant === 'temporary' ? onClose : undefined}
                      sx={{
                        borderRadius: '12px',
                        py: 1.25,
                        px: 2,
                        backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                        color: active ? 'primary.main' : 'text.secondary',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: active ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.text.primary, 0.04),
                          color: active ? 'primary.main' : 'text.primary',
                          '& .MuiListItemIcon-root': { color: 'primary.main' }
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 38,
                          color: active ? 'primary.main' : 'inherit',
                          transition: '0.2s',
                          '& svg': { fontSize: '1.3rem' },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: active ? 800 : 600,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </Box>
          ))}
        </List>

        {/* Logout Action */}
        <Box sx={{ mt: 'auto', px: 2, mb: 4 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '12px',
                py: 1.25,
                px: 2,
                color: 'error.main',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                  '& .MuiListItemIcon-root': { color: 'error.main' }
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>
                <LogoutIcon sx={{ fontSize: '1.3rem' }} />
              </ListItemIcon>
              <ListItemText
                primary="Sign Out"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
}
