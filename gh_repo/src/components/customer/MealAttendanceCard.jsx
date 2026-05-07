import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../../services/api';
import { Coffee, Sun, Moon, CheckCircle, Clock, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const MealAttendanceCard = ({ subscriptionId }) => {
  const [attendance, setAttendance] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });
  const [streak, setStreak] = useState(0);
  const [totalMeals, setTotalMeals] = useState(0);
  const [loading, setLoading] = useState({});
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    fetchAttendanceHistory();
  }, [subscriptionId]);

  const fetchAttendanceHistory = async () => {
    try {
      const response = await attendanceAPI.getMyAttendance(subscriptionId);
      if (response.data.success) {
        const attendanceData = response.data.attendance;
        const today = new Date().toISOString().split('T')[0];

        // Set today's attendance status
        const todayAttendance = {};
        attendanceData.forEach(record => {
          const recordDate = record.date.toISOString().split('T')[0];
          if (recordDate === today) {
            todayAttendance[record.mealType] = record;
          }
        });

        setAttendance({
          breakfast: todayAttendance.breakfast || null,
          lunch: todayAttendance.lunch || null,
          dinner: todayAttendance.dinner || null,
        });

        setStreak(response.data.streak || 0);
        setTotalMeals(response.data.totalMeals || 0);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    }
  };

  const markAttendance = async (mealType) => {
    setLoading(prev => ({ ...prev, [mealType]: true }));
    try {
      const response = await attendanceAPI.markAttendance({
        subscriptionId,
        mealType,
        method: 'student',
      });

      if (response.data.success) {
        setAttendance(prev => ({
          ...prev,
          [mealType]: { status: 'present', markedAt: new Date() },
        }));
        setStreak(prev => prev + 1);
        setTotalMeals(prev => prev + 1);
        toast.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} attendance marked!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(prev => ({ ...prev, [mealType]: false }));
    }
  };

  const generateQRCode = async (mealType) => {
    try {
      const response = await attendanceAPI.generateQRCode(subscriptionId);
      if (response.data.success) {
        setQrCode({
          url: response.data.qrCode,
          mealType,
        });
      }
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast':
        return <Coffee className="text-orange-500" size={24} />;
      case 'lunch':
        return <Sun className="text-yellow-500" size={24} />;
      case 'dinner':
        return <Moon className="text-blue-500" size={24} />;
      default:
        return <Clock className="text-gray-500" size={24} />;
    }
  };

  const getMealColor = (mealType) => {
    switch (mealType) {
      case 'breakfast':
        return 'from-orange-400 to-orange-600';
      case 'lunch':
        return 'from-yellow-400 to-yellow-600';
      case 'dinner':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const meals = [
    { key: 'breakfast', label: 'Breakfast', time: '8:00 AM - 10:00 AM' },
    { key: 'lunch', label: 'Lunch', time: '12:00 PM - 2:00 PM' },
    { key: 'dinner', label: 'Dinner', time: '7:00 PM - 9:00 PM' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daily Attendance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Mark your meal attendance</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{streak}</div>
          <div className="text-xs text-gray-500">Day Streak</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{totalMeals}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Meals</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {Math.round((totalMeals / 90) * 100)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">This Month</div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {Math.round((streak / 30) * 100)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Consistency</div>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="space-y-4">
        {meals.map((meal) => (
          <div
            key={meal.key}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
              attendance[meal.key]?.status === 'present'
                ? 'border-green-200 bg-green-50 dark:bg-green-900/10'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getMealColor(meal.key)} flex items-center justify-center`}>
                  {getMealIcon(meal.key)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{meal.label}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{meal.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {attendance[meal.key]?.status === 'present' ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={20} />
                    <span className="text-sm font-medium">Marked</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => markAttendance(meal.key)}
                      disabled={loading[meal.key]}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {loading[meal.key] ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      Mark
                    </button>
                    <button
                      onClick={() => generateQRCode(meal.key)}
                      className="p-2 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                      title="Generate QR Code"
                    >
                      <QrCode size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {attendance[meal.key] && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Marked at {new Date(attendance[meal.key].markedAt).toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendance[meal.key].status)}`}>
                    {attendance[meal.key].status}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      {qrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {qrCode.mealType.charAt(0).toUpperCase() + qrCode.mealType.slice(1)} QR Code
              </h3>
              <img
                src={qrCode.url}
                alt="Attendance QR Code"
                className="mx-auto mb-4 border border-gray-200 dark:border-gray-600 rounded-lg"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Show this QR code to mark your {qrCode.mealType} attendance
              </p>
              <button
                onClick={() => setQrCode(null)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealAttendanceCard;