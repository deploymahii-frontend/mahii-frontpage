import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import ShopOwnerLogin from './pages/auth/ShopOwnerLogin';
import ShopOwnerRegister from './pages/auth/ShopOwnerRegister';
import AdminLogin from './pages/auth/AdminLogin';
import SecureAdminLogin from './pages/admin/SecureAdminLogin';
import MessPage from './pages/shop/MessPage';
import HotelPage from './pages/shop/HotelPage';
import CafePage from './pages/shop/CafePage';

// Add imports
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ShopDashboard from './pages/shopowner/ShopDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminChatDashboard from './pages/admin/AdminChatDashboard';
import ShopSetup from './pages/shopowner/ShopSetup';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import ChatBox from './components/common/ChatBox';

// Placeholder for remaining pages (will create)
const Cart = () => <div className="container-custom py-8"><h1>Cart Page</h1></div>;

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login/customer" element={<CustomerLogin />} />
                  <Route path="/register/customer" element={<CustomerRegister />} />
                  <Route path="/login/shopowner" element={<ShopOwnerLogin />} />
                  <Route path="/register/shopowner" element={<ShopOwnerRegister />} />
                  <Route path="/login/admin" element={<AdminLogin />} />
                  <Route path="/secure-admin-portal" element={<SecureAdminLogin />} />
                  
                  {/* Dashboard Routes */}
                  <Route path="/dashboard/customer" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
                  <Route path="/shop/setup" element={<ProtectedRoute allowedRoles={['shopowner']}><ShopSetup /></ProtectedRoute>} />
                  <Route path="/shop/dashboard" element={<ProtectedRoute allowedRoles={['shopowner']}><ShopDashboard /></ProtectedRoute>} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/chat" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminChatDashboard /></ProtectedRoute>} />
                  
                  {/* Protected Routes */}
                  <Route path="/profile" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
                  <Route path="/my-subscriptions" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute allowedRoles={['customer', 'shopowner', 'admin', 'super_admin']}><Settings /></ProtectedRoute>} />
                  <Route path="/help" element={<HelpCenter />} />
                  
                  {/* Shop Routes */}
                  <Route path="/shop/mess/:id" element={<MessPage />} />
                  <Route path="/shop/hotel/:id" element={<HotelPage />} />
                  <Route path="/shop/cafe/:id" element={<CafePage />} />
                </Routes>
                <ChatBox />
                <Toaster position="bottom-center" reverseOrder={false} />
                <SpeedInsights />
                <Analytics />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;