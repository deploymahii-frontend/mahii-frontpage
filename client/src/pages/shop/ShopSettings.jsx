import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI } from '../../services/api';
import { Store, Clock, CreditCard, Bell, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';

const ShopSettings = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: { street: '', city: '', state: '', pincode: '' },
    phone: '',
    email: '',
    openingHours: {
      monday: { open: '08:00', close: '22:00', isOpen: true },
      tuesday: { open: '08:00', close: '22:00', isOpen: true },
      wednesday: { open: '08:00', close: '22:00', isOpen: true },
      thursday: { open: '08:00', close: '22:00', isOpen: true },
      friday: { open: '08:00', close: '22:00', isOpen: true },
      saturday: { open: '08:00', close: '22:00', isOpen: true },
      sunday: { open: '08:00', close: '22:00', isOpen: true },
    },
    paymentMethods: { cash: true, card: true, upi: true, wallet: false },
    notifications: { newOrders: true, orderUpdates: true, lowStock: false, reviews: true },
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const shopsRes = await shopAPI.getMyShops();
        const userShop = shopsRes.data.shops?.[0];
        if (userShop) {
          setShop(userShop);
          setFormData((prev) => ({
            ...prev,
            ...userShop,
            address: userShop.address || prev.address,
            openingHours: userShop.openingHours || prev.openingHours,
            paymentMethods: userShop.paymentMethods || prev.paymentMethods,
            notifications: userShop.notifications || prev.notifications,
          }));
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        toast.error('Failed to load shop settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!shop) return;
    setSaving(true);
    try {
      await shopAPI.submitEditForApproval(shop._id, formData);
      toast.success('Changes submitted for approval');
    } catch (error) {
      toast.error('Failed to submit changes for approval');
    } finally {
      setSaving(false);
    }
  };

  const updateOpeningHours = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [field]: value },
      },
    }));
  };

  const updatePaymentMethod = (method, enabled) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: { ...prev.paymentMethods, [method]: enabled },
    }));
  };

  const updateNotification = (type, enabled) => {
    setFormData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: enabled },
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'hours', label: 'Hours', icon: Clock },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (loading) {
    return (
      <ShopLayout>
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Settings</h1>
          <p className="text-gray-500">Manage your shop information and preferences</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                    activeTab === tab.id
                      ? 'text-[#FF6B35] border-b-2 border-[#FF6B35]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Shop Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800 resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'hours' && (
              <div className="space-y-4">
                {Object.entries(formData.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex flex-wrap items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-24 capitalize font-medium">{day}</div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hours.isOpen}
                        onChange={(e) => updateOpeningHours(day, 'isOpen', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Open</span>
                    </label>
                    {hours.isOpen && (
                      <>
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateOpeningHours(day, 'open', e.target.value)}
                          className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateOpeningHours(day, 'close', e.target.value)}
                          className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(formData.paymentMethods).map(([method, enabled]) => (
                    <label key={method} className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updatePaymentMethod(method, e.target.checked)}
                        className="rounded"
                      />
                      <span className="capitalize font-medium">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(formData.notifications).map(([type, enabled]) => (
                    <label key={type} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div>
                        <div className="font-medium capitalize">{type.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="text-sm text-gray-500">{type === 'newOrders' ? 'Get notified when new orders are placed' : type === 'orderUpdates' ? 'Receive updates on order status changes' : type === 'lowStock' ? 'Alert when menu items are running low' : 'Notifications for new customer reviews'}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateNotification(type, e.target.checked)}
                        className="rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#e55a2b] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={18} />
              )}
              Submit for Approval
            </button>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default ShopSettings;
