import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

const RecentOrdersTable = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'cancelled': return <XCircle size={12} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 dark:text-white">Recent Orders</h3>
        <Link to="/shop/orders" className="text-sm text-[#FF6B35] hover:underline">View All →</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-500">Order ID</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500">Customer</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500">Amount</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500">Date</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No orders found</td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">#{order._id?.slice(-6)}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{order.userId?.name}</td>
                  <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white">₹{order.total}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <Link to={`/shop/orders/${order._id}`} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                      <Eye size={16} className="text-gray-500" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;