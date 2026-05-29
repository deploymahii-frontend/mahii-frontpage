import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Star,
  Package,
  Calendar,
  Image as ImageIcon,
  Gift,
  MessageCircle,
  MapPin,
  Cake,
  IceCream,
  Sparkles,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const DessertDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [shopData, setShopData] = useState({
    id: 1,
    name: "Sweet Haven",
    ownerName: "Priya Mehta",
    email: "priya@sweethaven.com",
    phone: "+91 98765 43210",
    location: "Near Rankala Lake, Kolhapur",
    rating: 4.8,
    totalOrders: 3420,
    totalRevenue: 456780,
    totalCustomers: 2456,
    completionRate: 99,
    status: "active",
    joinedDate: "2024-01-10",
    openTime: "11:00 AM",
    closeTime: "11:00 PM",
    description: "Premium dessert shop offering handcrafted cakes, artisanal pastries, and premium ice creams.",
    categories: ["Cakes", "Pastries", "Ice Creams", "Brownies", "Indian Sweets", "Beverages"]
  });

  const [products, setProducts] = useState([
    { id: 1, name: "Chocolate Truffle Cake", category: "Cakes", price: 499, originalPrice: 599, stock: 25, sold: 342, rating: 4.9, orders: 342, revenue: 170658, status: "active", isPopular: true, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9580?w=100&h=100&fit=crop" },
    { id: 2, name: "Red Velvet Cake", category: "Cakes", price: 599, originalPrice: 699, stock: 18, sold: 278, rating: 4.8, orders: 278, revenue: 166522, status: "active", isPopular: true, image: "https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=100&h=100&fit=crop" },
    { id: 3, name: "Belgian Chocolate Ice Cream", category: "Ice Creams", price: 129, originalPrice: 159, stock: 100, sold: 890, rating: 4.8, orders: 890, revenue: 114810, status: "active", isPopular: true, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=100&h=100&fit=crop" },
    { id: 4, name: "Chocolate Pastry", category: "Pastries", price: 89, originalPrice: 99, stock: 80, sold: 1250, rating: 4.7, orders: 1250, revenue: 111250, status: "active", isPopular: true, image: "https://images.unsplash.com/photo-1559617311-a8c5293c8e5a?w=100&h=100&fit=crop" },
    { id: 5, name: "Blueberry Cheesecake", category: "Pastries", price: 149, originalPrice: 179, stock: 45, sold: 567, rating: 4.9, orders: 567, revenue: 84483, status: "active", isPopular: true, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=100&h=100&fit=crop" },
    { id: 6, name: "Gulab Jamun", category: "Indian Sweets", price: 99, originalPrice: 99, stock: 60, sold: 890, rating: 4.6, orders: 890, revenue: 88110, status: "active", image: "https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=100&h=100&fit=crop" },
    { id: 7, name: "Chocolate Brownie", category: "Brownies", price: 79, originalPrice: 99, stock: 70, sold: 678, rating: 4.7, orders: 678, revenue: 53562, status: "active", isPopular: true, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=100&h=100&fit=crop" },
    { id: 8, name: "Hot Chocolate", category: "Beverages", price: 149, originalPrice: 179, stock: 55, sold: 432, rating: 4.8, orders: 432, revenue: 64368, status: "inactive", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=100&h=100&fit=crop" },
    { id: 9, name: "Strawberry Ice Cream", category: "Ice Creams", price: 119, originalPrice: 139, stock: 85, sold: 567, rating: 4.7, orders: 567, revenue: 67473, status: "active", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=100&h=100&fit=crop" },
    { id: 10, name: "Butterscotch Cake", category: "Cakes", price: 549, originalPrice: 649, stock: 12, sold: 156, rating: 4.8, orders: 156, revenue: 85644, status: "active", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9580?w=100&h=100&fit=crop" }
  ]);

  const salesData = {
    week: [
      { name: "Mon", orders: 95, revenue: 14250 },
      { name: "Tue", orders: 102, revenue: 15300 },
      { name: "Wed", orders: 118, revenue: 17700 },
      { name: "Thu", orders: 125, revenue: 18750 },
      { name: "Fri", orders: 156, revenue: 23400 },
      { name: "Sat", orders: 189, revenue: 28350 },
      { name: "Sun", orders: 172, revenue: 25800 }
    ],
    month: [
      { name: "Week 1", orders: 780, revenue: 117000 },
      { name: "Week 2", orders: 850, revenue: 127500 },
      { name: "Week 3", orders: 920, revenue: 138000 },
      { name: "Week 4", orders: 980, revenue: 147000 }
    ],
    year: [
      { name: "Jan", orders: 3200, revenue: 480000 },
      { name: "Feb", orders: 3450, revenue: 517500 },
      { name: "Mar", orders: 3680, revenue: 552000 },
      { name: "Apr", orders: 3920, revenue: 588000 },
      { name: "May", orders: 4150, revenue: 622500 },
      { name: "Jun", orders: 4380, revenue: 657000 }
    ]
  };

  const categoryData = [
    { name: "Cakes", value: 32, color: "#FF6B6B" },
    { name: "Pastries", value: 24, color: "#FFA94D" },
    { name: "Ice Creams", value: 18, color: "#4ECDC4" },
    { name: "Brownies", value: 12, color: "#8B5CF6" },
    { name: "Indian Sweets", value: 9, color: "#FFB347" },
    { name: "Beverages", value: 5, color: "#06B6D4" }
  ];

  const recentOrders = [
    { id: "#ORD001", customer: "Meera Joshi", items: "Chocolate Truffle Cake, Chocolate Pastry", amount: 588, status: "completed", time: "10 mins ago" },
    { id: "#ORD002", customer: "Kunal Desai", items: "Belgian Chocolate Ice Cream (2)", amount: 258, status: "preparing", time: "15 mins ago" },
    { id: "#ORD003", customer: "Priya Shah", items: "Red Velvet Cake", amount: 599, status: "completed", time: "25 mins ago" },
    { id: "#ORD004", customer: "Rahul Mehta", items: "Blueberry Cheesecake, Hot Chocolate", amount: 298, status: "delivered", time: "35 mins ago" },
    { id: "#ORD005", customer: "Sneha Patil", items: "Gulab Jamun (4 pcs)", amount: 396, status: "cancelled", time: "1 hour ago" }
  ];

  const topProducts = products
    .filter(p => p.status === 'active')
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'preparing': return 'bg-yellow-100 text-yellow-700';
      case 'delivered': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={14} />;
      case 'preparing': return <Clock size={14} />;
      case 'delivered': return <CheckCircle size={14} />;
      case 'cancelled': return <AlertCircle size={14} />;
      default: return null;
    }
  };

  const handleAddProduct = (productData) => {
    const newProduct = {
      id: products.length + 1,
      ...productData,
      sold: 0,
      orders: 0,
      revenue: 0,
      rating: 0,
      status: 'active',
      isPopular: false
    };
    setProducts([...products, newProduct]);
    toast.success('Sweet treat added successfully! 🍰');
    setShowAddProduct(false);
  };

  const handleEditProduct = (product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
    toast.success('Product updated successfully! 🎂');
    setShowEditProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product removed from menu');
    setShowDeleteConfirm(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const statsCards = [
    { title: "Total Revenue", value: `₹${(shopData.totalRevenue / 1000).toFixed(1)}K`, change: "+15.3%", icon: DollarSign, color: "bg-gradient-to-br from-green-500 to-green-600" },
    { title: "Total Orders", value: shopData.totalOrders.toLocaleString(), change: "+12.8%", icon: ShoppingBag, color: "bg-gradient-to-br from-orange-500 to-orange-600" },
    { title: "Avg Order Value", value: `₹${Math.round(shopData.totalRevenue / shopData.totalOrders)}`, change: "+5.2%", icon: TrendingUp, color: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { title: "Customer Rating", value: shopData.rating.toFixed(1), change: "+0.2", icon: Star, color: "bg-gradient-to-br from-yellow-500 to-yellow-600" }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Sweet Menu', icon: Cake },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'offers', label: 'Sweet Deals', icon: Gift },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7F4] to-[#FFF8F0] font-['Poppins']">
      <motion.aside
        initial={{ width: sidebarOpen ? 280 : 80 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-white/95 backdrop-blur-sm border-r border-[#ECECEC] z-30 overflow-hidden"
      >
        <div className="p-5 flex items-center justify-between border-b border-[#ECECEC]">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF7A00] to-[#FFA94D] rounded-lg flex items-center justify-center">
                <Cake size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-[#1E1E1E]">Mahii</span>
              <span className="text-xs text-[#FF7A00] bg-orange-50 px-2 py-0.5 rounded-full">Dessert</span>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFA94D] text-white shadow-md'
                  : 'text-[#6B7280] hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#ECECEC]">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition">
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-20'}`}>
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-[#ECECEC] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1E1E1E] flex items-center gap-2">
                {sidebarItems.find(i => i.id === activeTab)?.label}
                {activeTab === 'overview' && <Sparkles size={20} className="text-yellow-500" />}
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">Welcome back, {shopData.ownerName} 🍰</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
                <Bell size={20} className="text-[#6B7280]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/women/1.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
                />
                <div className="hidden md:block">
                  <p className="font-semibold text-sm text-[#1E1E1E]">{shopData.ownerName}</p>
                  <p className="text-xs text-[#6B7280]">{shopData.name}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statsCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-[#ECECEC] hover:shadow-md transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#6B7280]">{stat.title}</p>
                        <p className="text-2xl font-bold text-[#1E1E1E] mt-1">{stat.value}</p>
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <TrendingUp size={10} /> {stat.change}
                        </p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition`}>
                        <stat.icon size={24} className="text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#ECECEC]">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-[#1E1E1E] text-lg flex items-center gap-2">
                        <TrendingUp size={18} className="text-[#FF7A00]" />
                        Sales Overview
                      </h3>
                      <p className="text-sm text-[#6B7280]">Revenue and order trends</p>
                    </div>
                    <div className="flex gap-2">
                      {['week', 'month', 'year'].map((period) => (
                        <button
                          key={period}
                          onClick={() => setSelectedPeriod(period)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            selectedPeriod === period
                              ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFA94D] text-white'
                              : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                          }`}
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData[selectedPeriod]}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#FF7A00" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECECEC" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#FF7A00" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECECEC]">
                  <h3 className="font-semibold text-[#1E1E1E] text-lg mb-4 flex items-center gap-2">
                    <IceCream size={18} className="text-[#FF7A00]" />
                    Sales by Category
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {categoryData.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                          <span className="text-[#6B7280]">{cat.name}</span>
                        </div>
                        <span className="font-semibold text-[#1E1E1E]">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-[#ECECEC] overflow-hidden">
                  <div className="p-5 border-b border-[#ECECEC] flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1E1E1E] text-lg">Recent Orders 🧁</h3>
                      <p className="text-sm text-[#6B7280]">Latest customer orders</p>
                    </div>
                    <button className="text-[#FF7A00] text-sm font-semibold">View All</button>
                  </div>
                  <div className="divide-y divide-[#ECECEC] max-h-96 overflow-y-auto">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="p-4 hover:bg-gray-50 transition">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#1E1E1E] text-sm">{order.id}</span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-[#6B7280] mt-1">{order.customer}</p>
                            <p className="text-xs text-[#6B7280] mt-1">{order.items}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#1E1E1E]">₹{order.amount}</p>
                            <p className="text-xs text-[#6B7280] mt-1">{order.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-[#ECECEC] overflow-hidden">
                  <div className="p-5 border-b border-[#ECECEC]">
                    <h3 className="font-semibold text-[#1E1E1E] text-lg flex items-center gap-2">
                      <Star size={18} className="text-yellow-500" />
                      Top Selling Sweets
                    </h3>
                    <p className="text-sm text-[#6B7280]">Best performing items</p>
                  </div>
                  <div className="divide-y divide-[#ECECEC]">
                    {topProducts.map((product, index) => (
                      <div key={product.id} className="p-4 hover:bg-gray-50 transition">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-[#1E1E1E]">{product.name}</p>
                                <p className="text-xs text-[#6B7280]">{product.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#FF7A00]">₹{product.price}</p>
                                <p className="text-xs text-[#6B7280]">{product.orders} orders</p>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{product.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Package size={12} className="text-[#6B7280]" />
                                <span className="text-xs text-[#6B7280]">Sold: {product.sold}</span>
                              </div>
                              {product.isPopular && (
                                <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Sparkles size={8} /> Popular
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-5 text-white">
                  <Cake size={32} className="mb-3" />
                  <p className="text-sm opacity-90">Custom Cakes</p>
                  <p className="text-2xl font-bold mt-1">156 orders</p>
                  <p className="text-xs opacity-80 mt-2">+23% this month</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-5 text-white">
                  <IceCream size={32} className="mb-3" />
                  <p className="text-sm opacity-90">Ice Cream Sales</p>
                  <p className="text-2xl font-bold mt-1">1,457 units</p>
                  <p className="text-xs opacity-80 mt-2">+18% this month</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white">
                  <Award size={32} className="mb-3" />
                  <p className="text-sm opacity-90">Avg. Rating</p>
                  <p className="text-2xl font-bold mt-1">{shopData.rating} ★</p>
                  <p className="text-xs opacity-80 mt-2">Based on 2.4k reviews</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Search sweet treats..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-[#ECECEC] rounded-xl w-64 focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2.5 border border-[#ECECEC] rounded-xl bg-white focus:outline-none focus:border-[#FF7A00]"
                  >
                    <option value="all">All Categories 🍰</option>
                    {shopData.categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF7A00] to-[#FFA94D] text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  <Plus size={18} /> Add Sweet Treat
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#ECECEC] hover:shadow-lg transition group"
                  >
                    <div className="relative h-44">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      {product.isPopular && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full flex items-center gap-1">
                          <Sparkles size={10} /> Popular
                        </span>
                      )}
                      {product.status === 'inactive' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Unavailable</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-[#1E1E1E]">{product.name}</h3>
                          <p className="text-xs text-[#6B7280] mt-1">{product.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{product.rating}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-lg font-bold text-[#FF7A00]">₹{product.price}</p>
                        {product.originalPrice > product.price && (
                          <p className="text-xs text-[#6B7280] line-through">₹{product.originalPrice}</p>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package size={12} className="text-[#6B7280]" />
                          <span className="text-xs text-[#6B7280]">Stock: {product.stock}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowEditProduct(product)}
                            className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(product.id)}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ECECEC]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Completion Rate</p>
                      <p className="text-2xl font-bold text-[#1E1E1E] mt-1">{shopData.completionRate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${shopData.completionRate}%` }}></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ECECEC]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Total Customers</p>
                      <p className="text-2xl font-bold text-[#1E1E1E] mt-1">{shopData.totalCustomers}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-3">+245 new this month</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ECECEC]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Avg. Preparation Time</p>
                      <p className="text-2xl font-bold text-[#1E1E1E] mt-1">18 min</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Clock size={24} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-3">Faster than 92% of dessert shops</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ECECEC]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Repeat Customers</p>
                      <p className="text-2xl font-bold text-[#1E1E1E] mt-1">68%</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Award size={24} className="text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-3">+5% from last month</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECECEC]">
                  <h3 className="font-semibold text-[#1E1E1E] text-lg mb-4">Revenue Trend 📈</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData.month}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECECEC" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#FF7A00" strokeWidth={2} dot={{ fill: '#FF7A00', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECECEC]">
                  <h3 className="font-semibold text-[#1E1E1E] text-lg mb-4">Order Trend 📊</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData.month}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECECEC" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#FFA94D" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECECEC]">
                <h3 className="font-semibold text-[#1E1E1E] text-lg mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-[#FF7A00]" />
                  Peak Ordering Hours
                </h3>
                <div className="space-y-3">
                  {[
                    { hour: "11 AM - 1 PM", orders: 245, percentage: 28 },
                    { hour: "1 PM - 3 PM", orders: 189, percentage: 22 },
                    { hour: "4 PM - 6 PM", orders: 267, percentage: 30 },
                    { hour: "7 PM - 9 PM", orders: 178, percentage: 20 }
                  ].map((slot) => (
                    <div key={slot.hour}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#6B7280]">{slot.hour}</span>
                        <span className="font-semibold text-[#1E1E1E]">{slot.orders} orders</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-[#FF7A00] to-[#FFA94D] h-2 rounded-full" style={{ width: `${slot.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddProduct && (
          <AddProductModal
            onClose={() => setShowAddProduct(false)}
            onAdd={handleAddProduct}
            categories={shopData.categories}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditProduct && (
          <EditProductModal
            product={showEditProduct}
            onClose={() => setShowEditProduct(null)}
            onEdit={handleEditProduct}
            categories={shopData.categories}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirmModal
            onClose={() => setShowDeleteConfirm(null)}
            onConfirm={() => handleDeleteProduct(showDeleteConfirm)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const AddProductModal = ({ onClose, onAdd, categories }) => {
  const [productData, setProductData] = useState({
    name: '',
    category: categories[0],
    price: 0,
    originalPrice: 0,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9580?w=100&h=100&fit=crop'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(productData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#1E1E1E] flex items-center gap-2">
            <Cake size={20} className="text-[#FF7A00]" />
            Add Sweet Treat
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Dessert Name</label>
            <input
              type="text"
              required
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
              placeholder="e.g., Chocolate Truffle Cake"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Category</label>
            <select
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Original Price</label>
              <input
                type="number"
                value={productData.originalPrice}
                onChange={(e) => setProductData({ ...productData, originalPrice: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Stock Quantity</label>
            <input
              type="number"
              required
              value={productData.stock}
              onChange={(e) => setProductData({ ...productData, stock: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#ECECEC] rounded-xl text-[#6B7280] font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-[#FF7A00] to-[#FFA94D] text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Add to Menu 🍰
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const EditProductModal = ({ product, onClose, onEdit, categories }) => {
  const [productData, setProductData] = useState({ ...product });

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(productData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#1E1E1E] flex items-center gap-2">
            <Edit size={20} className="text-[#FF7A00]" />
            Edit Sweet Treat
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Dessert Name</label>
            <input
              type="text"
              required
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Category</label>
            <select
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1">Original Price</label>
              <input
                type="number"
                value={productData.originalPrice}
                onChange={(e) => setProductData({ ...productData, originalPrice: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Stock Quantity</label>
            <input
              type="number"
              required
              value={productData.stock}
              onChange={(e) => setProductData({ ...productData, stock: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#ECECEC] rounded-xl text-[#6B7280] font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-[#FF7A00] to-[#FFA94D] text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              Save Changes 🎂
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const DeleteConfirmModal = ({ onClose, onConfirm }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl max-w-md w-full p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Cake size={32} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">Remove from Menu?</h3>
        <p className="text-[#6B7280] mb-6">This sweet treat will be removed from your menu. Customers won't be able to order it.</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#ECECEC] rounded-xl text-[#6B7280] font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
          >
            Remove Item
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DessertDashboard;
