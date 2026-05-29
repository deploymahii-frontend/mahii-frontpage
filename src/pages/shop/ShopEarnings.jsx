import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, orderAPI, subscriptionAPI } from '../../services/api';
import { DollarSign, ShoppingBag, Users, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';
import RevenueChart from './components/dashboard/RevenueChart';

const ShopEarnings = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, orderCount: 0, subscriptionRevenue: 0 });

  useEffect(() => {
    if (user?.role === 'shopowner') {
      loadEarnings();
    }
  }, [user]);

  const loadEarnings = async () => {
    setLoading(true);
    try {
      const shopsRes = await shopAPI.getMyShops();
      const userShop = shopsRes.data.shops?.[0];
      if (!userShop) return;

      const ordersRes = await orderAPI.getShopOrders(userShop._id);
      const subsRes = await subscriptionAPI.getShopSubscriptions(userShop._id);

      const fetchedOrders = ordersRes.data.orders || [];
      const fetchedSubscriptions = subsRes.data.subscriptions || [];

      const orderRevenue = fetchedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const subscriptionRevenue = fetchedSubscriptions.reduce((sum, sub) => sum + (sub.price || 0), 0);

      setOrders(fetchedOrders);
      setSubscriptions(fetchedSubscriptions);
      setSummary({
        totalRevenue: orderRevenue + subscriptionRevenue,
        orderCount: fetchedOrders.length,
        subscriptionRevenue,
      });

      const chartData = fetchedOrders
        .slice(-7)
        .reverse()
        .map((order) => ({
          date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          amount: order.total || 0,
        }));
      setData(chartData);
    } catch (error) {
      console.error('Error loading earnings:', error);
      toast.error('Unable to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Earnings</h1>
          <p className="text-gray-500">Review revenue from orders and subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#FF6B35] mb-3"><DollarSign size={20} />
              <span className="text-sm font-medium text-gray-500">Total revenue</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">₹{summary.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#4CAF50] mb-3"><ShoppingBag size={20} />
              <span className="text-sm font-medium text-gray-500">Order revenue</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">₹{(summary.totalRevenue - summary.subscriptionRevenue).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">{summary.orderCount} orders</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#6366F1] mb-3"><Users size={20} />
              <span className="text-sm font-medium text-gray-500">Subscription revenue</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">₹{summary.subscriptionRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">{subscriptions.length} active plans</p>
          </div>
        </div>

        <RevenueChart data={data} title="Recent Order Revenue" />

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-gray-900 dark:text-white"><Calendar size={20} /><h2 className="text-lg font-semibold">Recent orders</h2></div>
          {loading ? (
            <div className="text-gray-500">Loading recent orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500">No orders available yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-900 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-4">Order</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Total</th>
                    <th className="px-4 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map((order) => (
                    <tr key={order._id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-4 py-4">#{order._id.slice(-6)}</td>
                      <td className="px-4 py-4 capitalize">{order.orderStatus}</td>
                      <td className="px-4 py-4">₹{order.total}</td>
                      <td className="px-4 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ShopLayout>
  );
};

export default ShopEarnings;
