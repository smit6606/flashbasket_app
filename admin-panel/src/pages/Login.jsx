import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Tabs, 
  Tab, 
  InputAdornment, 
  CircularProgress, 
  Alert,
  Container,
  IconButton,
  useTheme,
  Fade,
  Grow
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  LogIn, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight,
  User,
  Zap,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [loginMode, setLoginMode] = useState(0); // 0 for phone, 1 for email
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setLoginMode(newValue);
    setError('');
    setOtpSent(false);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!otpSent) {
      const result = await sendOtp(phone);
      if (result.success) {
        setOtpSent(true);
      } else {
        setError(result.message);
      }
    } else {
      const result = await verifyOtp(phone, otp);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: `radial-gradient(circle at top left, ${alpha(theme.palette.primary.main, 0.05)}, transparent 40%), 
                    radial-gradient(circle at bottom right, ${alpha(theme.palette.secondary.main, 0.05)}, transparent 40%),
                    #f8fafc`,
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <Box 
              sx={{ 
                width: 80, 
                height: 80, 
                background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 12px 24px rgba(0, 184, 148, 0.3)',
                transform: 'rotate(-5deg)'
              }}
            >
              <Zap color="white" size={40} strokeWidth={2.5} />
            </Box>
          </motion.div>
          
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px' }}>
            Flash<Typography component="span" variant="inherit" sx={{ color: 'primary.main' }}>Basket</Typography> Admin
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, opacity: 0.8 }}>
            Enterprise fulfillment & operations portal
          </Typography>
        </Box>

        <Grow in timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, sm: 5 }, 
              borderRadius: '32px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Tabs 
              value={loginMode} 
              onChange={handleTabChange} 
              variant="fullWidth" 
              sx={{ 
                mb: 4,
                bgcolor: alpha(theme.palette.text.primary, 0.03),
                borderRadius: '16px',
                p: 0.5,
                '& .MuiTabs-indicator': {
                  height: '100%',
                  borderRadius: '12px',
                  bgcolor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  zIndex: 0
                },
                '& .MuiTab-root': {
                  zIndex: 1,
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  minHeight: 48,
                  transition: '0.3s',
                  '&.Mui-selected': { color: 'primary.main' }
                }
              }}
            >
              <Tab icon={<Phone size={18} style={{ marginRight: 8 }} />} iconPosition="start" label="Phone" />
              <Tab icon={<Mail size={18} style={{ marginRight: 8 }} />} iconPosition="start" label="Email" />
            </Tabs>

            {error && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: '14px', fontWeight: 600 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {loginMode === 0 ? (
              <Box component="form" onSubmit={handlePhoneSubmit} sx={{ mt: 2 }}>
                {!otpSent ? (
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', ml: 1, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Mobile Identity
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 1, borderRight: '1px solid', borderColor: 'divider', mr: 1 }}>
                              <Typography sx={{ fontWeight: 800, color: 'text.secondary' }}>+91</Typography>
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, ml: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Security Verification
                      </Typography>
                      <Button 
                        size="small" 
                        onClick={() => setOtpSent(false)} 
                        sx={{ fontWeight: 800, color: 'primary.main', minWidth: 0, p: 0 }}
                      >
                        Change
                      </Button>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      inputProps={{ maxLength: 6 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ShieldCheck size={20} color={theme.palette.text.disabled} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          letterSpacing: otp ? '0.5em' : 'normal',
                          fontWeight: 800,
                          fontSize: otp ? '1.25rem' : 'inherit'
                        } 
                      }}
                    />
                  </Box>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mt: 4, 
                    height: 56, 
                    fontSize: '1rem',
                    borderRadius: '16px'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      {otpSent ? 'Authorize Access' : 'Request OTP'}
                      <ArrowRight size={20} style={{ marginLeft: 8 }} />
                    </>
                  )}
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleEmailSubmit} sx={{ mt: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', ml: 1, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Email ID
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    placeholder="admin@flashbasket.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={20} color={theme.palette.text.disabled} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', ml: 1, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Secret Key
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={20} color={theme.palette.text.disabled} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mt: 4, 
                    height: 56, 
                    fontSize: '1rem',
                    borderRadius: '16px'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      Sign In to Dashboard
                      <LogIn size={20} style={{ marginLeft: 8 }} />
                    </>
                  )}
                </Button>
              </Box>
            )}

            <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Protected by FlashBasket Security
              </Typography>
            </Box>
          </Paper>
        </Grow>
      </Container>
    </Box>
  );
}
