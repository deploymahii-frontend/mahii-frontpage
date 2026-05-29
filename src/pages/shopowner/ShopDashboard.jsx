import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, orderAPI, subscriptionAPI, attendanceAPI, notificationAPI } from '../../services/api';
import {
  Store, ShoppingBag, Users, DollarSign, TrendingUp, Calendar,
  Clock, CheckCircle, AlertCircle, ChevronRight, Plus, Edit, Eye,
  BarChart3, Settings, LogOut, Star, MessageSquare, QrCode,
  Image, MapPin, Bell, Camera, LayoutDashboard, Utensils,
  PieChart, LineChart, Activity, Gift, Megaphone, UserCheck,
  TrendingDown, Award, Zap, Moon, Sun, Coffee, Smartphone, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart as ReLineChart, Line, BarChart as ReBarChart, Bar,
  PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import toast from 'react-hot-toast';
import { format, subDays, parseISO } from 'date-fns';
import SubscriptionRequests from './SubscriptionRequests';

// Custom Colors
const COLORS = ['#FF6B35', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'];

const ShopDashboard = ({ categoryOverride }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [attendanceAnalytics, setAttendanceAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [specialDish, setSpecialDish] = useState({ dishName: '', description: '', price: '', validUntil: '' });
  const [showSpecialDishModal, setShowSpecialDishModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0, activeSubscriptions: 0, totalRevenue: 0,
    pendingOrders: 0, averageRating: 0, totalStudents: 0,
    attendanceRate: 0, monthlyGrowth: 12
  });

  const normalizedCategory = (categoryOverride || shop?.category || '').toString().toLowerCase();
  const categoryConfig = {
    mess: {
      title: 'Mess Dashboard',
      accent: 'from-[#0EA5E9] to-[#38BDF8]',
      banner: 'Manage daily meals, student subscriptions, and attendance for your mess.',
      actionLabel: 'Announce Today’s Menu'
    },
    hotel: {
      title: 'Hotel Dashboard',
      accent: 'from-[#1F2937] to-[#4B5563]',
      banner: 'Manage hotel room service, orders, and guest preferences.',
      actionLabel: 'Update Featured Dish'
    },
    cafe: {
      title: 'Cafe Dashboard',
      accent: 'from-[#8B5CF6] to-[#EC4899]',
      banner: 'Manage café specials, orders, and customer favorites.',
      actionLabel: 'Announce Café Special'
    },
    dessert: {
      title: 'Dessert Dashboard',
      accent: 'from-[#F472B6] to-[#FB7185]',
      banner: 'Showcase desserts, seasonal sweets, and confectionery specials.',
      actionLabel: 'Announce Dessert Special'
    },
    stall: {
      title: 'Stall Dashboard',
      accent: 'from-[#F59E0B] to-[#F97316]',
      banner: 'Manage stall items, quick bites, and street food specials.',
      actionLabel: 'Announce Stall Special'
    }
  }[normalizedCategory] || {
    title: 'Shop Dashboard',
    accent: 'from-[#FF6B35] to-[#FF8C42]',
    banner: 'Here’s your business performance overview.',
    actionLabel: 'Announce Special Dish'
  };

  // Fetch all data
  useEffect(() => {
    if (user?.role === 'shopowner') {
      fetchAllData();
    }
  }, [user]);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isSmallScreen);
      if (isSmallScreen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Get shop
      const shopsRes = await shopAPI.getMyShops();
      const userShop = shopsRes.data.shops?.[0];
      setShop(userShop);

      if (userShop) {
        // Fetch orders
        const ordersRes = await orderAPI.getShopOrders(userShop._id);
        setOrders(ordersRes.data.orders || []);

        // Fetch subscriptions
        const subsRes = await subscriptionAPI.getShopSubscriptions(userShop._id);
        const activeSubs = subsRes.data.subscriptions?.filter(s => s.isActive) || [];
        setSubscriptions(activeSubs);

        // Fetch pending subscriptions count
        try {
          const pendingRes = await subscriptionAPI.getPendingSubscriptions(userShop._id);
          setPendingCount(pendingRes.data.subscriptions?.length || 0);
        } catch (error) {
          console.error('Error fetching pending subscriptions:', error);
          setPendingCount(0);
        }

        // Fetch attendance analytics
        const analyticsRes = await attendanceAPI.getAnalytics(userShop._id);
        setAttendanceAnalytics(analyticsRes.data.analytics);

        // Fetch products for menu management
        const productsRes = await shopAPI.getShopProducts(userShop._id);
        setProducts(productsRes.data.products || []);

        // Calculate stats
        const totalOrders = ordersRes.data.orders?.length || 0;
        const totalRevenue = ordersRes.data.orders?.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = ordersRes.data.orders?.filter(o => o.orderStatus === 'pending').length || 0;

        setStats({
          totalOrders,
          activeSubscriptions: activeSubs.length,
          totalRevenue,
          pendingOrders,
          averageRating: 4.5,
          totalStudents: activeSubs.length,
          attendanceRate: analyticsRes.data.analytics?.attendanceRate || 0,
          monthlyGrowth: 12
        });

        // Process students data
        const studentList = activeSubs.map(sub => ({
          id: sub.userId?._id,
          name: sub.userId?.name,
          email: sub.userId?.email,
          subscriptionId: sub._id,
          mealsConsumed: sub.mealsConsumed || 0,
          mealsRemaining: sub.mealsRemaining || 0,
          attendance: analyticsRes.data.analytics?.studentAttendance?.find(s => s.name === sub.userId?.name)
        }));
        setStudents(studentList);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Send special dish notification to all students
  const sendSpecialDishNotification = async () => {
    if (!specialDish.dishName) {
      toast.error('Please enter dish name');
      return;
    }

    try {
      for (const student of students) {
        await notificationAPI.sendSpecialDishNotification({
          userId: student.id,
          dishName: specialDish.dishName,
          description: specialDish.description,
          price: specialDish.price,
          shopName: shop?.name,
          validUntil: specialDish.validUntil
        });
      }
      toast.success(`Special dish notification sent to ${students.length} students!`);
      setShowSpecialDishModal(false);
      setSpecialDish({ dishName: '', description: '', price: '', validUntil: '' });
    } catch (error) {
      toast.error('Failed to send notifications');
    }
  };

  // Prepare chart data
  const attendanceChartData = (Array.isArray(attendanceAnalytics?.dailyData) ? attendanceAnalytics.dailyData : [])
    .slice(-7)
    .map(d => ({
      date: format(parseISO(d.date), 'MMM dd'),
      breakfast: d.breakfast,
      lunch: d.lunch,
      dinner: d.dinner,
      total: d.total
    }));

  const latestAttendanceDay = (Array.isArray(attendanceAnalytics?.dailyData) ? attendanceAnalytics.dailyData : []).slice(-1)[0] || { breakfast: 0, lunch: 0, dinner: 0 };

  const mealDistributionData = attendanceAnalytics?.mealDistribution ? [
    { name: 'Breakfast', value: attendanceAnalytics.mealDistribution.breakfast, color: '#FF6B35' },
    { name: 'Lunch', value: attendanceAnalytics.mealDistribution.lunch, color: '#4CAF50' },
    { name: 'Dinner', value: attendanceAnalytics.mealDistribution.dinner, color: '#2196F3' }
  ] : [];

  const revenueData = orders.slice(-7).map(order => ({
    date: format(new Date(order.createdAt), 'MMM dd'),
    amount: order.total || 0
  }));

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'requests', label: 'Sub. Requests', icon: <Bell size={20} />, count: pendingCount },
    { id: 'attendance', label: 'Attendance', icon: <UserCheck size={20} />, badge: stats.attendanceRate + '%' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} />, count: stats.pendingOrders },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Users size={20} /> },
    { id: 'menu', label: 'Menu', icon: <Utensils size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} />, count: stats.totalStudents },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'help', label: 'Help Center', icon: <MessageSquare size={20} /> }
  ];

  if (!user || user.role !== 'shopowner') {
    return <Navigate to="/login/shopowner" />;
  }

  if (!shop && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store size={40} className="text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Shop Registered</h2>
          <p className="text-gray-600 mb-4">You haven't registered a shop yet.</p>
          <Link to="/register/shopowner" className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-semibold">
            Register Your Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========== SIDEBAR (Firebase Style) ========== */}
      <aside
        className={`${
          isMobile ? 'fixed' : 'sticky'
        } left-0 top-0 h-screen bg-white shadow-xl z-50 transition-all duration-300 ${
          sidebarOpen ? (isMobile ? 'w-64' : 'w-64') : isMobile ? '-translate-x-full' : 'w-20'
        }`}
      >
        <div className="p-5 border-b flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-lg flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-800">Mahii</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-lg flex items-center justify-center mx-auto">
              <Store size={16} className="text-white" />
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-gray-100">
            <Menu size={18} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {sidebarOpen && (
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              )}
              {sidebarOpen && item.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white text-[#FF6B35]' : 'bg-red-100 text-red-600'}`}>
                  {item.count}
                </span>
              )}
              {sidebarOpen && item.badge && (
                <span className="text-xs text-green-600">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className={`flex-1 transition-all duration-300 ${
        isMobile ? 'w-full' : sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>

        {/* Top Header */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">{shop?.name}</h1>
              <p className="text-xs md:text-sm text-gray-500 truncate">{shop?.location?.area}, {shop?.location?.city}</p>
              <div className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 uppercase tracking-[0.12em]">
                {categoryConfig.title.replace(' Dashboard', '')}
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setShowSpecialDishModal(true)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r ${categoryConfig.accent} text-white rounded-xl text-xs md:text-sm font-medium shadow-md hover:shadow-lg transition whitespace-nowrap`}
              >
                <Megaphone size={16} />
                <span className="hidden md:inline">{categoryConfig.actionLabel}</span>
                <span className="md:hidden">Special</span>
              </button>
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r ${categoryConfig.accent} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                {shop?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* ========== DASHBOARD TAB ========== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Pending Requests Alert */}
                  {pendingCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-yellow-50 border-l-4 border-yellow-400 p-4 md:p-5 rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-yellow-900 text-sm md:text-base">
                            {pendingCount} Pending Subscription Request{pendingCount > 1 ? 's' : ''}
                          </h3>
                          <p className="text-yellow-800 text-xs md:text-sm mt-1">
                            Review and approve customer subscription requests to activate their plans.
                          </p>
                          <button
                            onClick={() => setActiveTab('requests')}
                            className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-xs md:text-sm font-semibold rounded-lg transition"
                          >
                            Review Requests →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Welcome Banner */}
                  <div className={`bg-gradient-to-r ${categoryConfig.accent} rounded-2xl p-4 md:p-6 text-white`}>
                    <h2 className="text-lg md:text-2xl font-bold">{categoryConfig.title}</h2>
                    <p className="opacity-90 mt-1 text-xs md:text-base">{categoryConfig.banner}</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag size={18} className="text-[#FF6B35]" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold">{stats.totalOrders}</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500">Total Orders</p>
                      {stats.pendingOrders > 0 && <p className="text-xs text-orange-500 mt-1">{stats.pendingOrders} pending</p>}
                    </div>

                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Users size={18} className="text-green-600" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold">{stats.activeSubscriptions}</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500">Active Subscriptions</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <DollarSign size={18} className="text-purple-600" />
                        </div>
                        <span className="text-lg md:text-2xl font-bold">₹{Math.round(stats.totalRevenue / 1000)}K</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500">Total Revenue</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <UserCheck size={18} className="text-yellow-600" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold">{stats.attendanceRate}%</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500">Attendance Rate</p>
                    </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* Attendance Trend */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm md:text-base text-gray-800">Attendance Trend</h3>
                        <Activity size={18} className="text-gray-400" />
                      </div>
                      <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                        <AreaChart data={attendanceChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" fontSize={isMobile ? 11 : 12} />
                          <YAxis fontSize={isMobile ? 11 : 12} />
                          <Tooltip />
                          <Legend wrapperStyle={isMobile ? { fontSize: '12px' } : {}} />
                          <Area type="monotone" dataKey="breakfast" stackId="1" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.6} />
                          <Area type="monotone" dataKey="lunch" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
                          <Area type="monotone" dataKey="dinner" stackId="1" stroke="#2196F3" fill="#2196F3" fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Meal Distribution Pie Chart */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm md:text-base text-gray-800">Meal Distribution</h3>
                        <PieChart size={18} className="text-gray-400" />
                      </div>
                      <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                        <RePieChart>
                          <Pie
                            data={mealDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={isMobile ? 40 : 60}
                            outerRadius={isMobile ? 70 : 90}
                            paddingAngle={5}
                            dataKey="value"
                            label={isMobile ? undefined : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {mealDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue Trend */}
                  <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm md:text-base text-gray-800">Revenue Trend (Last 7 days)</h3>
                      <TrendingUp size={18} className="text-gray-400" />
                    </div>
                    <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                      <ReLineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" fontSize={isMobile ? 11 : 12} />
                        <YAxis fontSize={isMobile ? 11 : 12} />
                        <Tooltip formatter={(value) => `₹${value}`} />
                        <Line type="monotone" dataKey="amount" stroke="#FF6B35" strokeWidth={2} dot={{ fill: '#FF6B35', r: isMobile ? 2 : 4 }} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Student Attendance List */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-5 border-b flex justify-between items-center">
                      <h3 className="font-semibold text-sm md:text-base text-gray-800">Student Attendance</h3>
                      <Link to="#" className="text-xs md:text-sm text-[#FF6B35]">View All →</Link>
                    </div>
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100 p-4 space-y-4">
                      {students.slice(0, 5).map((student) => (
                        <div key={student.id} className="pb-4">
                          <p className="font-medium text-sm text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-500 mb-3">{student.email}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-gray-500">Meals Used</p>
                              <p className="font-semibold text-gray-800">{student.mealsConsumed || 0}</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-gray-500">Meals Left</p>
                              <p className="font-semibold text-gray-800">{student.mealsRemaining || 0}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${student.attendance?.rate || 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">{student.attendance?.rate || 0}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4 text-left text-xs font-medium text-gray-500">Student</th>
                            <th className="p-4 text-left text-xs font-medium text-gray-500">Meals Used</th>
                            <th className="p-4 text-left text-xs font-medium text-gray-500">Meals Left</th>
                            <th className="p-4 text-left text-xs font-medium text-gray-500">Attendance Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {students.slice(0, 5).map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="p-4">
                                <div>
                                  <p className="font-medium text-gray-800">{student.name}</p>
                                  <p className="text-xs text-gray-500">{student.email}</p>
                                </div>
                              </td>
                              <td className="p-4 text-gray-600">{student.mealsConsumed || 0}</td>
                              <td className="p-4 text-gray-600">{student.mealsRemaining || 0}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: `${student.attendance?.rate || 0}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-500">{student.attendance?.rate || 0}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ========== SUBSCRIPTION REQUESTS TAB ========== */}
              {activeTab === 'requests' && shop && (
                <SubscriptionRequests shopId={shop._id} />
              )}

              {/* ========== ATTENDANCE TAB ========== */}
              {activeTab === 'attendance' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-4">Today's Attendance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                      <div className="bg-orange-50 rounded-xl p-4 text-center">
                        <Coffee size={20} className="mx-auto text-orange-500 mb-2" />
                        <p className="text-xl md:text-2xl font-bold text-orange-600">{latestAttendanceDay.breakfast || 0}</p>
                        <p className="text-xs md:text-sm text-gray-600">Breakfast</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <Utensils size={20} className="mx-auto text-green-500 mb-2" />
                        <p className="text-xl md:text-2xl font-bold text-green-600">{latestAttendanceDay.lunch || 0}</p>
                        <p className="text-xs md:text-sm text-gray-600">Lunch</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <Moon size={20} className="mx-auto text-blue-500 mb-2" />
                        <p className="text-xl md:text-2xl font-bold text-blue-600">{latestAttendanceDay.dinner || 0}</p>
                        <p className="text-xs md:text-sm text-gray-600">Dinner</p>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Leaderboard */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-5 border-b">
                      <h3 className="font-semibold text-sm md:text-base text-gray-800">Attendance Leaderboard</h3>
                      <p className="text-xs md:text-sm text-gray-500">Students with highest attendance</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {attendanceAnalytics?.studentAttendance?.slice(0, 10).map((student, idx) => (
                        <div key={idx} className="p-3 md:p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-sm flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-gray-800 truncate">{student.name}</p>
                              <p className="text-xs text-gray-500">{student.total} total meals</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-16 md:w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(student.total / 90) * 100}%` }} />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-gray-700">{Math.round((student.total / 90) * 100)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========== ANALYTICS TAB ========== */}
              {activeTab === 'analytics' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-4">Daily Attendance Trend</h3>
                      <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                        <ReBarChart data={attendanceChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" fontSize={isMobile ? 11 : 12} />
                          <YAxis fontSize={isMobile ? 11 : 12} />
                          <Tooltip />
                          <Legend wrapperStyle={isMobile ? { fontSize: '12px' } : {}} />
                          <Bar dataKey="breakfast" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="lunch" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="dinner" fill="#2196F3" radius={[4, 4, 0, 0]} />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-4">Meal Popularity</h3>
                      <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                        <RePieChart>
                          <Pie
                            data={mealDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={isMobile ? 40 : 60}
                            outerRadius={isMobile ? 70 : 100}
                            paddingAngle={5}
                            dataKey="value"
                            label={isMobile ? undefined : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {mealDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-5 border-b flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-gray-800">Orders</h3>
                        <p className="text-xs md:text-sm text-gray-500">Manage recent orders and order status.</p>
                      </div>
                      <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{orders.length} orders</span>
                    </div>
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100 p-4 space-y-3">
                      {orders.map((order) => (
                        <div key={order._id} className="pb-3">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium text-xs text-gray-500 truncate">{order._id.slice(-6)}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 flex-shrink-0">{order.orderStatus}</span>
                          </div>
                          <p className="font-medium text-sm text-gray-800 mb-1">{order.userId?.name || 'Customer'}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold text-gray-900">₹{order.total?.toLocaleString() || 0}</p>
                            <p className="text-xs text-gray-500">{order.createdAt ? format(new Date(order.createdAt), 'dd MMM') : '-'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Order ID</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Customer</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Total</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Status</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                              <td className="p-4 text-sm text-gray-700">{order._id}</td>
                              <td className="p-4 text-sm text-gray-700">{order.userId?.name || 'Customer'}</td>
                              <td className="p-4 text-sm text-gray-700">₹{order.total?.toLocaleString() || 0}</td>
                              <td className="p-4 text-sm font-medium text-gray-700">{order.orderStatus || 'Unknown'}</td>
                              <td className="p-4 text-sm text-gray-700">{order.createdAt ? format(new Date(order.createdAt), 'dd MMM') : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscriptions' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-5 border-b flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-gray-800">Subscriptions</h3>
                        <p className="text-xs md:text-sm text-gray-500">View active student subscriptions.</p>
                      </div>
                      <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{subscriptions.length} active</span>
                    </div>
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100 p-4 space-y-3">
                      {subscriptions.map((sub) => (
                        <div key={sub._id} className="pb-3">
                          <p className="font-medium text-sm text-gray-800">{sub.userId?.name || 'Student'}</p>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-gray-500">Plan</p>
                              <p className="font-semibold text-gray-800">{sub.planName || 'Standard'}</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-gray-500">Status</p>
                              <p className="font-semibold text-green-600">{sub.isActive ? 'Active' : 'Inactive'}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{sub.createdAt ? format(new Date(sub.createdAt), 'dd MMM yyyy') : '-'}</p>
                        </div>
                      ))}
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Student</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Plan</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Status</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Start Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {subscriptions.map((sub) => (
                            <tr key={sub._id} className="hover:bg-gray-50">
                              <td className="p-4 text-sm text-gray-700">{sub.userId?.name || 'Student'}</td>
                              <td className="p-4 text-sm text-gray-700">{sub.planName || 'Standard'}</td>
                              <td className="p-4 text-sm text-gray-700">{sub.isActive ? 'Active' : 'Inactive'}</td>
                              <td className="p-4 text-sm text-gray-700">{sub.createdAt ? format(new Date(sub.createdAt), 'dd MMM yyyy') : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'menu' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-5 border-b flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-gray-800">Menu Management</h3>
                        <p className="text-xs md:text-sm text-gray-500">Your current shop products.</p>
                      </div>
                      <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{products.length} items</span>
                    </div>
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100 p-4 space-y-3">
                      {products.map((product) => (
                        <div key={product._id} className="pb-3">
                          <p className="font-medium text-sm text-gray-800">{product.name}</p>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-gray-500">Category</p>
                              <p className="font-semibold text-gray-800">{product.category || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-gray-500">Price</p>
                              <p className="font-semibold text-gray-800">₹{product.price?.toLocaleString() || 0}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-xs">
                            <span className="text-gray-500">Availability</span>
                            <span className={`px-2 py-0.5 rounded-full ${product.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {product.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Product</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Category</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Price</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Available</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                              <td className="p-4 text-sm text-gray-700">{product.name}</td>
                              <td className="p-4 text-sm text-gray-700">{product.category || 'N/A'}</td>
                              <td className="p-4 text-sm text-gray-700">₹{product.price?.toLocaleString() || 0}</td>
                              <td className="p-4 text-sm font-medium text-gray-700">{product.isAvailable ? 'Yes' : 'No'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-5 border-b flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-gray-800">Students</h3>
                        <p className="text-xs md:text-sm text-gray-500">Active subscribers and meal usage.</p>
                      </div>
                      <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{students.length} students</span>
                    </div>
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100 p-4 space-y-3">
                      {students.map((student) => (
                        <div key={student.id} className="pb-3">
                          <p className="font-medium text-sm text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-500 truncate mb-2">{student.email}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-gray-500">Meals Used</p>
                              <p className="font-semibold text-gray-800">{student.mealsConsumed || 0}</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-gray-500">Attendance</p>
                              <p className="font-semibold text-gray-800">{student.attendance?.rate || 0}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Name</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Email</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Meals Used</th>
                            <th className="p-4 text-xs font-semibold uppercase text-gray-500">Attendance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="p-4 text-sm text-gray-700">{student.name}</td>
                              <td className="p-4 text-sm text-gray-700">{student.email}</td>
                              <td className="p-4 text-sm text-gray-700">{student.mealsConsumed || 0}</td>
                              <td className="p-4 text-sm text-gray-700">{student.attendance?.rate || 0}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'earnings' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-4">Earnings Summary</h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-4">Total revenue and subscription performance.</p>
                      <div className="grid grid-cols-1 gap-3 md:gap-4">
                        <div className="bg-gray-50 rounded-xl p-3 md:p-4">
                          <p className="text-xs md:text-sm text-gray-500">Total Revenue</p>
                          <p className="text-2xl md:text-3xl font-bold text-gray-800">₹{Math.round(stats.totalRevenue / 1000)}K</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 md:p-4">
                          <p className="text-xs md:text-sm text-gray-500">Active Subscriptions</p>
                          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.activeSubscriptions}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-4">Revenue Trend</h3>
                      <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                        <ReLineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" fontSize={isMobile ? 11 : 12} />
                          <YAxis fontSize={isMobile ? 11 : 12} />
                          <Tooltip formatter={(value) => `₹${value}`} />
                          <Line type="monotone" dataKey="amount" stroke="#FF6B35" strokeWidth={2} dot={false} />
                        </ReLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-4">Shop Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">Shop Name</p>
                        <p className="mt-2 text-sm md:text-base text-gray-800 font-medium">{shop?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">Category</p>
                        <p className="mt-2 text-sm md:text-base text-gray-800 font-medium">{shop?.category || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">Location</p>
                        <p className="mt-2 text-sm md:text-base text-gray-800 font-medium">{shop?.location?.area}, {shop?.location?.city}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">Phone</p>
                        <p className="mt-2 text-sm md:text-base text-gray-800 font-medium">{shop?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-4">Help Center</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-4">Need help? Use these links to get support for your shop dashboard.</p>
                    <div className="grid gap-3 md:gap-4">
                      <div className="bg-gray-50 rounded-xl p-3 md:p-4">
                        <h4 className="font-semibold text-sm md:text-base text-gray-800">Support</h4>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">If you see issues with orders, subscriptions, or attendance, contact support@mahii.dev.</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 md:p-4">
                        <h4 className="font-semibold text-sm md:text-base text-gray-800">Documentation</h4>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">Check the help docs for managing menu items, subscriptions, and shop settings.</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 md:p-4">
                        <h4 className="font-semibold text-sm md:text-base text-gray-800">Feedback</h4>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">Share dashboard feedback so we can improve your experience.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Special Dish Modal */}
      <AnimatePresence>
        {showSpecialDishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSpecialDishModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full mx-4 p-5 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold">Announce Special Dish</h2>
                <button onClick={() => setShowSpecialDishModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">Dish Name *</label>
                  <input
                    type="text"
                    value={specialDish.dishName}
                    onChange={(e) => setSpecialDish({ ...specialDish, dishName: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] text-sm"
                    placeholder="e.g., Butter Chicken Special"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={specialDish.description}
                    onChange={(e) => setSpecialDish({ ...specialDish, description: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] resize-none text-sm"
                    rows="3"
                    placeholder="Describe your special dish..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={specialDish.price}
                      onChange={(e) => setSpecialDish({ ...specialDish, price: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] text-sm"
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1">Valid Until</label>
                    <input
                      type="date"
                      value={specialDish.validUntil}
                      onChange={(e) => setSpecialDish({ ...specialDish, validUntil: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
                  <button
                    onClick={() => setShowSpecialDishModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg font-medium text-xs md:text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendSpecialDishNotification}
                    className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white py-2 rounded-lg font-medium text-xs md:text-sm"
                  >
                    Send to {students.length}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopDashboard;