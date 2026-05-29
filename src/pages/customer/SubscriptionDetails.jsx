import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronLeft } from 'lucide-react';
import AttendanceView from '../../components/customer/AttendanceView';

const SubscriptionDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();

  if (!user || user.role !== 'customer') {
    return <Navigate to="/login/customer" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom space-y-6">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/my-subscriptions" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600">
            <ChevronLeft size={16} /> Back to Subscriptions
          </Link>
        </div>

        <div className="rounded-3xl bg-white dark:bg-gray-800 shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Subscription Details</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Active Subscription</h1>
          </div>
          <AttendanceView subscriptionId={id} />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
