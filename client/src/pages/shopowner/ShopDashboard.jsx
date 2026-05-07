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

// Custom Colors
const COLORS = ['#FF6B35', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0'];

const ShopDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceAnalytics, setAttendanceAnalytics] = useState(null);
  const [students, setStudents] = useState([]);
  const [specialDish, setSpecialDish] = useState({ dishName: '', description: '', price: '', validUntil: '' });
  const [showSpecialDishModal, setShowSpecialDishModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0, activeSubscriptions: 0, totalRevenue: 0,
    pendingOrders: 0, averageRating: 0, totalStudents: 0,
    attendanceRate: 0, monthlyGrowth: 12
  });

  // Fetch all data
  useEffect(() => {
    if (user?.role === 'shopowner') {
      fetchAllData();
    }
  }, [user]);

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

        // Fetch attendance analytics
        const analyticsRes = await attendanceAPI.getAnalytics(userShop._id);
        setAttendanceAnalytics(analyticsRes.data.analytics);

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
  const attendanceChartData = attendanceAnalytics?.dailyData?.slice(-7).map(d => ({
    date: format(parseISO(d.date), 'MMM dd'),
    breakfast: d.breakfast,
    lunch: d.lunch,
    dinner: d.dinner,
    total: d.total
  })) || [];

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
    { id: 'attendance', label: 'Attendance', icon: <UserCheck size={20} />, badge: stats.attendanceRate + '%' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} />, count: stats.pendingOrders },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Users size={20} /> },
    { id: 'menu', label: 'Menu', icon: <Utensils size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} />, count: stats.totalStudents },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
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
      {/* ========== SIDEBAR (Firebase Style) ========== */}
      <aside className={`fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
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
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>

        {/* Top Header */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{shop?.name}</h1>
              <p className="text-sm text-gray-500">{shop?.location?.area}, {shop?.location?.city}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSpecialDishModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition"
              >
                <Megaphone size={16} />
                Announce Special Dish
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] flex items-center justify-center text-white font-semibold">
                {shop?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* ========== DASHBOARD TAB ========== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Welcome Banner */}
                  <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-2xl p-6 text-white">
                    <h2 className="text-2xl font-bold">Welcome back! 👋</h2>
                    <p className="opacity-90 mt-1">Here's your business performance overview</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag size={20} className="text-[#FF6B35]" />
                        </div>
                        <span className="text-2xl font-bold">{stats.totalOrders}</span>
                      </div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      {stats.pendingOrders > 0 && <p className="text-xs text-orange-500 mt-1">{stats.pendingOrders} pending</p>}
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Users size={20} className="text-green-600" />
                        </div>
                        <span className="text-2xl font-bold">{stats.activeSubscriptions}</span>
                      </div>
                      <p className="text-sm text-gray-500">Active Subscriptions</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <DollarSign size={20} className="text-purple-600" />
                        </div>
                        <span className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <UserCheck size={20} className="text-yellow-600" />
                        </div>
                        <span className="text-2xl font-bold">{stats.attendanceRate}%</span>
                      </div>
                      <p className="text-sm text-gray-500">Attendance Rate</p>
                    </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Attendance Trend */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Attendance Trend</h3>
                        <Activity size={18} className="text-gray-400" />
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={attendanceChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="breakfast" stackId="1" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.6} />
                          <Area type="monotone" dataKey="lunch" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
                          <Area type="monotone" dataKey="dinner" stackId="1" stroke="#2196F3" fill="#2196F3" fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Meal Distribution Pie Chart */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Meal Distribution</h3>
                        <PieChart size={18} className="text-gray-400" />
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <RePieChart>
                          <Pie
                            data={mealDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">Revenue Trend (Last 7 days)</h3>
                      <TrendingUp size={18} className="text-gray-400" />
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <ReLineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value}`} />
                        <Line type="monotone" dataKey="amount" stroke="#FF6B35" strokeWidth={2} dot={{ fill: '#FF6B35', r: 4 }} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Student Attendance List */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Student Attendance</h3>
                      <Link to="#" className="text-sm text-[#FF6B35]">View All →</Link>
                    </div>
                    <div className="overflow-x-auto">
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

              {/* ========== ATTENDANCE TAB ========== */}
              {activeTab === 'attendance' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4">Today's Attendance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-orange-50 rounded-xl p-4 text-center">
                        <Coffee size={24} className="mx-auto text-orange-500 mb-2" />
                        <p className="text-2xl font-bold text-orange-600">{attendanceAnalytics?.dailyData?.[0]?.breakfast || 0}</p>
                        <p className="text-sm text-gray-600">Breakfast</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <Utensils size={24} className="mx-auto text-green-500 mb-2" />
                        <p className="text-2xl font-bold text-green-600">{attendanceAnalytics?.dailyData?.[0]?.lunch || 0}</p>
                        <p className="text-sm text-gray-600">Lunch</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <Moon size={24} className="mx-auto text-blue-500 mb-2" />
                        <p className="text-2xl font-bold text-blue-600">{attendanceAnalytics?.dailyData?.[0]?.dinner || 0}</p>
                        <p className="text-sm text-gray-600">Dinner</p>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Leaderboard */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b">
                      <h3 className="font-semibold text-gray-800">Attendance Leaderboard</h3>
                      <p className="text-sm text-gray-500">Students with highest attendance</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {attendanceAnalytics?.studentAttendance?.slice(0, 10).map((student, idx) => (
                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{student.name}</p>
                              <p className="text-xs text-gray-500">{student.total} total meals</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(student.total / 90) * 100}%` }} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{Math.round((student.total / 90) * 100)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========== ANALYTICS TAB ========== */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-gray-800 mb-4">Daily Attendance Trend</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <ReBarChart data={attendanceChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="breakfast" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="lunch" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="dinner" fill="#2196F3" radius={[4, 4, 0, 0]} />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <h3 className="font-semibold text-gray-800 mb-4">Meal Popularity</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                          <Pie
                            data={mealDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Announce Special Dish</h2>
                <button onClick={() => setShowSpecialDishModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Dish Name *</label>
                  <input
                    type="text"
                    value={specialDish.dishName}
                    onChange={(e) => setSpecialDish({ ...specialDish, dishName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g., Butter Chicken Special"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={specialDish.description}
                    onChange={(e) => setSpecialDish({ ...specialDish, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] resize-none"
                    rows="3"
                    placeholder="Describe your special dish..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={specialDish.price}
                      onChange={(e) => setSpecialDish({ ...specialDish, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                      placeholder="₹"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Valid Until</label>
                    <input
                      type="date"
                      value={specialDish.validUntil}
                      onChange={(e) => setSpecialDish({ ...specialDish, validUntil: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowSpecialDishModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendSpecialDishNotification}
                    className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white py-2 rounded-lg font-medium"
                  >
                    Send to {students.length} Students
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