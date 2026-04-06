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
  Button,
  TextField
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  ArrowBack as BackIcon, 
  Payment as PaymentIcon, 
  LocationOn as AddressIcon,
  Receipt as ReceiptIcon,
  VerifiedUser as VerifiedIcon,
  Lock as LockIcon
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
  const [otp, setOtp] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`order/${id}`);
      const data = responseHandler(res);
      setOrder(data.data);
    } catch (err) {
      console.error(errorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (nextStatus) => {
    try {
      setUpdating(true);
      const res = await api.put(`order/status/${id}`, { status: nextStatus });
      responseHandler(res);
      fetchOrder();
    } catch (err) {
      alert(errorHandler(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setUpdating(true);
      const res = await api.post(`order/verify-otp/${id}`, { otp });
      responseHandler(res);
      fetchOrder();
    } catch (err) {
      alert(errorHandler(err));
    } finally {
      setUpdating(false);
    }
  };

  const steps = ['Pending', 'Packed', 'Out for Delivery', 'Delivered'];
  const activeStep = steps.indexOf(order?.status);

  if (loading) {
    return (
      <PageWrapper>
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 10, fontWeight: 700 }}>
          Fetching order details...
        </Typography>
      </PageWrapper>
    );
  }

  if (!order) {
    return (
      <PageWrapper>
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <Typography variant="h5" color="error" sx={{ fontWeight: 800 }}>Order Not Found</Typography>
          <Button onClick={() => navigate('/orders')} startIcon={<BackIcon />} sx={{ mt: 2, fontWeight: 700 }}>
            Back to Orders
          </Button>
        </Box>
      </PageWrapper>
    );
  }

  const getNextStatus = () => {
    if (order.status === 'Pending') return 'Packed';
    if (order.status === 'Packed') return 'Out for Delivery';
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <PageWrapper>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/orders')} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>Order Detail</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              Transaction ID: <span style={{ color: theme.palette.primary.main }}>{order.id}</span>
            </Typography>
          </Box>
        </Box>
        <StatusBadge status={order.status} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          {/* Order Items Card */}
          <Paper sx={{ mb: 4, p: 4, borderRadius: '28px', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: '10px' }}>
                <ReceiptIcon color="primary" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Consignment Items</Typography>
            </Stack>
            
            <Stack spacing={3}>
              {(order.items || []).map((item, idx) => (
                <Stack key={idx} direction="row" spacing={3} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar 
                      src={item.product?.image} 
                      variant="rounded" 
                      sx={{ width: 64, height: 64, bgcolor: 'background.default', borderRadius: '14px', border: '1px solid', borderColor: 'divider' }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{item.product?.name}</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip 
                          label={item.product?.category?.name || 'Item'} 
                          size="small" 
                          sx={{ 
                            height: 20, 
                            fontSize: '0.65rem', 
                            fontWeight: 900, 
                            bgcolor: alpha(theme.palette.secondary.main, 0.08),
                            color: 'secondary.main',
                            borderRadius: '4px'
                          }} 
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                          ₹{item.price.toLocaleString()} × {item.quantity} units
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary' }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* Fulfillment Lifecycle */}
          <Paper sx={{ mb: 4, p: 4, borderRadius: '28px', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>Delivery Lifecycle</Typography>
            <Stepper activeStep={activeStep >= 0 ? activeStep : 0} alternativeLabel sx={{ mb: 5 }}>
              {steps.map((label, index) => {
                const stepKey = label === 'Out for Delivery' ? 'outForDelivery' : label.toLowerCase();
                const timeStr = order[`${stepKey}At`] ? format(new Date(order[`${stepKey}At`]), 'hh:mm a') : (index === 0 ? format(new Date(order.createdAt), 'hh:mm a') : '');
                const dateStr = order[`${stepKey}At`] ? format(new Date(order[`${stepKey}At`]), 'dd MMM') : (index === 0 ? format(new Date(order.createdAt), 'dd MMM') : '');
                
                return (
                  <Step key={label}>
                    <StepLabel 
                      StepIconProps={{ sx: { bgcolor: activeStep >= index ? 'primary.main' : 'divider' } }}
                      sx={{ '& .MuiStepLabel-label': { fontWeight: 800, fontSize: '0.75rem', mt: 1 } }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>{label}</Typography>
                        {timeStr && (
                          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, display: 'block', fontSize: '0.65rem', mt: 0.5 }}>
                            {timeStr} • {dateStr}
                          </Typography>
                        )}
                      </Box>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            <Box sx={{ p: 4, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: '20px', textAlign: 'center', border: '1px dashed', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
              {order.status === 'Delivered' ? (
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                  <VerifiedIcon color="success" />
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 900 }}>
                    Order Successfully Delivered
                  </Typography>
                </Stack>
              ) : (
                <Box>
                  <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, display: 'block', mb: 2 }}>
                    Administrative Action Required
                  </Typography>
                  
                  {order.status === 'Out for Delivery' ? (
                    <Box>
                      <Box sx={{ mb: 3, p: 2.5, bgcolor: 'white', borderRadius: '16px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                         <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 1 }}>VERIFICATION CODE (SHARE WITH DELIVERY AGENT)</Typography>
                         <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 8 }}>{order.otp}</Typography>
                      </Box>
                      
                      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ maxWidth: 400, mx: 'auto' }}>
                        <TextField 
                          fullWidth
                          placeholder="Enter Customer OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: '14px', fontWeight: 800, textAlign: 'center', bgcolor: 'white' }
                          }}
                        />
                        <Button 
                          variant="contained" 
                          size="large"
                          disabled={updating || !otp} 
                          onClick={handleVerifyOtp}
                          sx={{ borderRadius: '14px', px: 4, py: 1.8, fontWeight: 900, height: '56px' }}
                        >
                          Verify
                        </Button>
                      </Stack>
                    </Box>
                  ) : nextStatus ? (
                    <Button 
                      variant="contained" 
                      size="large"
                      disabled={updating}
                      onClick={() => handleUpdateStatus(nextStatus)}
                      sx={{ 
                        borderRadius: '16px', 
                        px: 8, 
                        py: 2,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                        '&:hover': { boxShadow: `0 15px 30px ${alpha(theme.palette.primary.main, 0.35)}` }
                      }}
                    >
                      {updating ? 'Processing...' : `Confirm ${nextStatus}`}
                    </Button>
                  ) : (
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                       <LockIcon color="disabled" />
                       <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                         Lifecycle completed or manually locked.
                       </Typography>
                    </Stack>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ mb: 4, p: 4, borderRadius: '28px', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ p: 1, bgcolor: alpha(theme.palette.secondary.main, 0.1), borderRadius: '10px' }}>
                <AddressIcon color="secondary" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Customer Snapshot</Typography>
            </Stack>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.5 }}>NAME</Typography>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>{order.userName || 'Anonymous User'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.5 }}>PHONE NUMBER</Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: 'primary.main' }}>+91 {order.userPhone}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.5 }}>EMAIL ADDRESS</Typography>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>{order.userEmail || 'Not Provided'}</Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 1 }}>DELIVERY DESTINATION</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.8, color: 'text.primary' }}>
                  {order.fullAddress}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: '28px', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
               <Box sx={{ p: 1, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: '10px' }}>
                  <PaymentIcon color="success" />
               </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Billing Summary</Typography>
            </Stack>
            
            <Stack spacing={2.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Mode of Payment</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'success.main', bgcolor: alpha(theme.palette.success.main, 0.05), px: 1, borderRadius: '4px' }}>
                  {order.paymentMethod}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Cart Subtotal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{order.subtotal.toLocaleString()}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Coupon Discount</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'error.main' }}>-₹{order.discount.toLocaleString()}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Logistics Fee</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {order.deliveryCharge === 0 ? <span style={{ color: theme.palette.success.main }}>FREE</span> : `₹${order.deliveryCharge}`}
                </Typography>
              </Stack>
              
              <Divider sx={{ borderStyle: 'dashed' }} />
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Grand Total</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>
                  ₹{order.totalAmount.toLocaleString()}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}
