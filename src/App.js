import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminProvider } from './contexts/AdminContext';
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
import ForgotPassword from './pages/auth/ForgotPassword';
import ShopOwnerLogin from './pages/auth/ShopOwnerLogin';
import ShopOwnerRegister from './pages/auth/ShopOwnerRegister';
import AdminLogin from './pages/auth/AdminLogin';
import SecureAdminLogin from './pages/admin/SecureAdminLogin';
import MessPage from './pages/shop/MessPage';
import HotelPage from './pages/shop/HotelPage';
import CafePage from './pages/shop/CafePage';
import StallPage from './pages/shop/StallPage';
import DessertPage from './pages/shop/DessertPage';

// Add imports
import CustomerDashboard from './pages/customer/CustomerDashboard';
import SubscriptionDetails from './pages/customer/SubscriptionDetails';
import ShopDashboard from './pages/shop/ShopDashboard';
import MessDashboard from './pages/shop/MessDashboard';
import HotelDashboard from './pages/shop/HotelDashboard';
import CafeDashboard from './pages/shop/CafeDashboard';
import DessertDashboard from './pages/shop/DessertDashboard';
import StallDashboard from './pages/shop/StallDashboard';
import ShopDashboardRedirect from './pages/shop/ShopDashboardRedirect';
import ShopOrders from './pages/shop/ShopOrders';
import ShopMenu from './pages/shop/ShopMenu';
import ShopAnalytics from './pages/shop/ShopAnalytics';
import ShopSubscriptions from './pages/shop/ShopSubscriptions';
import ShopStudents from './pages/shop/ShopStudents';
import ShopAttendance from './pages/shop/ShopAttendance';
import ShopEarnings from './pages/shop/ShopEarnings';
import ShopSettings from './pages/shop/ShopSettings';
import ShopHelp from './pages/shop/ShopHelp';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminChatDashboard from './pages/admin/AdminChatDashboard';
import ShopApproval from './pages/admin/ShopApproval';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminShops from './pages/admin/AdminShops';
import ShopOffersEditorPage from './pages/admin/ShopOffersEditorPage';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import ShopSetup from './pages/shopowner/ShopSetup';
import PendingApproval from './pages/shopowner/PendingApproval';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import Cart from './pages/Cart';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import Sitemap from './pages/Sitemap';
import ChatBox from './components/common/ChatBox';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AdminProvider>
              <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                  <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login/customer" element={<CustomerLogin />} />
                  <Route path="/register/customer" element={<CustomerRegister />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/login/shopowner" element={<ShopOwnerLogin />} />
                  <Route path="/register/shopowner" element={<ShopOwnerRegister />} />
                  <Route path="/login/admin" element={<AdminLogin />} />
                  <Route path="/secure-admin-portal" element={<SecureAdminLogin />} />
                  
                  {/* Dashboard Routes */}
                  <Route path="/dashboard/customer" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
                  <Route path="/shop/setup" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={false}><ShopSetup /></ProtectedRoute>} />
                  <Route path="/shop/pending-approval" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={false}><PendingApproval /></ProtectedRoute>} />
                  <Route path="/shop/dashboard" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><ShopDashboardRedirect /></ProtectedRoute>} />
                  <Route path="/shop/mess/dashboard" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><MessDashboard /></ProtectedRoute>} />
                  <Route path="/shop/hotel/dashboard" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><HotelDashboard /></ProtectedRoute>} />
                  <Route path="/shop/cafe/dashboard" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><CafeDashboard /></ProtectedRoute>} />
                  <Route path="/shop/dessert/dashboard" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><DessertDashboard /></ProtectedRoute>} />
                  <Route path="/shop/stall/dashboard" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><StallDashboard /></ProtectedRoute>} />
                  <Route path="/shop/orders" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><ShopOrders /></ProtectedRoute>} />
                  <Route path="/shop/subscriptions" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><ShopSubscriptions /></ProtectedRoute>} />
                  <Route path="/subscriptions/:id" element={<ProtectedRoute allowedRoles={['customer']}><SubscriptionDetails /></ProtectedRoute>} />
                  <Route path="/shop/menu" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><ShopMenu /></ProtectedRoute>} />
                  <Route path="/shop/students" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><ShopStudents /></ProtectedRoute>} />
                  <Route path="/shop/attendance" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><ShopAttendance /></ProtectedRoute>} />
                  <Route path="/shop/analytics" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><ShopAnalytics /></ProtectedRoute>} />
                  <Route path="/shop/earnings" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><ShopEarnings /></ProtectedRoute>} />
                  <Route path="/shop/settings" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><ShopSettings /></ProtectedRoute>} />
                  <Route path="/shop/help" element={<ProtectedRoute allowedRoles={['shopowner']} requireApproval={true}><ShopHelp /></ProtectedRoute>} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/chat" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminChatDashboard /></ProtectedRoute>} />
                  <Route path="/admin/shop-approvals" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ShopApproval /></ProtectedRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminAnalytics /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminUsers /></ProtectedRoute>} />
                  <Route path="/admin/shops" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminShops /></ProtectedRoute>} />
                  <Route path="/admin/shops/:id/offers" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><ShopOffersEditorPage /></ProtectedRoute>} />
                  <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminPayments /></ProtectedRoute>} />
                  <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminReports /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin', 'super_admin']}><AdminSettings /></ProtectedRoute>} />
                  
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
                  <Route path="/shop/stall/:id" element={<StallPage />} />
                  <Route path="/shop/dessert/:id" element={<DessertPage />} />
                </Routes>
                <ChatBox />
                <Toaster position="bottom-center" reverseOrder={false} />
                <SpeedInsights />
                <Analytics />
              </div>
            </Router>
            </AdminProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;