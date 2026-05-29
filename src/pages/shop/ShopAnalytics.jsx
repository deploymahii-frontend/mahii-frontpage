import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, orderAPI, attendanceAPI } from '../../services/api';
import { TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';
import StatsCards from './components/dashboard/StatsCards';
import RevenueChart from './components/dashboard/RevenueChart';
import AttendanceChart from './components/dashboard/AttendanceChart';
import MealDistribution from './components/dashboard/MealDistribution';

const ShopAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    attendanceRate: 0,
  });
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user?.role === 'shopowner') {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const shopsRes = await shopAPI.getMyShops();
      const userShop = shopsRes.data.shops?.[0];
      if (!userShop) return;

      const ordersRes = await orderAPI.getShopOrders(userShop._id);
      const analyticsRes = await attendanceAPI.getAnalytics(userShop._id);
      const fetchedOrders = ordersRes.data.orders || [];

      const revenue = fetchedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const activeSubs = analyticsRes.data.analytics?.totalStudents || 0;
      const pendingOrders = fetchedOrders.filter((order) => order.orderStatus === 'pending').length;

      setStats({
        totalOrders: fetchedOrders.length,
        activeSubscriptions: activeSubs,
        totalRevenue: revenue,
        pendingOrders,
        attendanceRate: analyticsRes.data.analytics?.attendanceRate || 0,
      });
      setOrders(fetchedOrders);
      setAnalytics(analyticsRes.data.analytics || null);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const revenueData = orders
    .slice(-7)
    .reverse()
    .map((order) => ({
      date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: order.total || 0,
    }));

  return (
    <ShopLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-500">Track your shop's performance and insights</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />

            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueChart data={revenueData} title="Recent Order Revenue" />
              <AttendanceChart data={analytics?.dailyData || []} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meal Distribution</h2>
                <MealDistribution
                  data={[
                    { name: 'Breakfast', value: analytics?.mealDistribution?.breakfast || 0 },
                    { name: 'Lunch', value: analytics?.mealDistribution?.lunch || 0 },
                    { name: 'Dinner', value: analytics?.mealDistribution?.dinner || 0 },
                  ]}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 text-gray-900 dark:text-white">
                  <TrendingUp size={20} />
                  <h2 className="text-lg font-semibold">Top student attendance</h2>
                </div>
                {analytics?.studentAttendance?.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.studentAttendance.slice(0, 6).map((student, index) => (
                      <div key={student.name || index} className="rounded-2xl bg-gray-50 dark:bg-gray-950 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Breakfast {student.breakfast || 0} · Lunch {student.lunch || 0} · Dinner {student.dinner || 0}</p>
                          </div>
                          <span className="text-sm font-semibold text-[#FF6B35]">{student.total} records</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No attendance records available yet.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ShopLayout>
  );
};

export default ShopAnalytics;