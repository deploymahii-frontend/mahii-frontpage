import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, subscriptionAPI, attendanceAPI } from '../../services/api';
import { Users, BarChart3, Clock, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';

const ShopStudents = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'shopowner') {
      loadStudents();
    }
  }, [user]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const shopsRes = await shopAPI.getMyShops();
      const userShop = shopsRes.data.shops?.[0];
      if (!userShop) return;

      const subsRes = await subscriptionAPI.getShopSubscriptions(userShop._id);
      setSubscriptions(subsRes.data.subscriptions || []);

      const analyticsRes = await attendanceAPI.getAnalytics(userShop._id);
      setAnalytics(analyticsRes.data.analytics || null);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = subscriptions.filter((sub) => {
    const name = sub.userId?.name?.toLowerCase() || '';
    return name.includes(search.toLowerCase());
  });

  return (
    <ShopLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-gray-500">Review all enrolled students and attendance performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-[#4CAF50]">
              <Users size={20} />
              <div>
                <p className="text-sm font-medium text-gray-500">Total students</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{subscriptions.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-[#FF6B35]">
              <BarChart3 size={20} />
              <div>
                <p className="text-sm font-medium text-gray-500">Attendance rate</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{analytics?.attendanceRate || 0}%</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-[#6366F1]">
              <Clock size={20} />
              <div>
                <p className="text-sm font-medium text-gray-500">Recent attendance</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{analytics?.totalAttendance || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student roster</h2>
              <p className="text-sm text-gray-500">Search by student name or subscription plan.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students"
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 w-full sm:w-80"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No students found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-900 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Plan</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((sub) => (
                    <tr key={sub._id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{sub.userId?.name || 'Unknown'}</td>
                      <td className="px-4 py-4">{sub.userId?.email || '-'}</td>
                      <td className="px-4 py-4">{sub.planName || sub.planType}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {sub.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4">{sub.mealsConsumed || 0} / {sub.totalMeals || 0}</td>
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

export default ShopStudents;
