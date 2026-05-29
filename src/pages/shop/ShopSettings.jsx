import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI } from '../../services/api';
import { resolveImageUrl } from '../../utils/media';
import { Store, Clock, CreditCard, Bell, Save, Send, CalendarDays, ImagePlus, UploadCloud, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';

const ShopSettings = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [searchParams] = useSearchParams();

  const defaultWeeklyMenu = [
    { day: 'Monday', breakfast: '', lunch: '', dinner: '' },
    { day: 'Tuesday', breakfast: '', lunch: '', dinner: '' },
    { day: 'Wednesday', breakfast: '', lunch: '', dinner: '' },
    { day: 'Thursday', breakfast: '', lunch: '', dinner: '' },
    { day: 'Friday', breakfast: '', lunch: '', dinner: '' },
    { day: 'Saturday', breakfast: '', lunch: '', dinner: '' },
    { day: 'Sunday', breakfast: '', lunch: '', dinner: '' },
  ];

  const normalizeWeeklyMenu = (menu) => {
    if (!Array.isArray(menu) || menu.length === 0) return defaultWeeklyMenu;
    return defaultWeeklyMenu.map((defaultDay) => {
      const savedDay = menu.find((item) => item.day === defaultDay.day);
      return savedDay ? { ...defaultDay, ...savedDay } : defaultDay;
    });
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fontFamily: 'Poppins, sans-serif',
    location: { address: '', area: '', city: '', lat: null, lng: null },
    phone: '',
    email: '',
    logo: '',
    coverImage: '',
    qrCodeData: '',
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
    weeklyMenu: defaultWeeklyMenu,
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
            location: userShop.location || prev.location,
            openingHours: userShop.openingHours || prev.openingHours,
            paymentMethods: userShop.paymentMethods || prev.paymentMethods,
            notifications: userShop.notifications || prev.notifications,
            weeklyMenu: normalizeWeeklyMenu(userShop.weeklyMenu || prev.weeklyMenu),
            logo: userShop.logo || prev.logo,
            coverImage: userShop.coverImage || prev.coverImage,
            qrCodeData: userShop.qrCodeData || prev.qrCodeData,
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
      const response = await shopAPI.updateShop(shop._id, formData);
      setShop(response.data.shop);
      toast.success('Shop settings updated successfully');
    } catch (error) {
      console.error('Settings save failed:', error);
      toast.error('Failed to save shop settings');
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

  const updateWeeklyMenuItem = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      weeklyMenu: prev.weeklyMenu.map((menuItem, idx) =>
        idx === index ? { ...menuItem, [field]: value } : menuItem
      ),
    }));
  };

  const clearWeeklyMenu = () => {
    setFormData((prev) => ({
      ...prev,
      weeklyMenu: prev.weeklyMenu.map((menuItem) => ({
        ...menuItem,
        breakfast: '',
        lunch: '',
        dinner: '',
      })),
    }));
  };

  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  const handleLogoUpload = async (file) => {
    if (!file) return;
    console.log('handleLogoUpload file:', file);
    setLogoUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      console.log('handleLogoUpload formData file:', data.get('file'));
      const response = await shopAPI.uploadLogo(data);
      setFormData((prev) => ({ ...prev, logo: response.data.logo }));
      toast.success('Logo uploaded');
    } catch (error) {
      console.error('Logo upload failed:', error);
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleCoverUpload = async (file) => {
    if (!file) return;
    console.log('handleCoverUpload file:', file);
    setCoverUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      console.log('handleCoverUpload formData file:', data.get('file'));
      const response = await shopAPI.uploadCover(data);
      setFormData((prev) => ({ ...prev, coverImage: response.data.coverImage }));
      toast.success('Cover image uploaded');
    } catch (error) {
      console.error('Cover upload failed:', error);
      toast.error(error.response?.data?.message || 'Failed to upload cover image');
    } finally {
      setCoverUploading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'media', label: 'Media', icon: ImagePlus },
    { id: 'hours', label: 'Hours', icon: Clock },
    { id: 'weeklyMenu', label: 'Weekly Menu', icon: CalendarDays },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabs.some((tab) => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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
                  <label className="block text-sm font-medium mb-2">Area / Locality</label>
                  <input
                    type="text"
                    value={formData.location.area}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, area: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Full Address</label>
                  <input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Shop Font (Preview)</label>
                  <div className="flex gap-3 items-center">
                    <select
                      value={formData.fontFamily}
                      onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800"
                    >
                      <option value={"Poppins, sans-serif"}>Poppins (Default)</option>
                      <option value={"Inter, sans-serif"}>Inter</option>
                      <option value={"Roboto, sans-serif"}>Roboto</option>
                      <option value={"Merriweather, serif"}>Merriweather</option>
                      <option value={"Lora, serif"}>Lora</option>
                    </select>
                    <div className="px-3 py-2 rounded border border-gray-200 bg-white" style={{ fontFamily: formData.fontFamily }}>
                      Aa Bb Cc
                    </div>
                  </div>
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

            {activeTab === 'weeklyMenu' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Menu</h2>
                    <p className="mt-2 text-sm text-gray-500">Update your shop’s daily meals for the week. Clear old entries and add fresh breakfast, lunch, and dinner items.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={clearWeeklyMenu}
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-lg bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e55a2b] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">Day</th>
                        <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">Breakfast</th>
                        <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">Lunch</th>
                        <th className="p-4 text-left font-medium text-gray-700 dark:text-gray-300">Dinner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.weeklyMenu.map((item, index) => (
                        <tr key={item.day} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{item.day}</td>
                          <td className="p-4">
                            <input
                              type="text"
                              value={item.breakfast}
                              placeholder="Breakfast item"
                              onChange={(e) => updateWeeklyMenuItem(index, 'breakfast', e.target.value)}
                              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                            />
                          </td>
                          <td className="p-4">
                            <input
                              type="text"
                              value={item.lunch}
                              placeholder="Lunch item"
                              onChange={(e) => updateWeeklyMenuItem(index, 'lunch', e.target.value)}
                              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                            />
                          </td>
                          <td className="p-4">
                            <input
                              type="text"
                              value={item.dinner}
                              placeholder="Dinner item"
                              onChange={(e) => updateWeeklyMenuItem(index, 'dinner', e.target.value)}
                              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Store Logo</label>
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        {formData.logo ? (
                          <img src={resolveImageUrl(formData.logo)} alt="Shop Logo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400"><ImagePlus size={24} /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          <label htmlFor="logo-file-input" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg">
                            <UploadCloud size={16} />
                            <span>{logoUploading ? 'Uploading...' : 'Upload Logo'}</span>
                          </label>
                          <input
                            id="logo-file-input"
                            name="file"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                          />
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-2 text-xs text-gray-600">Current: {formData.logo ? 'Set' : 'Not set'}</span>
                        </div>
                        {formData.logo ? (
                          <p className="text-xs text-gray-500 mt-2">Logo saved in the shop profile and persisted in the database.</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-2">Upload your logo to make it visible in the shop profile.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Cover Image</label>
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        {formData.coverImage ? (
                          <img src={resolveImageUrl(formData.coverImage)} alt="Shop Cover" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400"><ImagePlus size={24} /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          <label htmlFor="cover-file-input" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg">
                            <UploadCloud size={16} />
                            <span>{coverUploading ? 'Uploading...' : 'Upload Cover'}</span>
                          </label>
                          <input
                            id="cover-file-input"
                            name="file"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                          />
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-2 text-xs text-gray-600">Current: {formData.coverImage ? 'Set' : 'Not set'}</span>
                        </div>
                        {formData.coverImage ? (
                          <p className="text-xs text-gray-500 mt-2">Cover image saved and available in the shop profile.</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-2">Upload your cover image to improve your shop page appearance.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Shop QR Code Data</label>
                  <input
                    type="text"
                    value={formData.qrCodeData}
                    onChange={(e) => setFormData({ ...formData, qrCodeData: e.target.value })}
                    placeholder="https://... or custom identifier"
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-white dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be used to generate the shop QR code on your dashboard.</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(formData.notifications).map(([type, enabled]) => (
                    <label key={type} className="flex items-center justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
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
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default ShopSettings;
