import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { orderAPI, shopAPI } from '../../services/api';
import { 
  Search, Filter, Eye, CheckCircle, XCircle, Clock, 
  Truck, Package, ChevronDown, Download, Calendar,
  User, MapPin, Phone, DollarSign, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';

const ShopOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [shop, setShop] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Orders', icon: Package },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-100 text-blue-700' },
    { value: 'preparing', label: 'Preparing', icon: ChefHat, color: 'bg-purple-100 text-purple-700' },
    { value: 'ready', label: 'Ready', icon: Package, color: 'bg-indigo-100 text-indigo-700' },
    { value: 'out-for-delivery', label: 'Out for Delivery', icon: Truck, color: 'bg-orange-100 text-orange-700' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700' },
  ];

  useEffect(() => {
    fetchShopAndOrders();
  }, [user]);

  const fetchShopAndOrders = async () => {
    setLoading(true);
    try {
      const shopsRes = await shopAPI.getMyShops();
      const userShop = shopsRes.data.shops?.[0];
      setShop(userShop);
      
      if (userShop) {
        const ordersRes = await orderAPI.getShopOrders(userShop._id);
        setOrders(ordersRes.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchShopAndOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.orderStatus !== filter) return false;
    if (searchTerm) {
      return order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const getStatusDetails = (status) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const OrderCard = ({ order }) => {
    const statusDetail = getStatusDetails(order.orderStatus);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Order #{order._id?.slice(-8)}</p>
            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusDetail.color || 'bg-gray-100 text-gray-700'}`}>
            {order.orderStatus}
          </span>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] flex items-center justify-center text-white font-semibold">
              {order.userId?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{order.userId?.name}</p>
              <p className="text-xs text-gray-500">{order.userId?.phone}</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            {order.items?.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.quantity}x {item.name}</span>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
            {order.items?.length > 2 && (
              <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="font-bold text-gray-900 dark:text-white">Total: ₹{order.total}</span>
            <button
              onClick={() => setSelectedOrder(order)}
              className="text-sm text-[#FF6B35] hover:underline flex items-center gap-1"
            >
              View Details <Eye size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <ShopLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
          <p className="text-gray-500">Manage and track customer orders</p>
        </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filter === opt.value
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm w-64 focus:outline-none focus:border-[#FF6B35]"
          />
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders found</h3>
          <p className="text-gray-500">Orders will appear here once customers place them</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">#{selectedOrder._id?.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-gray-400" />
                      <span>{selectedOrder.userId?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-gray-400" />
                      <span>{selectedOrder.userId?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}</span>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
                
                {/* Update Status */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.filter(s => s.value !== 'all').map((status) => (
                      <button
                        key={status.value}
                        onClick={() => updateOrderStatus(selectedOrder._id, status.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${status.color || 'bg-gray-100 text-gray-700'}`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ShopLayout>
  );
};

// Helper component
const X = ({ size, onClick, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} onClick={onClick}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChefHat = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 13.87A4 4 0 0 1 7.5 6.1 4 4 0 0 1 13.5 5.5 4 4 0 0 1 18 10.5l.5 1.5" />
    <path d="M6 17h12" />
    <path d="M6 21h12" />
  </svg>
);

export default ShopOrders;