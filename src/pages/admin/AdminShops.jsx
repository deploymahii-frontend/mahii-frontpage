import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Store, Search, Check, X, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from './components/Sidebar';

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [ownershipRequests, setOwnershipRequests] = useState([]);

  useEffect(() => {
    fetchShops();
    fetchOwnershipRequests();
    
    // Set up real-time polling every 30 seconds
    const interval = setInterval(fetchShops, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllShops();
      setShops(response.data.shops || []);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnershipRequests = async () => {
    try {
      // pull all shops and extract pending ownership requests
      const response = await adminAPI.getAllShops();
      const allShops = response.data.shops || [];
      const requests = [];
      allShops.forEach(s => {
        (s.ownershipRequests || []).forEach(r => {
          if (r.status === 'pending') requests.push({ shop: s, request: r });
        });
      });
      setOwnershipRequests(requests);
    } catch (err) {
      console.error('Failed to load ownership requests', err);
    }
  };

  const handleApproveShop = async (shopId) => {
    const remarks = prompt('Enter approval remarks (optional):');
    try {
      await adminAPI.approveShop(shopId, { remarks: remarks || 'Approved by admin' });
      setShops(shops.map(s => s._id === shopId ? { ...s, isActive: true, isApproved: true } : s));
      toast.success('Shop approved successfully and is now visible on explore page');
    } catch (error) {
      toast.error('Failed to approve shop');
    }
  };

  const handleRejectShop = async (shopId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) {
      toast.error('Rejection reason is required');
      return;
    }
    try {
      await adminAPI.rejectShop(shopId, { reason });
      setShops(shops.map(s => s._id === shopId ? { ...s, isActive: false, isApproved: false } : s));
      toast.success('Shop rejected');
    } catch (error) {
      toast.error('Failed to reject shop');
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(search.toLowerCase()) ||
                         shop.ownerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
                         shop.ownerId?.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && shop.isActive) ||
                         (filterStatus === 'pending' && !shop.isActive) ||
                         (filterStatus === 'rejected' && shop.isApproved === false && shop.rejectionReason);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar activeTab="shops" setActiveTab={() => {}} />

      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shops Management</h1>
          <p className="text-gray-500 mt-1">Manage all shops on the platform</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md mb-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shops..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending Approval</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Shops List */}
        {/* Ownership Requests */}
        {ownershipRequests.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Ownership Requests</h2>
            <div className="grid gap-4">
              {ownershipRequests.map(({ shop, request }) => (
                <div key={`${shop._id}_${request.userId}`} className="flex items-start justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{shop.name}</div>
                    <div className="text-sm text-gray-500">Requested by: {request.userId}</div>
                    <div className="text-xs text-gray-400 mt-1">Message: {request.message || '—'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async () => { await adminAPI.approveOwnershipRequest(shop._id, { requesterId: request.userId }); toast.success('Ownership approved'); fetchShops(); fetchOwnershipRequests(); }} className="px-3 py-2 bg-green-500 text-white rounded">Approve</button>
                    <button onClick={async () => { const reason = prompt('Reason for rejection:'); if (reason) { await adminAPI.rejectOwnershipRequest(shop._id, { requesterId: request.userId, reason }); toast.success('Rejected'); fetchOwnershipRequests(); } }} className="px-3 py-2 bg-red-500 text-white rounded">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <div key={shop._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                      shop.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      shop.rejectionReason ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {shop.isActive ? 'Active' : shop.rejectionReason ? 'Rejected' : 'Pending Approval'}
                    </span>
                  </div>
                  <Store size={24} className="text-[#FF6B35]" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <MapPin size={16} />
                    {shop.location?.address || 'No location'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <Phone size={16} />
                    {shop.phone || 'No phone'}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {!shop.isActive && !shop.rejectionReason && (
                    <button
                      onClick={() => handleApproveShop(shop._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      <Check size={16} />
                      Approve
                    </button>
                  )}
                  {!shop.isActive && !shop.rejectionReason && (
                    <button
                      onClick={() => handleRejectShop(shop._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  )}
                  {shop.rejectionReason && (
                    <button
                      onClick={() => handleApproveShop(shop._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      <Check size={16} />
                      Re-approve
                    </button>
                  )}
                  {shop.isActive && (
                    <button
                      onClick={() => handleRejectShop(shop._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <X size={16} />
                      Deactivate
                    </button>
                  )}
                  <button
                    onClick={() => window.location.href = `/admin/shops/${shop._id}/offers`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                  >
                    Edit Offers
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShops;
