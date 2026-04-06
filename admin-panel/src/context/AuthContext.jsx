import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('adminToken');
      if (storedToken) {
        try {
          // Attempt to fetch something protected to verify token
          await api.get('stats');
          setToken(storedToken);
        } catch (error) {
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('adminToken');
            setToken(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('login', { email, password });
      const { token, user } = response.data.data;
      if (token && user.role === 'admin') {
        localStorage.setItem('adminToken', token);
        setToken(token);
        return { success: true };
      }
      return { success: false, message: 'Unauthorized or invalid credentials' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to connect' };
    }
  };

  const sendOtp = async (phone) => {
    try {
      const response = await api.post('auth/send-otp', { phone });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
    }
  };

  const verifyOtp = async (phone, otp) => {
    try {
      const response = await api.post('auth/verify-otp', { phone, otp });
      const { token, user } = response.data.data;
      if (token && user.role === 'admin') {
        localStorage.setItem('adminToken', token);
        setToken(token);
        return { success: true };
      } else if (token && user.role !== 'admin') {
        return { success: false, message: 'Access Denied: Only admins can login here' };
      }
      return { success: false, message: 'Invalid OTP' };
    } catch (error) {
       return { success: false, message: error.response?.data?.message || 'Failed to verify OTP' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  const value = {
    token,
    login,
    sendOtp,
    verifyOtp,
    logout,
    isAuthenticated: !!token,
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e2e8f0', 
            borderTop: '4px solid #00b894', 
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ color: '#64748b', fontWeight: 600 }}>Securely initializing...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
