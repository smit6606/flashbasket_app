import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  Stack, 
  IconButton, 
  Avatar, 
  Stepper, 
  Step, 
  StepLabel, 
  useTheme,
  Button
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  ArrowBack as BackIcon, 
  LocalShipping as ShippingIcon, 
  Payment as PaymentIcon, 
  Today as CalendarIcon,
  LocationOn as AddressIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import StatusBadge from '../components/StatusBadge';
import PageWrapper from '../components/PageWrapper';
import api from '../services/api';
import { responseHandler, errorHandler } from '../utils/responseHandler';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/order/${id}`);
        const data = responseHandler(res);
        setOrder(data.data);
      } catch (err) {
        console.error(errorHandler(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const steps = ['Placed', 'Packed', 'Out for Delivery', 'Delivered'];
  const activeStep = steps.indexOf(order?.status);

  if (loading) {
    return (
      <PageWrapper>
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 10 }}>Syncing with commerce records...</Typography>
      </PageWrapper>
    );
  }

  if (!order) {
    return (
      <PageWrapper>
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <Typography variant="h5" color="error">Data Not Found</Typography>
          <Button onClick={() => navigate('/orders')} startIcon={<BackIcon />} sx={{ mt: 2 }}>Back to Orders</Button>
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/orders')} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <BackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Order Detail</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>#{order.id} Tracking View</Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ mb: 4, p: 4, borderRadius: '24px' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <ReceiptIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Consignment Items</Typography>
            </Stack>
            <Stack spacing={3}>
              {(order.items || []).map((item, idx) => (
                <Stack key={idx} direction="row" spacing={3} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar 
                      src={item.product?.image} 
                      variant="rounded" 
                      sx={{ width: 60, height: 60, bgcolor: 'background.default' }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{item.product?.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        ₹{item.price} × {item.quantity} qnty
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ my: 4 }} />
            <Box sx={{ p: 4, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: '16px' }}>
               <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Fulfillment Timeline</Typography>
               <Stepper activeStep={activeStep >= 0 ? activeStep : 0} alternativeLabel>
                 {steps.map((label) => (
                   <Step key={label}>
                     <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 800, fontSize: '0.75rem' } }}>{label}</StepLabel>
                   </Step>
                 ))}
               </Stepper>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ mb: 4, p: 4, borderRadius: '24px' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <AddressIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Destination Details</Typography>
            </Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>{order.deliveryAddress?.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>
              {order.deliveryAddress?.houseNo}, {order.deliveryAddress?.area}<br />
              {order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>Primary Contact</Typography>
            <Typography variant="body1" sx={{ fontWeight: 800 }}>{order.deliveryAddress?.phone}</Typography>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: '24px' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <PaymentIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Bill Summary</Typography>
            </Stack>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Subtotal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{order.subtotal}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Concession</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'error.main' }}>-₹{order.discount}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Logistics</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{order.deliveryCharge}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Asset Impact</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>₹{order.totalAmount}</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}
