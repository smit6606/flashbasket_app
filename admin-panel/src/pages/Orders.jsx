import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  IconButton, 
  Tooltip, 
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  Visibility as EyeIcon, 
  Edit as UpdateIcon,
  ShoppingBag as OrderIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import FormModal from '../components/FormModal';
import SelectDropdown from '../components/SelectDropdown';
import PageWrapper from '../components/PageWrapper';
import api from '../services/api';
import { responseHandler, errorHandler } from '../utils/responseHandler';
import { format } from 'date-fns';

export default function Orders() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setFetchLoading(true);
      const res = await api.get('/orders');
      const data = responseHandler(res);
      setOrders(data.data || []);
    } catch (err) {
      console.error(errorHandler(err));
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Orders | FlashBasket Admin";
    fetchOrders();
  }, []);

  const handleOpenStatusModal = (order) => {
    setEditingOrder(order);
    setNewStatus(order.status || 'Pending');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/order/status/${editingOrder.id}`, {
        status: newStatus
      });
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      alert(errorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Packed', value: 'Packed' },
    { label: 'Out for Delivery', value: 'Out for Delivery' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  const columns = [
    { 
      header: 'Order Details', 
      render: row => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, display: 'flex' }}>
            <OrderIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
              #{row.id}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              {format(new Date(row.createdAt), 'MMM dd, yyyy • hh:mm a')}
            </Typography>
          </Box>
        </Stack>
      ) 
    },
    { 
      header: 'Customer', 
      render: row => (
        <Box>
           <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {row.user?.name || 'Guest User'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {row.user?.phone || 'N/A'}
          </Typography>
        </Box>
      ) 
    },
    { 
      header: 'Amount', 
      render: row => (
        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary' }}>
          ₹{Number(row.totalAmount).toLocaleString()}
        </Typography>
      ) 
    },
    { 
      header: 'Status', 
      render: row => <StatusBadge status={row.status || 'Pending'} /> 
    },
    { 
      header: 'Actions', 
      render: row => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton 
              onClick={() => navigate(`/orders/${row.id}`)}
              size="small"
              sx={{ bgcolor: alpha(theme.palette.info.main, 0.08), color: 'info.main', borderRadius: '10px' }}
            >
              <EyeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Status">
            <IconButton 
              onClick={() => handleOpenStatusModal(row)}
              size="small"
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main', borderRadius: '10px' }}
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
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }}>
          Orders Hub
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Monitor and manage customer orders in real-time.</Typography>
      </Box>

      {fetchLoading ? (
        <Box sx={{ p: 10, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Syncing orders...</Typography>
        </Box>
      ) : (
        <DataTable 
          columns={columns} 
          data={orders} 
          keyExtractor={(item) => item.id}
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Order Status"
        onSubmit={handleUpdateStatus}
        loading={loading}
        submitText="Save Changes"
      >
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
            Change status for order <Typography component="span" sx={{ fontWeight: 800, color: 'primary.main' }}>#{editingOrder?.id}</Typography>
          </Typography>
          <SelectDropdown
            label="Select New Status"
            required
            options={statusOptions}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
        </Box>
      </FormModal>
    </PageWrapper>
  );
}
