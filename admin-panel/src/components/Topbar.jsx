import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box, 
  Avatar, 
  Tooltip,
  Badge,
  InputBase,
  styled,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  Menu as MenuIcon, 
  LogoutOutlined as LogoutIcon, 
  NotificationsNoneOutlined as BellIcon,
  SearchOutlined as SearchIcon,
  HelpOutline as HelpIcon,
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useColorMode } from '../context/ThemeContext';

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  backgroundColor: theme.palette.mode === 'light' 
    ? alpha(theme.palette.text.primary, 0.04)
    : alpha(theme.palette.background.paper, 0.8),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' 
      ? alpha(theme.palette.text.primary, 0.08)
      : alpha(theme.palette.background.paper, 1),
    boxShadow: `0 8px 24px ${alpha(theme.palette.text.primary, 0.05)}`,
  },
  '&:focus-within': {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.background.paper,
    boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(4),
    width: 'auto',
    minWidth: 350,
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.4, 1, 1.4, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4.5)})`,
    transition: '0.2s',
    fontSize: '0.875rem',
    fontWeight: 600,
    '&::placeholder': {
      color: theme.palette.text.disabled,
      opacity: 1,
    },
  },
}));

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' 
    ? alpha('#fff', 0.8)
    : alpha(theme.palette.background.default, 0.8),
  backdropFilter: 'blur(20px) saturate(180%)',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.drawer + 1,
}));

export default function Topbar({ setSidebarOpen }) {
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toggleColorMode } = useColorMode();

  return (
    <GlassAppBar position="sticky" elevation={0}>
      <Toolbar sx={{ height: 80, px: { xs: 2, sm: 4 } }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => setSidebarOpen(true)}
          sx={{ mr: 2, display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <SearchContainer>
          <SearchIconWrapper>
            <SearchIcon sx={{ fontSize: '1.2rem' }} />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search resources, users or logs..."
          />
        </SearchContainer>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Tooltip title={theme.palette.mode === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton 
                onClick={toggleColorMode}
                sx={{ 
                  color: 'text.secondary', 
                  bgcolor: alpha(theme.palette.text.secondary, 0.05),
                  '&:hover': { bgcolor: alpha(theme.palette.text.secondary, 0.1) } 
                }}
              >
                {theme.palette.mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ width: '1px', height: '32px', bgcolor: 'divider', mx: 1, opacity: 0.5, display: { xs: 'none', sm: 'block' } }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', lg: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                Admin
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                Full Access
              </Typography>
            </Box>
            
            <Avatar 
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                fontWeight: 900, 
                fontSize: '0.85rem',
                width: 40,
                height: 40,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                border: `2px solid ${theme.palette.background.paper}`
              }}
            >
              AD
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </GlassAppBar>
  );
}
