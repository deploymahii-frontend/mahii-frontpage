import React from 'react';
import { Eye } from 'lucide-react';

const topProducts = [
  { id: 1, name: 'Butter Chicken Meal', category: 'Non-Veg', sales: 1245, revenue: '₹31,125', growth: '+15%' },
  { id: 2, name: 'Veg Thali', category: 'Veg', sales: 980, revenue: '₹24,500', growth: '+8%' },
  { id: 3, name: 'Masala Dosa', category: 'Breakfast', sales: 756, revenue: '₹18,900', growth: '+22%' },
  { id: 4, name: 'Cold Coffee', category: 'Beverages', sales: 543, revenue: '₹13,575', growth: '+5%' },
  { id: 5, name: 'Chicken Biryani', category: 'Non-Veg', sales: 432, revenue: '₹10,800', growth: '-2%' },
];

const TopSellingTable = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Selling Products</h3>
        <button className="text-sm text-[#FF6B35] hover:underline">View All →</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="pb-3 text-left text-xs font-medium text-gray-500">Product</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500">Category</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500">Sales</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500">Revenue</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500">Growth</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{product.category}</td>
                <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{product.sales}</td>
                <td className="py-3 text-sm font-semibold text-gray-900 dark:text-white">{product.revenue}</td>
                <td className={`py-3 text-sm ${product.growth.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {product.growth}
                </td>
                <td className="py-3">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                    <Eye size={16} className="text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingTable;