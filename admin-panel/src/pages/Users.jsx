import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Stack, 
  Chip,
  Button,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  FileDownloadOutlined as ExportIcon,
  PersonOutline as UserIcon 
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import api from '../services/api';
import PageWrapper from '../components/PageWrapper';
import { responseHandler, errorHandler } from '../utils/responseHandler';

export default function Users() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('users');
      const data = responseHandler(res);
      setUsers(data.data || []);
    } catch (err) {
      console.error(errorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "User Registry | FlashBasket Admin";
    fetchUsers();
  }, []);

  const columns = [
    { 
      header: 'Identity', 
      render: row => (
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Avatar 
            sx={{ 
              width: 44, 
              height: 44, 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontWeight: 900
            }}
          >
            {row.name?.charAt(0).toUpperCase() || <UserIcon />}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>{row.name || 'Anonymous'}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>UID: #{row.id}</Typography>
          </Box>
        </Stack>
      )
    },
    { 
      header: 'Contact', 
      render: row => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.phone}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{row.email || 'No email'}</Typography>
        </Box>
      )
    },
    { 
      header: 'Engagement', 
      render: row => (
        <Chip 
          label={`${row.orders?.length || 0} Orders`} 
          size="small" 
          sx={{ 
            fontWeight: 800, 
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px'
          }} 
        />
      )
    },
    { 
      header: 'Wallet Balance', 
      render: row => (
        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'success.main' }}>
          ₹{Number(row.wallet?.balance || 0).toLocaleString()}
        </Typography>
      )
    },
    { 
      header: 'Registered', 
      render: row => (
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </Typography>
      )
    }
  ];

  return (
    <PageWrapper>
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>User Registry</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Oversee and manage your growing customer base.</Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<ExportIcon />}
          sx={{ borderRadius: '12px', px: 3, fontWeight: 800 }}
        >
          Export CSV
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ p: 10, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Syncing user profiles...</Typography>
        </Box>
      ) : (
        <DataTable 
          columns={columns} 
          data={users} 
          keyExtractor={(item) => item.id}
        />
      )}
    </PageWrapper>
  );
}
