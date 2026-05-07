import React from 'react';
import { Clock, ShoppingBag, UserPlus, Store, DollarSign } from 'lucide-react';

const activities = [
  { id: 1, type: 'order', user: 'Rahul Sharma', action: 'placed an order', amount: '₹349', time: '2 min ago', icon: ShoppingBag, color: 'bg-blue-500' },
  { id: 2, type: 'user', user: 'Priya Patel', action: 'registered as customer', time: '15 min ago', icon: UserPlus, color: 'bg-green-500' },
  { id: 3, type: 'shop', user: 'Student Mess Hub', action: 'registered as shop', time: '1 hour ago', icon: Store, color: 'bg-purple-500' },
  { id: 4, type: 'payment', user: 'Amit Kumar', action: 'completed payment', amount: '₹1,299', time: '3 hours ago', icon: DollarSign, color: 'bg-yellow-500' },
];

const RecentActivity = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <button className="text-sm text-[#FF6B35] hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3">
            <div className={`w-10 h-10 ${activity.color} rounded-xl flex items-center justify-center`}>
              <activity.icon size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                <span className="font-semibold">{activity.user}</span> {activity.action}
                {activity.amount && <span className="font-semibold"> {activity.amount}</span>}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Clock size={10} /> {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;