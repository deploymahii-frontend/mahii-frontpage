import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Filter, ChevronDown } from 'lucide-react';
import { shopAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EarningsReport = ({ shopId }) => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    pending: 0,
    paid: 0,
    transactions: [],
  });

  useEffect(() => {
    if (shopId) {
      fetchEarnings();
    }
  }, [shopId, period]);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const response = await shopAPI.getEarnings(shopId, { period });
      setEarnings(response.data || {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
        pending: 0,
        paid: 0,
        transactions: [],
      });
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  const StatCard = ({ title, value, icon: Icon, color, prefix = '₹' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Earnings Overview
          </h3>
          <p className="text-sm text-gray-500">Track your revenue and payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800"
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <Download size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-[#C2185B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Revenue" value={earnings.total} icon={DollarSign} color="bg-green-500" />
            <StatCard title="This Month" value={earnings.thisMonth} icon={TrendingUp} color="bg-blue-500" />
            <StatCard title="Pending" value={earnings.pending} icon={Calendar} color="bg-yellow-500" />
            <StatCard title="Paid" value={earnings.paid} icon={DollarSign} color="bg-purple-500" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h4 className="font-semibold mb-4">Revenue Trend</h4>
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Revenue chart will appear here</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold">Recent Transactions</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium">Date</th>
                    <th className="p-4 text-left text-sm font-medium">Order ID</th>
                    <th className="p-4 text-left text-sm font-medium">Customer</th>
                    <th className="p-4 text-left text-sm font-medium">Amount</th>
                    <th className="p-4 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {earnings.transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    earnings.transactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="p-4 text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="p-4 text-sm">#{tx.orderId?.slice(-6) || 'N/A'}</td>
                        <td className="p-4 text-sm">{tx.customerName || 'Guest'}</td>
                        <td className="p-4 text-sm font-semibold">{tx.amount}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'paid' ? 'bg-green-100 text-green-700' :
                            tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {tx.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EarningsReport;
