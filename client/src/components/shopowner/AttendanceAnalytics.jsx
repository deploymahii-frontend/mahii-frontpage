import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { attendanceAPI } from '../../services/api';
import { TrendingUp, Users, Calendar, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const AttendanceAnalytics = ({ shopId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [shopId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAttendanceAnalytics({ shopId, days: timeRange });
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load attendance analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Analytics</h2>
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <button key={days} className="px-4 py-2 bg-gray-100 rounded-lg animate-pulse">
                {days} Days
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-20">
        <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No attendance data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Analytics</h2>
        <div className="flex gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === days
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalStudents}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Attendance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalAttendance}</p>
            </div>
            <Calendar className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.attendanceRate}%</p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top Performer</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {analytics.studentAttendance[0]?.name || 'N/A'}
              </p>
            </div>
            <Award className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Attendance Trend - Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
                labelFormatter={(value) => `Date: ${formatDate(value)}`}
              />
              <Legend />
              <Bar dataKey="breakfast" stackId="a" fill="#8884d8" name="Breakfast" />
              <Bar dataKey="lunch" stackId="a" fill="#82ca9d" name="Lunch" />
              <Bar dataKey="dinner" stackId="a" fill="#ffc658" name="Dinner" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Meal Distribution - Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meal Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Breakfast', value: analytics.mealDistribution.breakfast },
                  { name: 'Lunch', value: analytics.mealDistribution.lunch },
                  { name: 'Dinner', value: analytics.mealDistribution.dinner },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Breakfast', value: analytics.mealDistribution.breakfast },
                  { name: 'Lunch', value: analytics.mealDistribution.lunch },
                  { name: 'Dinner', value: analytics.mealDistribution.dinner },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Student Performance - Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.studentAttendance.slice(0, 10)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#6b7280"
                fontSize={12}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Bar dataKey="total" fill="#8884d8" name="Total Meals" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Attendance Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Student</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Breakfast</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Lunch</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Dinner</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Total</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Rate</th>
              </tr>
            </thead>
            <tbody>
              {analytics.studentAttendance.map((student, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{student.name}</td>
                  <td className="text-center py-3 px-4 text-blue-600">{student.breakfast}</td>
                  <td className="text-center py-3 px-4 text-green-600">{student.lunch}</td>
                  <td className="text-center py-3 px-4 text-purple-600">{student.dinner}</td>
                  <td className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">{student.total}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.total > 20 ? 'bg-green-100 text-green-800' :
                      student.total > 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {((student.total / (timeRange * 3)) * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;