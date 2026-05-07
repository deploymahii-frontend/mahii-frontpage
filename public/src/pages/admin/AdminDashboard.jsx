import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { 
  Shield, 
  Users, 
  Store, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Check,
  X,
  Download,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  FileText,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    platformCommission: 0,
    monthlyGrowth: 0
  });
  const [pendingShops, setPendingShops] = useState([]);
  const [pendingShopOwners, setPendingShopOwners] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboardStats();
      const data = response.data;
      
      console.log('Dashboard data received:', data);
      console.log('Pending shops:', data.pendingShopsDetails);
      
      setStats({
        totalUsers: data.stats?.users?.total || 0,
        totalShops: data.stats?.shops?.total || 0,
        totalOrders: data.stats?.orders?.total || 0,
        totalRevenue: data.stats?.revenue?.total || 0,
        pendingApprovals: data.stats?.shops?.pending || 0,
        platformCommission: data.stats?.revenue?.platformCommission || 0,
        monthlyGrowth: 15
      });
      
      setPendingShops(data.pendingShopsDetails || []);
      setPendingShopOwners(data.pendingShopOwnersDetails || []);
      setRecentUsers(data.recentUsers || []);
      
      console.log('State updated with pending shops count:', (data.pendingShopsDetails || []).length);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if not admin or super admin
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return;
    }
    fetchDashboardData();
  }, [user]);

  // Redirect if not admin or super admin
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return <Navigate to="/secure-admin-portal" />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pending', label: 'Pending Approvals', icon: Clock, count: pendingShopOwners.length },
    { id: 'shops', label: 'Shop Approvals', icon: Store, count: pendingShops.length },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleApproveShop = async (shopId) => {
    try {
      console.log('Approving shop:', shopId);
      const response = await adminAPI.approveShop(shopId, { isActive: true });
      console.log('Approval response:', response);
      toast.success('Shop approved successfully!');
      // Refresh data after short delay
      setTimeout(() => fetchDashboardData(), 500);
    } catch (error) {
      console.error('Approval error:', error);
      toast.error(error.response?.data?.message || 'Failed to approve shop');
    }
  };

  const handleRejectShop = async (shopId) => {
    try {
      console.log('Rejecting shop:', shopId);
      const response = await adminAPI.approveShop(shopId, { isActive: false });
      console.log('Rejection response:', response);
      toast.success('Shop rejected successfully!');
      // Refresh data after short delay
      setTimeout(() => fetchDashboardData(), 500);
    } catch (error) {
      console.error('Rejection error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject shop');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={28} />
              <span className="text-xl font-bold">Admin Portal</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Mahii</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-blue-200">Super Admin</p>
                </div>
                <button onClick={logout} className="p-2 hover:bg-white/10 rounded-lg transition">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-custom py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your platform today.
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
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Users</p>
            <p className="text-xs text-green-500 mt-1">↑ {stats.monthlyGrowth}% this month</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Store className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalShops}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Shops</p>
            {stats.pendingApprovals > 0 && (
              <p className="text-xs text-orange-500 mt-1">{stats.pendingApprovals} pending approval</p>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Total Orders</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="text-yellow-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Platform Revenue</p>
            <p className="text-xs text-gray-500 mt-1">Commission: {((stats.platformCommission / stats.totalRevenue) * 100).toFixed(0)}%</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Pending Approvals */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-orange-500" />
                        Pending Shop Approvals
                      </h3>
                      {pendingShops.length > 0 ? (
                        <div className="space-y-3">
                          {pendingShops.map((shop) => (
                            <div key={shop._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                              <div>
                                <p className="font-semibold">{shop.name}</p>
                                <p className="text-sm text-gray-500">{shop.ownerId?.name} • {shop.location?.area}</p>
                                <p className="text-xs text-gray-400">{shop.category}</p>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleApproveShop(shop._id)}
                                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                                >
                                  <Check size={18} />
                                </button>
                                <button 
                                  onClick={() => handleRejectShop(shop._id)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                >
                                  <X size={18} />
                                </button>
                                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                  <Eye size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No pending approvals</p>
                      )}
                    </div>

                    {/* Recent Users */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
                      <div className="space-y-2">
                        {recentUsers.map((user) => (
                          <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email} • {user.role}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <button className="flex items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                        <Download size={18} className="text-blue-600" />
                        <span className="text-sm">Export Report</span>
                      </button>
                      <Link to="/admin/chat" className="flex items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition">
                        <MessageSquare size={18} className="text-green-600" />
                        <span className="text-sm">Open Support Chat</span>
                      </Link>
                      <button className="flex items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition">
                        <CreditCard size={18} className="text-purple-600" />
                        <span className="text-sm">Commission Settings</span>
                      </button>
                      <button className="flex items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition">
                        <FileText size={18} className="text-orange-600" />
                        <span className="text-sm">View Reports</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Pending Approvals Tab */}
                {activeTab === 'pending' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Pending Shop Owner Approvals ({pendingShopOwners.length})</h3>
                    
                    {pendingShopOwners.length > 0 ? (
                      <div className="space-y-4">
                        {pendingShopOwners.map((owner) => (
                          <motion.div
                            key={owner._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-yellow-200 dark:border-yellow-900"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                    <Shield size={24} className="text-yellow-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{owner.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Waiting for approval</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Applied on</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {new Date(owner.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Email</p>
                                <p className="font-semibold text-gray-900 dark:text-white break-all">{owner.email}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Phone</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{owner.phone}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">FSSAI License</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{owner.fssaiLicense || 'N/A'}</p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-4 text-sm">
                              <p className="text-gray-600 dark:text-gray-400">Bank Account</p>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {owner.bankDetails?.accountNumber ? `****${owner.bankDetails.accountNumber.slice(-4)}` : 'Not provided'}
                              </p>
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <button
                                onClick={() => {
                                  adminAPI.updateUser(owner._id, { isApproved: true }).then(() => {
                                    toast.success('Shop owner approved!');
                                    fetchDashboardData();
                                  }).catch(() => toast.error('Failed to approve'));
                                }}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                              >
                                <Check size={16} />
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  adminAPI.updateUser(owner._id, { isApproved: false }).then(() => {
                                    toast.error('Shop owner rejected');
                                    fetchDashboardData();
                                  }).catch(() => toast.error('Failed to reject'));
                                }}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                              >
                                <X size={16} />
                                Reject
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">No pending shop owner approvals</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Shop Approvals Tab */}
                {activeTab === 'shops' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Pending Shop Applications ({pendingShops.length})</h3>
                    </div>
                    
                    {pendingShops.length > 0 ? (
                      <div className="space-y-4">
                        {pendingShops.map((shop) => (
                          <motion.div
                            key={shop._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white">{shop.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Category: {shop.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Owner</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{shop.ownerId?.name}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Email</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{shop.ownerId?.email}</p>
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Phone</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{shop.ownerId?.phone}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-600 dark:text-gray-400">Location</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{shop.location?.address}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <button
                                onClick={() => handleApproveShop(shop._id)}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                              >
                                <Check size={16} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectShop(shop._id)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                              >
                                <X size={16} />
                                Reject
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">No pending shop approvals</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">User Management</h3>
                      <div className="flex gap-2">
                        <select className="px-3 py-2 border rounded-lg text-sm">
                          <option>All Roles</option>
                          <option>Customers</option>
                          <option>Shop Owners</option>
                        </select>
                        <input type="search" placeholder="Search users..." className="px-3 py-2 border rounded-lg text-sm" />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Joined</th>
                            <th className="p-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentUsers.map((user) => (
                            <tr key={user._id} className="border-b dark:border-gray-700">
                              <td className="p-3">
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                              </td>
                              <td className="p-3 capitalize">{user.role}</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {user.isVerified ? 'Active' : 'Pending'}
                                </span>
                              </td>
                              <td className="p-3 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <button className="p-1 text-blue-600">Edit</button>
                                  <button className="p-1 text-red-600">Block</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Revenue Report</h3>
                    <div className="flex gap-4 mb-6">
                      <select className="px-3 py-2 border rounded-lg">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>This year</option>
                      </select>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Download size={16} />
                        Export CSV
                      </button>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
                      <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Revenue chart will appear here</p>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Platform Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Commission Rate (%)</label>
                          <input type="number" defaultValue="10" className="input-field w-32" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Delivery Charge (₹)</label>
                          <input type="number" defaultValue="40" className="input-field w-32" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Minimum Order Amount (₹)</label>
                          <input type="number" defaultValue="99" className="input-field w-32" />
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">Save Settings</button>
                      </div>
                    </div>
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

export default AdminDashboard;