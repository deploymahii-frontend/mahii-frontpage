import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import StatsCard from './components/StatsCard';

const AdminAnalytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    
    // Set up real-time polling every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [rev, user, order] = await Promise.all([
        adminAPI.getRevenueAnalytics(),
        adminAPI.getUserAnalytics(),
        adminAPI.getOrderAnalytics(),
      ]);
      
      setRevenueData(Array.isArray(rev.data.data) ? rev.data.data : []);

      const userAnalytics = user.data.data || {};
      setUserData([
        {
          month: 'Users',
          customers: userAnalytics.customers || 0,
          shopowners: userAnalytics.shopOwners || 0,
          admins: userAnalytics.admins || 0,
        },
      ]);

      const orderAnalytics = order.data.data || {};
      setOrderData([
        {
          date: 'Orders',
          orders: orderAnalytics.totalOrders || 0,
          pending: orderAnalytics.pendingOrders || 0,
          completed: orderAnalytics.completedOrders || 0,
          cancelled: orderAnalytics.cancelledOrders || 0,
        },
      ]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar activeTab="analytics" setActiveTab={() => {}} />

      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor your platform analytics and performance</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#FF6B35" fill="#FF6B35" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="customers" fill="#2196F3" />
                    <Bar dataKey="shopowners" fill="#FF6B35" />
                    <Bar dataKey="admins" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Statistics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#4CAF50" />
                  <Bar dataKey="pending" fill="#FFC107" />
                  <Bar dataKey="completed" fill="#8BC34A" />
                  <Bar dataKey="cancelled" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
