import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, orderAPI, subscriptionAPI, attendanceAPI } from '../../services/api';
import { Store } from 'lucide-react';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';

// Dashboard Components
import StatsCards from './components/dashboard/StatsCards';
import RevenueChart from './components/dashboard/RevenueChart';
import AttendanceChart from './components/dashboard/AttendanceChart';
import MealDistribution from './components/dashboard/MealDistribution';
import RecentOrdersTable from './components/dashboard/RecentOrdersTable';

const ShopDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    attendanceRate: 0,
  });
  const [orders, setOrders] = useState([]);
  const [attendanceChartData, setAttendanceChartData] = useState([]);
  const [mealDistributionData, setMealDistributionData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    if (user?.role === 'shopowner') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const shopsRes = await shopAPI.getMyShops();
      const userShop = shopsRes.data.shops?.[0];
      setShop(userShop);

      if (userShop) {
        const ordersRes = await orderAPI.getShopOrders(userShop._id);
        const subsRes = await subscriptionAPI.getShopSubscriptions(userShop._id);
        const analyticsRes = await attendanceAPI.getAnalytics(userShop._id);

        const allOrders = ordersRes.data.orders || [];
        const activeSubs = subsRes.data.subscriptions?.filter(s => s.isActive) || [];
        const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = allOrders.filter(o => o.orderStatus === 'pending').length;

        setStats({
          totalOrders: allOrders.length,
          activeSubscriptions: activeSubs.length,
          totalRevenue,
          pendingOrders,
          attendanceRate: analyticsRes.data.analytics?.attendanceRate || 0,
        });

        setOrders(allOrders);

        // Chart data
        const analytics = analyticsRes.data.analytics;
        if (analytics) {
          setAttendanceChartData(analytics.dailyData?.slice(-7).map(d => ({
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            breakfast: d.breakfast,
            lunch: d.lunch,
            dinner: d.dinner,
          })) || []);

          setMealDistributionData([
            { name: 'Breakfast', value: analytics.mealDistribution?.breakfast || 0 },
            { name: 'Lunch', value: analytics.mealDistribution?.lunch || 0 },
            { name: 'Dinner', value: analytics.mealDistribution?.dinner || 0 },
          ]);

          setRevenueData(allOrders.slice(-7).map(order => ({
            date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: order.total || 0,
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <ShopLayout>
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store size={40} className="text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Shop Registered</h2>
          <p className="text-gray-600 mb-4">You haven't registered a shop yet.</p>
          <Link to="/register/shopowner" className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-semibold">
            Register Your Shop
          </Link>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="space-y-6">
        <StatsCards stats={stats} />
        <div className="grid lg:grid-cols-2 gap-6">
          <RevenueChart data={revenueData} />
          <AttendanceChart data={attendanceChartData} />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <MealDistribution data={mealDistributionData} />
          <RecentOrdersTable orders={orders} />
        </div>
      </div>
    </ShopLayout>
  );
};

export default ShopDashboard;