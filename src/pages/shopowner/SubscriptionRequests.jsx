import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { subscriptionAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SubscriptionRequests = ({ shopId }) => {
  const { user } = useAuth();
  const [pendingSubscriptions, setPendingSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPendingSubscriptions();
  }, [shopId]);

  const fetchPendingSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await subscriptionAPI.getPendingSubscriptions(shopId);
      setPendingSubscriptions(response.data.subscriptions || []);
    } catch (error) {
      console.error('Error fetching pending subscriptions:', error);
      toast.error('Failed to load pending subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSubscription = async (subscriptionId) => {
    setActionLoading(true);
    try {
      await subscriptionAPI.approveSubscription(subscriptionId);
      toast.success('✓ Subscription approved!');
      toast.success('Customer notification sent');
      
      // Remove from pending list and refresh
      setPendingSubscriptions(prev => prev.filter(s => s._id !== subscriptionId));
      setSelectedSub(null);
      fetchPendingSubscriptions();
    } catch (error) {
      console.error('Error approving subscription:', error);
      toast.error('Failed to approve subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubscription = async (subscriptionId) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      await subscriptionAPI.rejectSubscription(subscriptionId, rejectReason);
      toast.success('✗ Subscription rejected');
      toast.success('Customer notification sent');
      
      // Remove from pending list and refresh
      setPendingSubscriptions(prev => prev.filter(s => s._id !== subscriptionId));
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedSub(null);
      fetchPendingSubscriptions();
    } catch (error) {
      console.error('Error rejecting subscription:', error);
      toast.error('Failed to reject subscription');
    } finally {
      setActionLoading(false);
    }
  };

  if (!user || user.role !== 'shopowner') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <p className="text-red-700 font-semibold">Access Denied</p>
        <p className="text-sm text-red-600">Only shop owners can manage subscription requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Requests</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review and approve customer subscription requests</p>
        </div>
        <div className="bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-xl">
          <p className="text-sm text-orange-700 dark:text-orange-300 font-semibold">
            {pendingSubscriptions.length} Pending
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pendingSubscriptions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-8 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">No Pending Requests</h3>
          <p className="text-green-700 dark:text-green-300">All subscription requests have been reviewed!</p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {pendingSubscriptions.map((subscription) => (
            <motion.div
              key={subscription._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Customer Info */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Customer</p>
                  <p className="font-bold text-gray-900 dark:text-white">{subscription.customerId?.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subscription.customerId?.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subscription.customerId?.phone}</p>
                </div>

                {/* Plan Details */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Plan Details</p>
                  <p className="font-bold text-gray-900 dark:text-white">{subscription.planName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">₹{subscription.price} • {subscription.type}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subscription.mealsPerDay} meals/day</p>
                </div>

                {/* Request Info */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Request Date</p>
                  <p className="font-bold text-gray-900 dark:text-white">{new Date(subscription.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(subscription.createdAt).toLocaleTimeString()}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Clock size={12} /> Awaiting Review
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 justify-center">
                  <button
                    onClick={() => handleApproveSubscription(subscription._id)}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                  >
                    <FaCheck size={14} /> Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSub(subscription);
                      setShowRejectModal(true);
                    }}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                  >
                    <FaTimes size={14} /> Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedSub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reject Subscription</h3>
              
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>{selectedSub.customerId?.name}</strong> requested <strong>{selectedSub.planName}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., Sorry, we are currently full. Please try again next month."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-red-500 dark:focus:border-red-500 resize-none"
                  rows="4"
                  disabled={actionLoading}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectSubscription(selectedSub._id)}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <FaTimes size={14} /> Reject
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionRequests;
