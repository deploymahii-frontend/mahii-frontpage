import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, attendanceAPI } from '../../services/api';
import { Bell, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';
import AttendanceChart from './components/dashboard/AttendanceChart';
import MealDistribution from './components/dashboard/MealDistribution';

const ShopAttendance = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'shopowner') {
      loadAttendance();
    }
  }, [user]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const shopsRes = await shopAPI.getMyShops();
      const userShop = shopsRes.data.shops?.[0];
      if (!userShop) return;
      const analyticsRes = await attendanceAPI.getAnalytics(userShop._id);
      setAnalytics(analyticsRes.data.analytics || null);
    } catch (error) {
      console.error('Error loading attendance:', error);
      toast.error('Unable to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
          <p className="text-gray-500">Track daily meal attendance and student participation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-[#FF6B35]">
              <Bell size={20} />
              <div>
                <p className="text-sm font-medium text-gray-500">Attendance rate</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{analytics?.attendanceRate || 0}%</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-[#10B981]">
              <CheckCircle size={20} />
              <div>
                <p className="text-sm font-medium text-gray-500">Students tracked</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{analytics?.totalStudents || 0}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-[#6366F1]">
              <Calendar size={20} />
              <div>
                <p className="text-sm font-medium text-gray-500">Total attendance</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{analytics?.totalAttendance || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <AttendanceChart data={analytics?.dailyData || []} />
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <MealDistribution data={[
                { name: 'Breakfast', value: analytics?.mealDistribution?.breakfast || 0 },
                { name: 'Lunch', value: analytics?.mealDistribution?.lunch || 0 },
                { name: 'Dinner', value: analytics?.mealDistribution?.dinner || 0 },
              ]} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top student attendance</h2>
              {loading ? (
                <div className="text-gray-500">Loading leaderboard...</div>
              ) : analytics?.studentAttendance?.length > 0 ? (
                <div className="space-y-3">
                  {analytics.studentAttendance.slice(0, 6).map((student, index) => (
                    <div key={student.name || index} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total attendance {student.total}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#FF6B35]">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No attendance records yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default ShopAttendance;
