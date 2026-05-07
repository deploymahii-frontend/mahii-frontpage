import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI } from '../../services/api';
import {
  Store,
  MapPin,
  Phone,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ShopSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [existingShop, setExistingShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shopData, setShopData] = useState({
    name: '',
    category: 'mess',
    description: '',
    address: '',
    area: '',
    city: 'Bangalore',
    phone: '',
    openingTime: '09:00',
    closingTime: '22:00',
    isOpen: true,
  });
  const [locationCoords, setLocationCoords] = useState({
    lat: null,
    lng: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchExistingShop();
  }, []);

  const fetchExistingShop = async () => {
    try {
      const response = await shopAPI.getMyShops();
      if (response.data.shops && response.data.shops.length > 0) {
        setExistingShop(response.data.shops[0]);
        setShopData(response.data.shops[0]);
        setStep(2);
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add function to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success('Location detected!');
        },
        (error) => {
          toast.error('Unable to get location. Please enter manually.');
          // Set default coordinates for the city
          const defaultCoords = {
            'Bangalore': { lat: 12.9716, lng: 77.5946 },
            'Mumbai': { lat: 19.0760, lng: 72.8777 },
            'Pune': { lat: 18.5204, lng: 73.8567 },
            'Delhi': { lat: 28.6139, lng: 77.2090 }
          };
          setLocationCoords(defaultCoords[shopData.city] || defaultCoords['Bangalore']);
        }
      );
    }
  };

  const categories = [
    { value: 'mess', label: 'Mess / Tiffin Service', icon: '🍱' },
    { value: 'hotel', label: 'Hotel / Restaurant', icon: '🏨' },
    { value: 'cafe', label: 'Café / Coffee Shop', icon: '☕' },
    { value: 'dessert', label: 'Dessert / Bakery', icon: '🍰' },
    { value: 'stall', label: 'Food Stall / Kiosk', icon: '🌮' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShopData({
      ...shopData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!shopData.name) newErrors.name = 'Shop name is required';
    if (!shopData.address) newErrors.address = 'Address is required';
    if (!shopData.area) newErrors.area = 'Area is required';
    if (!shopData.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const shopPayload = {
        ...shopData,
        location: {
          address: shopData.address,
          area: shopData.area,
          city: shopData.city,
          lat: locationCoords.lat || 18.5204,  // Default to Pune if not set
          lng: locationCoords.lng || 73.8567,
        },
        contactNumber: shopData.phone,
        timings: {
          open: shopData.openingTime,
          close: shopData.closingTime,
        },
      };
      
      if (existingShop) {
        await shopAPI.updateShop(existingShop._id, shopPayload);
        toast.success('Shop updated successfully!');
      } else {
        await shopAPI.createShop(shopPayload);
        toast.success('Shop created successfully!');
      }
      setTimeout(() => navigate('/shop/dashboard'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save shop');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMakeVisible = async () => {
    try {
      await shopAPI.updateShop(existingShop._id, { isActive: true, isVisible: true });
      setShopData({ ...shopData, isActive: true, isVisible: true });
      setExistingShop({ ...existingShop, isActive: true, isVisible: true });
      toast.success('Shop is now visible on Explore page!');
    } catch (error) {
      toast.error('Failed to make shop visible');
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const newStatus = !shopData.isVisible;
      await shopAPI.updateShop(existingShop._id, { isVisible: newStatus });
      setShopData({ ...shopData, isVisible: newStatus });
      setExistingShop({ ...existingShop, isVisible: newStatus });
      toast.success(`Shop is now ${newStatus ? 'visible' : 'hidden'}!`);
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto bg-pink-100 rounded-2xl flex items-center justify-center mb-4"
          >
            <Store className="w-8 h-8 text-pink-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {existingShop ? 'Manage Your Shop' : 'Setup Your Shop'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {existingShop ? 'Update your shop details and make it visible to customers' : 'Tell us about your shop'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-8">
            <div
              className={`flex flex-col items-center ${
                step >= 1 ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  step >= 1
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                1
              </div>
              <p className="text-sm mt-2 font-medium">Shop Details</p>
            </div>

            <div className={`w-12 h-1 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-200'}`} />

            <div
              className={`flex flex-col items-center ${
                step >= 2 ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  step >= 2
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
              <p className="text-sm mt-2 font-medium">Visibility</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          {step === 1 ? (
            <form className="space-y-6">
              {/* Shop Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={shopData.name}
                  onChange={handleChange}
                  placeholder="e.g., Gopal's Mess"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        setShopData({ ...shopData, category: cat.value })
                      }
                      className={`p-3 rounded-lg border-2 transition ${
                        shopData.category === cat.value
                          ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/30'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs font-medium">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={shopData.description}
                  onChange={handleChange}
                  placeholder="Tell customers about your shop..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                ></textarea>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="inline mr-1" size={16} />
                  Address *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="address"
                    value={shopData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    📍 Get Location
                  </button>
                </div>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* Area & City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Area *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={shopData.area}
                    onChange={handleChange}
                    placeholder="e.g., Koregaon Park"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {errors.area && (
                    <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={shopData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="inline mr-1" size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shopData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Opening Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="inline mr-1" size={16} />
                    Opening Time
                  </label>
                  <input
                    type="time"
                    name="openingTime"
                    value={shopData.openingTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    name="closingTime"
                    value={shopData.closingTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition flex items-center justify-center gap-2"
              >
                Next Step
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Shop Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Shop Preview
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-300">
                    <Store className="inline mr-2" size={18} />
                    <strong>{shopData.name}</strong> ({shopData.category})
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <MapPin className="inline mr-2" size={18} />
                    {shopData.area}, {shopData.city}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <Phone className="inline mr-2" size={18} />
                    {shopData.phone}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <Clock className="inline mr-2" size={18} />
                    {shopData.openingTime} - {shopData.closingTime}
                  </p>
                </div>
              </div>

              {/* Visibility Status */}
              <div className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <AlertCircle size={20} className="text-yellow-600" />
                  Make Your Shop Visible
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Once you submit, your shop will be reviewed by our admin team. After approval, it will be visible on the Explore page and customers can order from you.
                </p>
                {shopData.isVisible ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Shop is visible on Explore page</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <EyeOff size={20} />
                    <span>Shop will be visible after admin approval</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : existingShop ? 'Update Shop' : 'Create Shop'}
                </button>
              </div>

              {shopData.isVisible && (
                <button
                  type="button"
                  onClick={handleToggleVisibility}
                  className="w-full border-2 border-red-300 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition"
                >
                  Hide Shop from Explore
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ShopSetup;
