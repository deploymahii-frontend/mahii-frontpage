import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { orderAPI, subscriptionAPI, paymentAPI } from '../../services/api';
import { 
  User, 
  ShoppingBag, 
  Calendar, 
  CreditCard,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Star,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ChevronRight,
  Home,
  Utensils,
  Wallet,
  Heart,
  Share2,
  Download,
  CalendarCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import MealAttendanceCard from '../../components/customer/MealAttendanceCard';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeSubscriptions: 0,
    totalSpent: 0,
    savedAmount: 0
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      try {
        const ordersRes = await orderAPI.getMyOrders();
        setOrders(ordersRes.data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }

      // Fetch subscriptions
      try {
        const subscriptionsRes = await subscriptionAPI.getMySubscriptions();
        setSubscriptions(subscriptionsRes.data.subscriptions || []);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setSubscriptions([]);
      }

      // Fetch payments
      try {
        const paymentsRes = await paymentAPI.getPaymentHistory();
        setPayments(paymentsRes.data.payments || []);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setPayments([]);
      }

      // Calculate stats after all fetches (successful or not)
      setStats(prev => prev);
    } catch (error) {
      console.error('Error in dashboard data fetch:', error);
      toast.error('Failed to load some dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Recalculate stats whenever data changes
  useEffect(() => {
    const totalOrders = orders.length;
    const activeSubscriptions = subscriptions.filter(s => s.isActive).length;
    const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const savedAmount = totalSpent * 0.15;
    
    setStats({ totalOrders, activeSubscriptions, totalSpent, savedAmount });
  }, [orders, subscriptions, payments]);

  useEffect(() => {
    if (user?.id && user.role === 'customer') {
      fetchDashboardData();
    }
  }, [user?.id, user?.role]);

  // Redirect if not customer
  if (!user || user.role !== 'customer') {
    return <Navigate to="/login/customer" />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: stats.totalOrders },
    { id: 'subscriptions', label: 'Subscriptions', icon: Calendar, count: stats.activeSubscriptions },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'confirmed': return <Truck size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your orders, manage subscriptions, and more
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-orange-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Orders</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSubscriptions}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Active Subscriptions</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Wallet className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalSpent}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Spent</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <Star className="text-yellow-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-yellow-600">₹{stats.savedAmount}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Estimated Savings</p>
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-orange-500 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Recent Orders */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                      {orders.slice(0, 3).map((order) => (
                        <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
                          <div>
                            <p className="font-medium">Order #{order._id?.slice(-6)}</p>
                            <p className="text-sm text-gray-500">₹{order.total} • {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                            <Link to={`/orders/${order._id}`} className="text-orange-500 hover:text-orange-600">
                              <ChevronRight size={20} />
                            </Link>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No orders yet. Start exploring!</p>
                      )}
                    </div>

                    {/* Active Subscriptions */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Active Subscriptions</h3>
                      {subscriptions.filter(s => s.isActive).slice(0, 3).map((sub) => (
                        <div key={sub._id} className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-3">
                          <div>
                            <p className="font-medium">{sub.planName}</p>
                            <p className="text-sm text-gray-500">{sub.mealsRemaining} meals remaining</p>
                          </div>
                          <Link to={`/subscriptions/${sub._id}`} className="text-green-500 hover:text-green-600">
                            <ChevronRight size={20} />
                          </Link>
                        </div>
                      ))}
                      {subscriptions.filter(s => s.isActive).length === 0 && (
                        <p className="text-gray-500 text-center py-8">No active subscriptions. Subscribe to a mess!</p>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Link to="/explore" className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 transition">
                          <Utensils className="text-orange-600" />
                          <span className="font-medium">Order Food</span>
                        </Link>
                        <Link to="/my-subscriptions" className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 transition">
                          <Calendar className="text-green-600" />
                          <span className="font-medium">Manage Subs</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-2">Meal Attendance</h3>
                      <p className="text-gray-600 dark:text-gray-400">Mark your attendance for breakfast, lunch, and dinner</p>
                    </div>
                    
                    {/* Active Subscriptions for Attendance */}
                    {subscriptions.filter(s => s.isActive).length > 0 ? (
                      <div className="grid gap-6">
                        {subscriptions.filter(s => s.isActive).map((sub) => (
                          <MealAttendanceCard 
                            key={sub._id} 
                            subscription={sub} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CalendarCheck size={48} className="mx-auto text-gray-400 mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Subscriptions</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">You need an active subscription to mark attendance</p>
                        <Link 
                          to="/explore" 
                          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
                        >
                          <Utensils size={18} />
                          Browse Messes
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold">Order #{order._id?.slice(-8)}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="space-y-2 mb-3">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                          <span className="font-bold">Total: ₹{order.total}</span>
                          <Link to={`/orders/${order._id}`} className="text-orange-500 text-sm hover:underline">
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subscriptions Tab */}
                {activeTab === 'subscriptions' && (
                  <div className="space-y-4">
                    {subscriptions.map((sub) => (
                      <div key={sub._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold">{sub.planName}</p>
                            <p className="text-sm text-gray-500">{sub.shopId?.name}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {sub.isActive ? 'Active' : 'Expired'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-500">Start Date</p>
                            <p className="font-medium">{new Date(sub.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">End Date</p>
                            <p className="font-medium">{new Date(sub.endDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Meals Remaining</p>
                            <p className="font-medium">{sub.mealsRemaining} / {sub.totalMeals}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Price</p>
                            <p className="font-medium">₹{sub.price}</p>
                          </div>
                        </div>
                        <Link to={`/subscriptions/${sub._id}`} className="text-orange-500 text-sm hover:underline">
                          View Attendance →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment._id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <div>
                          <p className="font-semibold">₹{payment.amount}</p>
                          <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400 capitalize">{payment.paymentType}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {payment.status}
                          </span>
                          <button className="block text-xs text-orange-500 mt-1 hover:underline">
                            <Download size={14} className="inline" /> Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                        <User size={40} className="text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{user?.name}</h3>
                        <p className="text-gray-500">{user?.email}</p>
                        <p className="text-gray-500">{user?.phone}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <MapPin size={20} className="text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Delivery Address</p>
                          <p className="font-medium">{user?.address?.street || 'Not set'}, {user?.address?.city || 'Pune'}</p>
                        </div>
                        <button className="ml-auto text-orange-500 text-sm">Edit</button>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Bell size={20} className="text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Notification Preferences</p>
                          <p className="font-medium">Email & Push notifications</p>
                        </div>
                        <button className="ml-auto text-orange-500 text-sm">Edit</button>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Heart size={20} className="text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Favorite Shops</p>
                          <p className="font-medium">3 saved places</p>
                        </div>
                        <button className="ml-auto text-orange-500 text-sm">View</button>
                      </div>
                    </div>
                    
                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 transition"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;