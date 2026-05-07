import React, { useState, useEffect } from 'react';
import { listenToOrders, updateOrderStatus } from '../../config/firebase';
import { Bell, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManager = ({ shopId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);

    // Listen to real-time orders
    const unsubscribe = listenToOrders(shopId, (newOrder) => {
      setOrders(prev => {
        // Check if order already exists to avoid duplicates
        const existingIndex = prev.findIndex(order => order.id === newOrder.id);
        if (existingIndex >= 0) {
          // Update existing order
          const updated = [...prev];
          updated[existingIndex] = newOrder;
          return updated;
        } else {
          // Add new order
          toast.success(`New order #${newOrder.id.slice(-6)} received!`);

          // Play sound notification (if available)
          try {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => {}); // Ignore if audio fails
          } catch (error) {
            // Audio not available, continue
          }

          return [newOrder, ...prev];
        }
      });
    });

    return () => unsubscribe();
  }, [shopId]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, shopId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2185B] mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell size={20} />
            Real-time Orders
          </h3>
          <span className="bg-[#C2185B] text-white px-3 py-1 rounded-full text-sm">
            {orders.filter(o => o.status === 'pending').length} Pending
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No orders yet</p>
            <p className="text-sm">New orders will appear here automatically</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {orders.map(order => (
              <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">Order #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">
                      {order.customerName || 'Customer'} • {order.items?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#C2185B]">₹{order.total || 0}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {order.items && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Just now'}
                  </p>

                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {order.status === 'confirmed' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                      >
                        Start Preparing
                      </button>
                    </div>
                  )}

                  {order.status === 'preparing' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition"
                      >
                        Mark Ready
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;
