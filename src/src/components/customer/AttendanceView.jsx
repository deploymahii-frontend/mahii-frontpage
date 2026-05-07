import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Calendar, Clock, AlertCircle } from 'lucide-react';
import { subscriptionAPI } from '../../services/api';
import { listenToAttendance } from '../../config/firebase';
import toast from 'react-hot-toast';

const AttendanceView = ({ subscriptionId }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    fetchSubscription();
    generateQRCode();

    // Listen to real-time attendance updates
    const unsubscribe = listenToAttendance(subscriptionId, (record) => {
      toast.success(`Attendance marked for ${record.mealType}!`);
      fetchSubscription(); // Refresh data when new attendance is recorded
    });

    return () => unsubscribe();
  }, [subscriptionId]);

  const fetchSubscription = async () => {
    try {
      const response = await subscriptionAPI.getSubscriptionById(subscriptionId);
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const response = await subscriptionAPI.generateQRCode(subscriptionId);
      setQrCode(response.data.qrCode);
    } catch (error) {
      console.error('Error generating QR:', error);
    }
  };

  const markSelfAttendance = async (mealType) => {
    try {
      await subscriptionAPI.markAttendance({ subscriptionId, mealType, method: 'manual' });
      toast.success(`Attendance marked for ${mealType}!`);
      fetchSubscription();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const getMealTimeStatus = (mealType) => {
    const now = new Date();
    const hours = now.getHours();
    if (mealType === 'breakfast' && hours >= 8 && hours <= 10) return 'available';
    if (mealType === 'lunch' && hours >= 12 && hours <= 15) return 'available';
    if (mealType === 'dinner' && hours >= 19 && hours <= 22) return 'available';
    return 'closed';
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  const todayAttendance = subscription?.attendance?.filter(a => 
    new Date(a.date).toDateString() === new Date().toDateString()
  ) || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#C2185B]">{subscription?.mealsRemaining || 0}</p>
          <p className="text-xs text-gray-500">Meals Left</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{subscription?.mealsConsumed || 0}</p>
          <p className="text-xs text-gray-500">Used</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-orange-600">{subscription?.totalMeals || 0}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
        <h3 className="font-semibold mb-3">Scan QR at Mess</h3>
        {qrCode ? (
          <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
        ) : (
          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
            <QrCode size={48} className="text-gray-400" />
          </div>
        )}
        <p className="text-xs text-gray-500 mt-3">Show this QR code to mark attendance</p>
      </div>

      {/* Manual Attendance Buttons */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Mark Attendance</h3>
        <div className="grid grid-cols-3 gap-3">
          {['breakfast', 'lunch', 'dinner'].map(meal => {
            const isMarked = todayAttendance.some(a => a.mealType === meal);
            const status = getMealTimeStatus(meal);
            
            return (
              <button
                key={meal}
                onClick={() => markSelfAttendance(meal)}
                disabled={isMarked || status === 'closed'}
                className={`py-3 rounded-xl font-medium capitalize transition ${
                  isMarked
                    ? 'bg-green-100 text-green-600 cursor-default'
                    : status === 'closed'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#C2185B] text-white hover:bg-[#E5093F]'
                }`}
              >
                {isMarked ? <CheckCircle size={16} className="inline mr-1" /> : null}
                {meal}
                {status === 'closed' && <Clock size={14} className="inline ml-1" />}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          Meal timings: Breakfast (8-10am) | Lunch (12-3pm) | Dinner (7-10pm)
        </p>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar size={18} />
          Recent Attendance
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {subscription?.attendance?.slice(-10).reverse().map((att, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 border-b">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                <span className="capitalize">{att.mealType}</span>
              </div>
              <span className="text-sm text-gray-500">{new Date(att.date).toLocaleDateString()}</span>
            </div>
          ))}
          {subscription?.attendance?.length === 0 && (
            <p className="text-center text-gray-500 py-4">No attendance records yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;
