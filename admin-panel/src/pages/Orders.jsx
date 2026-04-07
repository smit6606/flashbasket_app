import { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  IconButton, 
  Tooltip, 
  useTheme,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Menu,
  ListItemIcon as MuiListItemIcon
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  Visibility as EyeIcon, 
  Edit as UpdateIcon,
  ShoppingBag as OrderIcon,
  Search as SearchIcon,
  CheckCircle as DoneIcon,
  Cancel as CancelIcon,
  LocalShipping as DeliveryIcon,
  Backpack as PackedIcon,
  AccessTime as PendingIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import FormModal from '../components/FormModal';
import PageWrapper from '../components/PageWrapper';
import api from '../services/api';
import { responseHandler, errorHandler } from '../utils/responseHandler';
import { format } from 'date-fns';

export default function Orders() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isPastOrders = location.pathname.includes('past-orders');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');

  // Status Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [customerModal, setCustomerModal] = useState({ open: false, data: null });

  const fetchOrders = async () => {
    try {
      setFetchLoading(true);
      const res = await api.get('orders');
      const data = responseHandler(res);
      setOrders(data.data || []);
    } catch (err) {
      console.error(errorHandler(err));
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    document.title = isPastOrders ? "Past Deliveries | FlashBasket" : "Active Orders Hub | FlashBasket";
    fetchOrders();
  }, [isPastOrders]);

  const handleOpenStatusMenu = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleCloseStatusMenu = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await api.put(`order/status/${selectedOrder.id}`, {
        status: newStatus
      });
      handleCloseStatusMenu();
      fetchOrders();
    } catch (err) {
      alert(errorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCustomerModal = (order) => {
    setCustomerModal({ open: true, data: order });
  };

  const statusOptions = [
    { label: 'Pending', value: 'Pending', icon: <PendingIcon size="small" /> },
    { label: 'Packed', value: 'Packed', icon: <PackedIcon size="small" /> },
    { label: 'Out for Delivery', value: 'Out for Delivery', icon: <DeliveryIcon size="small" /> },
    { label: 'Delivered', value: 'Delivered', icon: <DoneIcon size="small" /> },
    { label: 'Cancelled', value: 'Cancelled', icon: <CancelIcon size="small" /> },
  ];

  const processedOrders = useMemo(() => {
    let filtered = [...orders];

    if (isPastOrders) {
      filtered = filtered.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');
    } else {
      filtered = filtered.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.userName?.toLowerCase().includes(q) || 
        o.userPhone?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [orders, isPastOrders, searchQuery, statusFilter, sortOrder]);

  const columns = [
    { 
      header: 'Order Context', 
      render: row => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, display: 'flex' }}>
            <OrderIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              #{row.id}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {format(new Date(row.createdAt), 'MMM dd, h:mm a')}
            </Typography>
          </Box>
        </Stack>
      ) 
    },
    { 
      header: 'Customer', 
      render: row => (
        <Box 
          onClick={() => handleOpenCustomerModal(row)}
          sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
        >
           <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
            {row.userName || 'Guest User'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {row.userPhone || 'N/A'}
          </Typography>
        </Box>
      ) 
    },
    { 
      header: 'Amount', 
      render: row => (
        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
          ₹{Number(row.totalAmount).toLocaleString()}
        </Typography>
      ) 
    },
    { 
      header: 'Current Status', 
      render: row => (
        <Box onClick={(e) => handleOpenStatusMenu(e, row)} sx={{ cursor: 'pointer', display: 'inline-block' }}>
          <StatusBadge status={row.status || 'Pending'} /> 
        </Box>
      ) 
    },
    { 
      header: 'Actions', 
      render: row => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Order Documentation">
            <IconButton 
              onClick={() => navigate(`/orders/${row.id}`)}
              size="small"
              sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main', borderRadius: '10px' }}
            >
              <EyeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Fulfillment">
            <IconButton 
              onClick={(e) => handleOpenStatusMenu(e, row)}
              size="small"
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: '10px' }}
            >
              <UpdateIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <PageWrapper>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5, letterSpacing: '-1.5px' }}>
          {isPastOrders ? 'Past Deliveries' : 'Active Orders Hub'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
           <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: isPastOrders ? 'text.disabled' : 'success.main' }} />
           <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {isPastOrders 
              ? 'Settled and archived transaction history.' 
              : 'Real-time monitoring of live fulfillment activity.'}
          </Typography>
        </Box>
      </Box>

      {/* Advanced Control Bar */}
      <Stack 
        direction={{ xs: 'column', lg: 'row' }} 
        spacing={2.5} 
        sx={{ mb: 4, p: 2, bgcolor: alpha(theme.palette.background.paper, 0.4), borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}
      >
        <TextField
          placeholder="Search Order ID, Name or Contact..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', fontWeight: 600, bgcolor: 'background.paper' } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ ml: 1, color: 'text.disabled' }} /></InputAdornment>
          }}
        />

        <Stack direction="row" spacing={2} sx={{ minWidth: { lg: 500 } }}>
          <FormControl fullWidth size="small">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ borderRadius: '12px', fontWeight: 700, bgcolor: 'background.paper' }}
              startAdornment={<SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.disabled', display: 'none' }} />}
            >
              <MenuItem value="All">All Operations</MenuItem>
              {(isPastOrders ? ['Delivered', 'Cancelled'] : ['Pending', 'Packed', 'Out for Delivery']).map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
             <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              sx={{ borderRadius: '12px', fontWeight: 700, bgcolor: 'background.paper' }}
            >
              <MenuItem value="desc">Sort: Newest First</MenuItem>
              <MenuItem value="asc">Sort: Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {fetchLoading ? (
        <Box sx={{ p: 10, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Syncing logistics...</Typography>
        </Box>
      ) : (
        <DataTable 
          columns={columns} 
          data={processedOrders} 
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Customer Detail Popover Modal */}
      <FormModal
        isOpen={customerModal.open}
        onClose={() => setCustomerModal({ open: false, data: null })}
        title="Identity Profile"
        hideFooter
      >
        <Box sx={{ mt: 1 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 1 }}>Registry Name</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{customerModal.data?.userName || 'N/A'}</Typography>
            </Box>
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', textTransform: 'uppercase' }}>Phone</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{customerModal.data?.userPhone ? `+91 ${customerModal.data.userPhone}` : 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', textTransform: 'uppercase' }}>Email</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{customerModal.data?.userEmail || 'N/A'}</Typography>
              </Box>
            </Stack>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', textTransform: 'uppercase' }}>Destination</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mt: 1, p: 2.5, bgcolor: alpha(theme.palette.background.default, 0.5), borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                {customerModal.data?.fullAddress || 'N/A'}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </FormModal>

      {/* Status Transition Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseStatusMenu}
        PaperProps={{
          sx: { 
            mt: 1.5,
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            minWidth: 200,
            p: 1
          }
        }}
      >
        <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', fontWeight: 900, color: 'text.disabled', textTransform: 'uppercase' }}>
          Available Next Steps
        </Typography>
        {statusOptions
          .filter(option => {
            const statusOrder = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];
            const currentIndex = statusOrder.indexOf(selectedOrder?.status);
            const nextIndex = statusOrder.indexOf(option.value);
            
            // Show Cancelled always, otherwise only show the immediate next status
            if (option.value === 'Cancelled' && selectedOrder?.status !== 'Delivered' && selectedOrder?.status !== 'Cancelled') return true;
            return nextIndex === currentIndex + 1;
          })
          .map((option) => (
            <MenuItem 
              key={option.value} 
              onClick={() => handleUpdateStatus(option.value)}
              sx={{ 
                borderRadius: '10px', 
                py: 1.5,
                fontWeight: 700,
                fontSize: '0.85rem',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }
              }}
            >
              <MuiListItemIcon sx={{ color: 'inherit' }}>{option.icon}</MuiListItemIcon>
              {option.label}
            </MenuItem>
          ))
        }
        {(!selectedOrder || statusOptions.filter(option => {
            const statusOrder = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];
            const currentIndex = statusOrder.indexOf(selectedOrder?.status);
            const nextIndex = statusOrder.indexOf(option.value);
            if (option.value === 'Cancelled' && selectedOrder?.status !== 'Delivered' && selectedOrder?.status !== 'Cancelled') return true;
            return nextIndex === currentIndex + 1;
          }).length === 0) && (
          <Typography variant="body2" sx={{ px: 2, py: 1.5, color: 'text.secondary', fontStyle: 'italic' }}>
            No transitions available.
          </Typography>
        )}
      </Menu>
    </PageWrapper>
  );
}
