import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, MessageSquare, AlertCircle, Loader } from 'lucide-react';
import { shopAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminEditApprovalsPanel = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingEdits();
  }, []);

  const fetchPendingEdits = async () => {
    setLoading(true);
    try {
      const response = await shopAPI.getPendingShopEdits();
      setShops(response.data.shops || []);
    } catch (error) {
      console.error('Error fetching pending edits:', error);
      toast.error('Failed to load pending edits');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId) => {
    setActionLoading(true);
    try {
      await shopAPI.approveShopEdit(shopId, {
        adminNotes: 'Approved by admin',
      });
      toast.success('Changes approved successfully');
      setSelectedShop(null);
      fetchPendingEdits();
    } catch (error) {
      console.error('Error approving edit:', error);
      toast.error(error.response?.data?.message || 'Failed to approve changes');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await shopAPI.rejectShopEdit(selectedShop._id, {
        rejectionReason,
      });
      toast.success('Changes rejected successfully');
      setSelectedShop(null);
      setShowRejectModal(false);
      setRejectionReason('');
      fetchPendingEdits();
    } catch (error) {
      console.error('Error rejecting edit:', error);
      toast.error(error.response?.data?.message || 'Failed to reject changes');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Pending Reviews
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          All shop edit requests have been reviewed
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {shops.length}
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">Pending Reviews</p>
        </div>
      </div>

      {/* Pending Edits List */}
      <div className="space-y-4">
        {shops.map((shop, index) => (
          <motion.div
            key={shop._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Owner: {shop.ownerId?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Submitted on {new Date(shop.editSubmittedAt).toLocaleDateString()} at{' '}
                    {new Date(shop.editSubmittedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold">
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Changes Preview */}
              {shop.pendingEdits && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Proposed Changes:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(shop.pendingEdits).map(([key, value]) => (
                      <div
                        key={key}
                        className="text-sm border-l-4 border-orange-500 pl-3"
                      >
                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 break-words">
                          {typeof value === 'object'
                            ? JSON.stringify(value, null, 2)
                            : value?.toString() || 'No change'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedShop(shop);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                >
                  <Eye size={16} />
                  View Details
                </button>
                <button
                  onClick={() => handleApprove(shop._id)}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedShop(shop);
                    setShowRejectModal(true);
                  }}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedShop && !showRejectModal && (
        <DetailModal shop={selectedShop} onClose={() => setSelectedShop(null)} />
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && selectedShop && (
        <RejectModal
          shop={selectedShop}
          reason={rejectionReason}
          setReason={setRejectionReason}
          onConfirm={handleReject}
          onCancel={() => {
            setShowRejectModal(false);
            setRejectionReason('');
          }}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

// Detail Modal Component
const DetailModal = ({ shop, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{shop.name}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current vs Proposed */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Changes Review
            </h3>

            {shop.pendingEdits && (
              <div className="space-y-4">
                {Object.entries(shop.pendingEdits).map(([key, newValue]) => {
                  const oldValue = shop[key];
                  return (
                    <div
                      key={key}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <p className="font-semibold text-gray-900 dark:text-white mb-2">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">Current:</p>
                          <p className="bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300 px-3 py-2 rounded break-words">
                            {oldValue?.toString() || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">Proposed:</p>
                          <p className="bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300 px-3 py-2 rounded break-words">
                            {typeof newValue === 'object'
                              ? JSON.stringify(newValue)
                              : newValue?.toString() || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shop Owner Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Shop Owner</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Name:</span> {shop.ownerId?.name}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Email:</span> {shop.ownerId?.email}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Reject Modal Component
const RejectModal = ({
  shop,
  reason,
  setReason,
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
        <div className="bg-red-500 text-white p-6 flex items-center gap-3">
          <AlertCircle size={24} />
          <div>
            <h2 className="text-xl font-bold">Reject Changes</h2>
            <p className="text-red-100 text-sm">for {shop.name}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why these changes are being rejected..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading || !reason.trim()}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditApprovalsPanel;
