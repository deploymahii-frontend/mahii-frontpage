import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, subscriptionAPI } from '../../services/api';
import { Calendar, Users, XCircle, CheckCircle, Clock, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';

const ShopSubscriptions = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [approving, setApproving] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (user?.role === 'shopowner') {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const shopsRes = await shopAPI.getMyShops();
      const userShop = shopsRes.data.shops?.[0];
      setShop(userShop);
      if (userShop) {
        const subsRes = await subscriptionAPI.getShopSubscriptions(userShop._id);
        setSubscriptions(subsRes.data.subscriptions || []);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast.error('Unable to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (subscriptionId) => {
    if (!window.confirm('Cancel this subscription?')) return;
    setCancelling(subscriptionId);
    try {
      await subscriptionAPI.cancelSubscription(subscriptionId, 'Cancelled by shop owner');
      toast.success('Subscription cancelled');
      loadSubscriptions();
    } catch (error) {
      console.error('Cancel failed:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setCancelling(null);
    }
  };

  const handleApprove = async (subscriptionId) => {
    if (!window.confirm('Approve and activate this subscription?')) return;
    setApproving(subscriptionId);
    try {
      await subscriptionAPI.approveSubscription(subscriptionId);
      toast.success('Subscription activated');
      loadSubscriptions();
    } catch (error) {
      console.error('Approve failed:', error);
      toast.error('Failed to activate subscription');
    } finally {
      setApproving(null);
    }
  };

  const handleDelete = async (subscriptionId) => {
    if (!window.confirm('Delete this subscription permanently?')) return;
    setDeleting(subscriptionId);
    try {
      await subscriptionAPI.deleteSubscription(subscriptionId);
      toast.success('Subscription deleted');
      loadSubscriptions();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete subscription');
    } finally {
      setDeleting(null);
    }
  };

  const now = new Date();
  const activeCount = subscriptions.filter((sub) => sub.isActive).length;
  const pendingCount = subscriptions.filter((sub) => !sub.isActive && !sub.cancelledAt && new Date(sub.endDate) > now).length;
  const expiredCount = subscriptions.length - activeCount - pendingCount;

  return (
    <ShopLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-gray-500">Manage active student subscriptions for your shop.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-[#FF6B35]">
              <Calendar size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Active Subscriptions</h3>
            </div>
            <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-[#4CAF50]">
              <CheckCircle size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Total Subscriptions</h3>
            </div>
            <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{subscriptions.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-[#F59E0B]">
              <Clock size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Pending Approval</h3>
            </div>
            <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-[#F97316]">
              <XCircle size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-white">Expired / Cancelled</h3>
            </div>
            <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{expiredCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Subscription list</h2>
            <p className="text-sm text-gray-500">View payment plans, students, and subscription status.</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading subscriptions...</div>
          ) : subscriptions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No subscriptions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-900 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-4">Student</th>
                    <th className="px-4 py-4">Plan</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Ends</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub._id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{sub.userId?.name || 'Unknown student'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{sub.userId?.email || 'No email'}</div>
                      </td>
                      <td className="px-4 py-4">{sub.planName || sub.planType}</td>
                      <td className="px-4 py-4">₹{sub.price}</td>
                      <td className="px-4 py-4">
                        {(() => {
                          const isPending = !sub.isActive && !sub.cancelledAt && new Date(sub.endDate) > now;
                          const isExpired = !sub.isActive && (sub.cancelledAt || new Date(sub.endDate) <= now);
                          const statusLabel = isPending ? 'Pending' : isExpired ? 'Expired' : 'Active';
                          const statusClass = isPending ? 'bg-yellow-100 text-yellow-800' : isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';

                          return (
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                              {statusLabel}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-4">{new Date(sub.endDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        {(() => {
                          const isPending = !sub.isActive && !sub.cancelledAt && new Date(sub.endDate) > now;
                          const isActiveRow = sub.isActive;
                          const isExpired = !sub.isActive && (sub.cancelledAt || new Date(sub.endDate) <= now);

                          if (isPending) {
                            return (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleApprove(sub._id)}
                                  disabled={approving === sub._id || cancelling === sub._id || deleting === sub._id}
                                  className="rounded-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                  {approving === sub._id ? 'Approving...' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => handleCancel(sub._id)}
                                  disabled={cancelling === sub._id || approving === sub._id || deleting === sub._id}
                                  className="rounded-full px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#e55a2b] disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                  {cancelling === sub._id ? 'Cancelling...' : 'Cancel'}
                                </button>
                                <button
                                  onClick={() => handleDelete(sub._id)}
                                  disabled={deleting === sub._id || approving === sub._id || cancelling === sub._id}
                                  className="rounded-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                  {deleting === sub._id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            );
                          }

                          if (isActiveRow) {
                            return (
                              <button
                                onClick={() => handleCancel(sub._id)}
                                disabled={cancelling === sub._id || deleting === sub._id}
                                className="rounded-full px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#e55a2b] disabled:cursor-not-allowed disabled:bg-gray-300"
                              >
                                {cancelling === sub._id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            );
                          }

                          return (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleDelete(sub._id)}
                                disabled={deleting === sub._id}
                                className="rounded-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                              >
                                {deleting === sub._id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          );
                        })()}
                      </td>
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

export default ShopSubscriptions;
