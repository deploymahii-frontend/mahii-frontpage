import React from 'react';
import ShopLayout from './ShopLayout';

const ShopAnalytics = () => {
  return (
    <ShopLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-500">Track your shop's performance and insights</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <p>Analytics content will be implemented here</p>
        </div>
      </div>
    </ShopLayout>
  );
};

export default ShopAnalytics;