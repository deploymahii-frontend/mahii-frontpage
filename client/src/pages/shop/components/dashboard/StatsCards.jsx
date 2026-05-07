import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, DollarSign, UserCheck, TrendingUp, Clock } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: '#FF6B35',
      bg: 'bg-orange-50',
      trend: stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : null,
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: Users,
      color: '#4CAF50',
      bg: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: '#9C27B0',
      bg: 'bg-purple-50',
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: UserCheck,
      color: '#FFC107',
      bg: 'bg-yellow-50',
      trend: stats.attendanceRate > 70 ? 'Good' : 'Needs Improvement',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
              <card.icon size={22} style={{ color: card.color }} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</span>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
          {card.trend && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp size={10} className="text-green-500" />
              {card.trend}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;