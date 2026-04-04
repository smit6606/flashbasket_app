import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Skeleton, 
  Paper,
  Button,
  Stack,
  useTheme,
  Avatar,
  IconButton,
  Chip,
  Tooltip as MuiTooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  GroupOutlined as UsersIcon, 
  LocalMallOutlined as OrdersIcon, 
  Inventory2Outlined as ProductsIcon, 
  PaymentsOutlined as RevenueIcon,
  TrendingUp,
  FileDownloadOutlined as DownloadIcon,
  ElectricBoltRounded as BoltIcon
} from '@mui/icons-material';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';
import PageWrapper from '../components/PageWrapper';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color, trend, trendType, index }) => {
  const theme = useTheme();
  const isDark = theme?.palette?.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card sx={{ 
        height: '100%', 
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden',
        background: isDark ? alpha(theme.palette.background.paper, 0.6) : '#fff',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(color || '#000', 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 20px 40px ${alpha(color || '#000', 0.15)}`,
          borderColor: alpha(color || '#000', 0.3),
        }
      }}>
        <Box sx={{ 
          position: 'absolute', 
          top: -20, 
          right: -20, 
          width: 120, 
          height: 120, 
          borderRadius: '50%', 
          bgcolor: alpha(color || '#000', 0.04),
          zIndex: 0
        }} />
        
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box
              sx={{
                p: 1.5,
                borderRadius: '16px',
                bgcolor: alpha(color || '#000', 0.1),
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 16px ${alpha(color || '#000', 0.12)}`
              }}
            >
              <Icon sx={{ fontSize: '1.5rem' }} />
            </Box>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: '100px',
                bgcolor: trendType === 'up' ? alpha(theme?.palette?.success?.main || '#000', 0.1) : alpha(theme?.palette?.error?.main || '#000', 0.1),
                color: trendType === 'up' ? theme?.palette?.success?.main : theme?.palette?.error?.main,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <TrendingUp sx={{ fontSize: '0.9rem', transform: trendType === 'up' ? 'none' : 'rotate(90deg)' }} />
              <Typography variant="caption" sx={{ fontWeight: 800 }}>{trend}</Typography>
            </Box>
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-1.5px' }}>
              {value}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2.5, width: '100%', height: 6, bgcolor: alpha(color || '#000', 0.05), borderRadius: 3, overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1.2, delay: 0.8 }}
              style={{ height: '100%', backgroundColor: color || '#000', borderRadius: 3 }} 
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme?.palette?.mode === 'dark';

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | FlashBasket Admin";
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, chartRes, recentRes] = await Promise.all([
        api.get('/stats'),
        api.get('/chart-data'),
        api.get('/recent-orders')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (chartRes.data.success) setChartData(chartRes.data.data);
      if (recentRes.data.success) setRecentOrders(recentRes.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'primary';
    const s = status.toLowerCase();
    if (s.includes('delivered')) return 'success';
    if (s.includes('pending') || s.includes('placed')) return 'warning';
    if (s.includes('packed') || s.includes('shipped')) return 'info';
    if (s.includes('cancelled')) return 'error';
    return 'primary';
  };

  if (loading) {
    return (
      <PageWrapper>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 1, borderRadius: 2 }} />
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 5, borderRadius: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={180} sx={{ borderRadius: '24px' }} />
          ))}
          <Box sx={{ gridColumn: 'span 1 / -1' }}>
            <Skeleton variant="rounded" height={450} sx={{ borderRadius: '32px' }} />
          </Box>
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
        <Box>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px', color: 'text.primary' }}>
              Performance <Typography component="span" sx={{ color: 'primary.main', fontWeight: 900, fontSize: 'inherit' }}>Insights</Typography>
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Propelling your marketplace with real-time logistical data.
            </Typography>
          </motion.div>
        </Box>
        <Stack direction="row" spacing={2}>
          <MuiTooltip title="Download as Report">
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />}
              sx={{ borderRadius: '14px', px: 3, py: 1.5, boxShadow: `0 8px 16px ${alpha(theme?.palette?.primary?.main || '#000', 0.2)}` }}
            >
              Export Metrics
            </Button>
          </MuiTooltip>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
        {/* Stats Cards */}
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' } }}>
          <StatCard index={0} title="Revenue Flow" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} icon={RevenueIcon} color={theme?.palette?.primary?.main} trend="+12.5%" trendType="up" />
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' } }}>
          <StatCard index={1} title="Order Volume" value={(stats?.totalOrders || 0).toLocaleString()} icon={OrdersIcon} color={theme?.palette?.secondary?.main} trend="+5.2%" trendType="up" />
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' } }}>
          <StatCard index={2} title="User Registry" value={(stats?.totalUsers || 0).toLocaleString()} icon={UsersIcon} color={theme?.palette?.info?.main} trend="+18.4%" trendType="up" />
        </Box>
        <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' } }}>
          <StatCard index={3} title="Product Catalog" value={stats?.totalProducts || 0} icon={ProductsIcon} color={theme?.palette?.warning?.main} trend="Stable" trendType="up" />
        </Box>

        {/* Primary Chart Area */}
        <Box sx={{ gridColumn: 'span 12' }}>
          <Paper sx={{ 
            p: 4, 
            height: 480, 
            borderRadius: '32px', 
            display: 'flex', 
            flexDirection: 'column', 
            bgcolor: isDark ? alpha(theme?.palette?.background?.paper || '#000', 0.5) : '#ffffff',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme?.palette?.divider || 'rgba(0,0,0,0.1)'}`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, p: 4, zIndex: 2 }}>
               <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: '10px', bgcolor: alpha(theme?.palette?.primary?.main || '#00b894', 0.1), color: 'primary.main' }}>
                    <BoltIcon />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>Revenue Trajectory</Typography>
               </Stack>
               <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Analyzing marketplace expansion over the last 30 days</Typography>
            </Box>
            
            <Box sx={{ flex: 1, width: '100%', mt: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme?.palette?.primary?.main || '#00b894'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={theme?.palette?.primary?.main || '#00b894'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme?.palette?.divider || '#000', 0.4)} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: theme?.palette?.text?.secondary || '#000', fontSize: 11, fontWeight: 700 }} 
                      dy={15} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: theme?.palette?.text?.secondary || '#000', fontSize: 11, fontWeight: 700 }} 
                    />
                    <ChartTooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: `1px solid ${theme?.palette?.divider || 'rgba(0,0,0,0.1)'}`,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        backgroundColor: isDark ? theme?.palette?.background?.paper : '#fff',
                        padding: '12px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={theme?.palette?.primary?.main || '#00b894'} 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Global Activity Feed */}
        <Box sx={{ gridColumn: 'span 12' }}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: '32px', 
            bgcolor: isDark ? alpha(theme?.palette?.background?.paper || '#000', 0.5) : '#ffffff',
            border: `1px solid ${theme?.palette?.divider || 'rgba(0,0,0,0.1)'}` 
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Operational Feed</Typography>
              <Button size="small" variant="text" sx={{ fontWeight: 800, borderRadius: '8px' }}>History Logs</Button>
            </Stack>
            <Stack spacing={1.5}>
              {recentOrders.length > 0 ? recentOrders.map((item, i) => {
                const statusColor = getStatusColor(item.status);
                return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Stack 
                    direction="row" 
                    sx={{ 
                      py: 2, 
                      px: 3, 
                      borderRadius: '20px', 
                      bgcolor: isDark ? alpha(theme?.palette?.background?.default || '#000', 0.3) : '#f8fafc',
                      border: `1px solid ${alpha(theme?.palette?.divider || 'rgba(0,0,0,0.1)', 0.5)}`,
                      '&:hover': { transform: 'scale(1.01)', borderColor: 'primary.main', bgcolor: isDark ? alpha(theme?.palette?.background?.default || '#000', 0.5) : alpha(theme?.palette?.primary?.main || '#00b894', 0.02) },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} 
                    alignItems="center" 
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Avatar sx={{ 
                          width: 44, 
                          height: 44, 
                          bgcolor: alpha(theme?.palette?.[statusColor]?.main || '#000', 0.1), 
                          color: theme?.palette?.[statusColor]?.main || '#000', 
                          fontWeight: 900,
                          border: `1px solid ${alpha(theme?.palette?.[statusColor]?.main || '#000', 0.2)}`
                        }}>
                          {item.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 800 }}>{item.user?.name || 'External User'}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>ID: {item.id} • {format(new Date(item.createdAt), 'MMM dd')}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={4} alignItems="center">
                       <Chip 
                        label={item.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha(theme?.palette?.[statusColor]?.main || '#000', 0.1), 
                          color: theme?.palette?.[statusColor]?.main || '#000', 
                          fontWeight: 900,
                          fontSize: '0.7rem',
                          display: { xs: 'none', md: 'flex' }
                        }} 
                       />
                       <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                          <Typography variant="body1" sx={{ fontWeight: 900 }}>₹{item.totalAmount}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>{format(new Date(item.createdAt), 'hh:mm a')}</Typography>
                       </Box>
                    </Stack>
                  </Stack>
                </motion.div>
              )}) : (
                <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>No operational data available.</Typography>
              )}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </PageWrapper>
  );
}
