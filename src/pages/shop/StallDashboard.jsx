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
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Star,
  Package,
  Gift,
  MessageCircle,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const StallDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [stallData, setStallData] = useState({
    id: 1,
    name: "Chai Spot",
    ownerName: "Rahul Patil",
    email: "rahul@chaispot.com",
    phone: "+91 98765 43210",
    location: "Near KIT College Main Gate, Kolhapur",
    rating: 4.5,
    totalOrders: 1247,
    totalRevenue: 45670,
    totalCustomers: 892,
    completionRate: 98,
    status: "active",
    joinedDate: "2024-01-15",
    openTime: "8:00 AM",
    closeTime: "10:00 PM",
    description: "Best chai and snacks near KIT College. Serving fresh and affordable food to students.",
    categories: ["Chai & Beverages", "Snacks", "Sandwiches & Rolls", "Maggi & Noodles", "Fries & Sides", "Desserts"]
  });

  const [products, setProducts] = useState([
    { id: 1, name: "Cutting Chai", category: "Chai & Beverages", price: 10, originalPrice: 10, stock: 200, sold: 1450, rating: 4.8, orders: 450, revenue: 4500, status: "active", image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=100&h=100&fit=crop" },
    { id: 2, name: "Masala Chai", category: "Chai & Beverages", price: 15, originalPrice: 15, stock: 150, sold: 980, rating: 4.9, orders: 980, revenue: 14700, status: "active", image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=100&h=100&fit=crop" },
    { id: 3, name: "Vada Pav", category: "Snacks", price: 25, originalPrice: 25, stock: 100, sold: 890, rating: 4.7, orders: 890, revenue: 22250, status: "active", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=100&h=100&fit=crop" },
    { id: 4, name: "Samosa", category: "Snacks", price: 15, originalPrice: 15, stock: 120, sold: 1200, rating: 4.6, orders: 1200, revenue: 18000, status: "active", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&h=100&fit=crop" },
    { id: 5, name: "Bun Maska", category: "Snacks", price: 20, originalPrice: 20, stock: 80, sold: 650, rating: 4.5, orders: 650, revenue: 13000, status: "active", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&h=100&fit=crop" },
    { id: 6, name: "Masala Maggi", category: "Maggi & Noodles", price: 40, originalPrice: 40, stock: 60, sold: 420, rating: 4.8, orders: 420, revenue: 16800, status: "active", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&h=100&fit=crop" },
    { id: 7, name: "Veg Cheese Sandwich", category: "Sandwiches & Rolls", price: 70, originalPrice: 70, stock: 50, sold: 310, rating: 4.7, orders: 310, revenue: 21700, status: "inactive", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=100&h=100&fit=crop" },
    { id: 8, name: "French Fries", category: "Fries & Sides", price: 40, originalPrice: 40, stock: 90, sold: 560, rating: 4.6, orders: 560, revenue: 22400, status: "active", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100&h=100&fit=crop" },
  ]);

  const salesData = {
    week: [
      { name: "Mon", orders: 45, revenue: 5400 },
      { name: "Tue", orders: 52, revenue: 6240 },
      { name: "Wed", orders: 48, revenue: 5760 },
      { name: "Thu", orders: 61, revenue: 7320 },
      { name: "Fri", orders: 78, revenue: 9360 },
      { name: "Sat", orders: 85, revenue: 10200 },
      { name: "Sun", orders: 72, revenue: 8640 }
    ],
    month: [
      { name: "Week 1", orders: 320, revenue: 38400 },
      { name: "Week 2", orders: 380, revenue: 45600 },
      { name: "Week 3", orders: 420, revenue: 50400 },
      { name: "Week 4", orders: 450, revenue: 54000 }
    ],
    year: [
      { name: "Jan", orders: 1200, revenue: 144000 },
      { name: "Feb", orders: 1350, revenue: 162000 },
      { name: "Mar", orders: 1420, revenue: 170400 },
      { name: "Apr", orders: 1580, revenue: 189600 },
      { name: "May", orders: 1650, revenue: 198000 },
      { name: "Jun", orders: 1720, revenue: 206400 }
    ]
  };

  const categoryData = [
    { name: "Chai & Beverages", value: 35, color: "#FF7A00" },
    { name: "Snacks", value: 28, color: "#FFA94D" },
    { name: "Maggi & Noodles", value: 15, color: "#22C55E" },
    { name: "Sandwiches & Rolls", value: 12, color: "#8B5CF6" },
    { name: "Fries & Sides", value: 7, color: "#EF4444" },
    { name: "Desserts", value: 3, color: "#06B6D4" }
  ];

  const recentOrders = [
    { id: "#ORD001", customer: "Raj Patil", items: "Masala Chai, Samosa", amount: 35, status: "completed", time: "10 mins ago" },
    { id: "#ORD002", customer: "Sneha Desai", items: "Cutting Chai (2)", amount: 20, status: "preparing", time: "15 mins ago" },
    { id: "#ORD003", customer: "Amit Kulkarni", items: "Vada Pav, Masala Chai", amount: 40, status: "completed", time: "25 mins ago" },
    { id: "#ORD004", customer: "Priya Sharma", items: "Masala Maggi", amount: 40, status: "delivered", time: "35 mins ago" },
    { id: "#ORD005", customer: "Rohit More", items: "Bun Maska (2)", amount: 40, status: "cancelled", time: "1 hour ago" }
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
      status: 'active'
    };
    setProducts([...products, newProduct]);
    toast.success('Product added successfully!');
    setShowAddProduct(false);
  };

  const handleEditProduct = (product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
    toast.success('Product updated successfully!');
    setShowEditProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully!');
    setShowDeleteConfirm(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const statsCards = [
    { title: "Total Revenue", value: `₹${stallData.totalRevenue.toLocaleString()}`, change: "+12.5%", icon: DollarSign, color: "bg-gradient-to-br from-green-500 to-green-600" },
    { title: "Total Orders", value: stallData.totalOrders.toLocaleString(), change: "+8.2%", icon: ShoppingBag, color: "bg-gradient-to-br from-orange-500 to-orange-600" },
    { title: "Avg Order Value", value: `₹${Math.round(stallData.totalRevenue / stallData.totalOrders)}`, change: "+5.3%", icon: TrendingUp, color: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { title: "Customer Rating", value: stallData.rating.toFixed(1), change: "+0.3", icon: Star, color: "bg-gradient-to-br from-yellow-500 to-yellow-600" }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'offers', label: 'Offers', icon: Gift },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-['Poppins']">
      <motion.aside
        initial={{ width: sidebarOpen ? 280 : 80 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-white border-r border-[#ECECEC] z-30 overflow-hidden"
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
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-lg text-[#1E1E1E]">Mahii</span>
              <span className="text-xs text-[#FF7A00] bg-orange-50 px-2 py-0.5 rounded-full">Stall</span>
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
                  ? 'bg-[#FF7A00] text-white shadow-md'
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
              <h1 className="text-2xl font-bold text-[#1E1E1E]">
                {sidebarItems.find(i => i.id === activeTab)?.label}
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">Welcome back, {stallData.ownerName}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
                <Bell size={20} className="text-[#6B7280]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="hidden md:block">
                  <p className="font-semibold text-sm text-[#1E1E1E]">{stallData.ownerName}</p>
                  <p className="text-xs text-[#6B7280]">{stallData.name}</p>
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
                    className="bg-white rounded-2xl p-5 shadow-sm border border-[#ECECEC] hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#6B7280]">{stat.title}</p>
                        <p className="text-2xl font-bold text-[#1E1E1E] mt-1">{stat.value}</p>
                        <p className="text-xs text-green-600 mt-2">{stat.change} from last month</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
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
                      <h3 className="font-semibold text-[#1E1E1E] text-lg">Sales Overview</h3>
                      <p className="text-sm text-[#6B7280]">Revenue and order trends</p>
                    </div>
                    <div className="flex gap-2">
                      {['week', 'month', 'year'].map((period) => (
                        <button
                          key={period}
                          onClick={() => setSelectedPeriod(period)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            selectedPeriod === period
                              ? 'bg-[#FF7A00] text-white'
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
                      <Bar dataKey="orders" fill="#FFA94D" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECECEC]">
                  <h3 className="font-semibold text-[#1E1E1E] text-lg mb-4">Sales by Category</h3>
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
                      <h3 className="font-semibold text-[#1E1E1E] text-lg">Recent Orders</h3>
                      <p className="text-sm text-[#6B7280]">Latest customer orders</p>
                    </div>
                    <button className="text-[#FF7A00] text-sm font-semibold">View All</button>
                  </div>
                  <div className="divide-y divide-[#ECECEC]">
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
                    <h3 className="font-semibold text-[#1E1E1E] text-lg">Top Selling Products</h3>
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
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      placeholder="Search products..."
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
                    <option value="all">All Categories</option>
                    {stallData.categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#FF7A00] text-white rounded-xl font-semibold hover:bg-[#FF6A00] transition"
                >
                  <Plus size={18} /> Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#ECECEC] hover:shadow-md transition"
                  >
                    <div className="relative h-40">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      {product.status === 'inactive' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Inactive</span>
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
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-[#FF7A00]">₹{product.price}</p>
                          <p className="text-xs text-[#6B7280]">Stock: {product.stock}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowEditProduct(product)}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(product.id)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
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
                      <p className="text-2xl font-bold text-[#1E1E1E] mt-1">{stallData.completionRate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stallData.completionRate}%` }}></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ECECEC]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Total Customers</p>
                      <p className="text-2xl font-bold text-[#1E1E1E] mt-1">{stallData.totalCustomers}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-3">+15 new this week</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ECECEC]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Avg. Response Time</p>
                      <p className="text-2xl font-bold text-[#1E1E1E] mt-1">2.5 min</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Clock size={24} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-3">Faster than 85% of stalls</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#ECECEC]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#6B7280]">Customer Rating</p>
                      <p className="text-2xl font-bold text-[#1E1E1E] mt-1">{stallData.rating}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Star size={24} className="text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} size={14} className={`${star <= Math.floor(stallData.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECECEC]">
                  <h3 className="font-semibold text-[#1E1E1E] text-lg mb-4">Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData.month}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECECEC" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#FF7A00" strokeWidth={2} dot={{ fill: '#FF7A00' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECECEC]">
                  <h3 className="font-semibold text-[#1E1E1E] text-lg mb-4">Order Trend</h3>
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
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddProduct && (
          <AddProductModal
            onClose={() => setShowAddProduct(false)}
            onAdd={handleAddProduct}
            categories={stallData.categories}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditProduct && (
          <EditProductModal
            product={showEditProduct}
            onClose={() => setShowEditProduct(null)}
            onEdit={handleEditProduct}
            categories={stallData.categories}
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
    stock: 0,
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=100&h=100&fit=crop'
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
          <h3 className="text-xl font-bold text-[#1E1E1E]">Add New Product</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Product Name</label>
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
              className="flex-1 py-2.5 bg-[#FF7A00] text-white rounded-xl font-semibold hover:bg-[#FF6A00] transition"
            >
              Add Product
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
          <h3 className="text-xl font-bold text-[#1E1E1E]">Edit Product</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1">Product Name</label>
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
              className="flex-1 py-2.5 bg-[#FF7A00] text-white rounded-xl font-semibold hover:bg-[#FF6A00] transition"
            >
              Save Changes
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
          <Trash2 size={32} className="text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">Delete Product?</h3>
        <p className="text-[#6B7280] mb-6">This action cannot be undone. The product will be permanently removed.</p>
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
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StallDashboard;
