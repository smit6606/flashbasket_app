import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ColorModeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <ColorModeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="subcategories" element={<Subcategories />} />
              <Route path="orders" element={<Orders />} />
              <Route path="past-orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="users" element={<Users />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ColorModeProvider>
    </Router>
  );
}

export default App;
