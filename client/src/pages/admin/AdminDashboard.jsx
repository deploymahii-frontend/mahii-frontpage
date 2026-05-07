import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import {
  Shield,
  TrendingUp,
  CreditCard,
  Users,
  Store,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import toast from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import StatsCard from './components/StatsCard';
import RevenueChart from './components/RevenueChart';
import SalesPieChart from './components/SalesPieChart';
import RecentActivity from './components/RecentActivity';
import TopSellingTable from './components/TopSellingTable';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    monthlyGrowth: 0,
    totalIncome: 0,
    totalExpense: 0,
    profit: 0
  });

  const [revenueData, setRevenueData] = useState([
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 7000 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 9000 },
  ]);

  const [salesData, setSalesData] = useState([
    { name: 'Mess', value: 45, color: '#FF6B35' },
    { name: 'Hotel', value: 25, color: '#4CAF50' },
    { name: 'Cafe', value: 15, color: '#2196F3' },
    { name: 'Dessert', value: 10, color: '#FFC107' },
    { name: 'Stall', value: 5, color: '#9C27B0' },
  ]);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, revenueResponse, salesResponse, userResponse, orderResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getRevenueAnalytics(),
        adminAPI.getSalesAnalytics(),
        adminAPI.getUserAnalytics(),
        adminAPI.getOrderAnalytics(),
      ]);

      const stats = statsResponse.data;
      const revenueData = revenueResponse.data.data || [];
      const salesData = salesResponse.data.data || [];
      const userData = userResponse.data.data || {};
      const orderData = orderResponse.data.data || {};

      setStats({
        totalUsers: userData.totalUsers || 0,
        totalShops: stats.stats?.shops?.total || 0,
        totalOrders: orderData.totalOrders || 0,
        totalRevenue: stats.stats?.revenue?.total || 0,
        pendingApprovals: stats.stats?.shops?.pending || 0,
        monthlyGrowth: 15,
        totalIncome: stats.stats?.revenue?.total || 0,
        totalExpense: Math.floor((stats.stats?.revenue?.total || 0) * 0.3),
        profit: Math.floor((stats.stats?.revenue?.total || 0) * 0.7),
      });

      setRevenueData(revenueData);
      setSalesData(salesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return <Navigate to="/secure-admin-portal" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Menu size={20} />
              </button>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm w-64 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-gray-500 mt-1">Track your finances and achieve your business goals</p>
              </div>

              {/* Stats Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatsCard title="Total Income" value={`₹${stats.totalIncome.toLocaleString()}`} icon={DollarSign} trend="up" trendValue="40" color="green" delay={0} />
                <StatsCard title="Total Expense" value={`₹${stats.totalExpense.toLocaleString()}`} icon={CreditCard} trend="down" trendValue="23" color="red" delay={0.1} />
                <StatsCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={ShoppingBag} trend="up" trendValue="35" color="blue" delay={0.2} />
                <StatsCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} trend="up" trendValue="15" color="purple" delay={0.3} />
              </div>

              {/* Stats Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard title="Total Shops" value={stats.totalShops.toLocaleString()} icon={Store} color="orange" delay={0} />
                <StatsCard title="Profit" value={`₹${stats.profit.toLocaleString()}`} icon={TrendingUp} color="green" delay={0.1} />
                <StatsCard title="Pending Approvals" value={stats.pendingApprovals} icon={Clock} color="yellow" delay={0.2} />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <RevenueChart data={revenueData} title="Earnings Analytics" />
                <SalesPieChart data={salesData} title="Sales by Category" />
              </div>

              {/* Recent Activity & Top Selling */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <RecentActivity />
                <TopSellingTable />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/admin/reports" className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition">
                  <FileText size={18} className="text-[#FF6B35]" />
                  <span className="text-sm font-medium">Export Reports</span>
                </Link>
                <Link to="/admin/users" className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition">
                  <Users size={18} className="text-[#FF6B35]" />
                  <span className="text-sm font-medium">Manage Users</span>
                </Link>
                <Link to="/admin/shops" className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition">
                  <Store size={18} className="text-[#FF6B35]" />
                  <span className="text-sm font-medium">Manage Shops</span>
                </Link>
                <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition">
                  <Settings size={18} className="text-[#FF6B35]" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;