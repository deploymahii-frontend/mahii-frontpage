import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ShopSidebar from './components/layout/ShopSidebar';
import ShopHeader from './components/layout/ShopHeader';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, notificationAPI } from '../../services/api';

const ShopLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shop, setShop] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/shop/dashboard') return 'dashboard';
    if (path === '/shop/orders') return 'orders';
    if (path === '/shop/subscriptions') return 'subscriptions';
    if (path === '/shop/menu') return 'menu';
    if (path === '/shop/students') return 'students';
    if (path === '/shop/attendance') return 'attendance';
    if (path === '/shop/analytics') return 'analytics';
    if (path === '/shop/earnings') return 'earnings';
    if (path === '/shop/settings') return 'settings';
    if (path === '/shop/help') return 'help';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    const fetchShopData = async () => {
      if (user?.role === 'shopowner') {
        try {
          const shopsRes = await shopAPI.getMyShops();
          const userShop = shopsRes.data.shops?.[0];
          setShop(userShop);

          const notificationsRes = await notificationAPI.getNotifications({ page: 1, limit: 20 });
          setNotifications((notificationsRes.data.notifications || []).map((notification) => ({
            ...notification,
            time: new Date(notification.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          })));
        } catch (error) {
          console.error('Error fetching shop data or notifications:', error);
        }
      }
    };

    fetchShopData();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ShopSidebar
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <ShopHeader shop={shop} notifications={notifications} unreadCount={unreadCount} />

        <main className="p-4 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ShopLayout;