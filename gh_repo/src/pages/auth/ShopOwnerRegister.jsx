import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { 
  Store, User, Mail, Phone, Lock, Eye, EyeOff, MapPin, 
  Building2, FileText, CreditCard, AlertCircle, CheckCircle2,
  Navigation, Search, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ShopOwnerRegister = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [locationResults, setLocationResults] = useState([]);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Shop Info
    shopName: '',
    shopCategory: 'mess',
    shopDescription: '',
    contactNumber: '',
    
    // Location (CRITICAL - These are required!)
    location: {
      city: '',
      area: '',
      address: '',
      lat: '',
      lng: '',
      pincode: '',
    },
    
    // Business Details
    fssaiLicense: '',
    gstNumber: '',
    
    // Bank Details
    bankAccountNumber: '',
    bankIfsc: '',
    upiId: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'mess', label: 'Mess / Tiffin Service', icon: '🍱' },
    { value: 'hotel', label: 'Hotel / Restaurant', icon: '🏨' },
    { value: 'cafe', label: 'Café / Coffee Shop', icon: '☕' },
    { value: 'dessert', label: 'Dessert / Bakery', icon: '🍰' },
    { value: 'stall', label: 'Food Stall / Kiosk', icon: '🌮' },
  ];

  const cities = ['Pune', 'Mumbai', 'Kolhapur', 'Nashik', 'Nagpur', 'Aurangabad'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setSearchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            
            setFormData({
              ...formData,
              location: {
                ...formData.location,
                lat: latitude.toString(),
                lng: longitude.toString(),
                city: data.address?.city || data.address?.town || data.address?.village || '',
                area: data.address?.suburb || data.address?.neighbourhood || data.address?.hamlet || '',
                address: data.display_name || '',
              }
            });
            toast.success('Location detected successfully!');
          } catch (error) {
            // If reverse geocoding fails, at least set coordinates
            setFormData({
              ...formData,
              location: {
                ...formData.location,
                lat: latitude.toString(),
                lng: longitude.toString(),
              }
            });
            toast.success('Coordinates captured! Please enter address manually.');
          }
          setSearchingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to get location. Please enter manually.');
          setSearchingLocation(false);
        }
      );
    } else {
      toast.error('Geolocation not supported by your browser');
    }
  };

  // Search places by name
  const searchLocation = async (query) => {
    if (!query || query.length < 3) {
      setLocationResults([]);
      return;
    }
    
    setSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setLocationResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchingLocation(false);
    }
  };

  const selectLocation = (place) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        lat: place.lat,
        lng: place.lon,
        city: place.address?.city || place.address?.town || place.address?.village || '',
        area: place.address?.suburb || place.address?.neighbourhood || '',
        address: place.display_name,
      }
    });
    setLocationResults([]);
    toast.success('Location selected!');
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Owner name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.shopName) newErrors.shopName = 'Shop name is required';
    if (!formData.location.address) newErrors['location.address'] = 'Shop address is required';
    if (!formData.location.city) newErrors['location.city'] = 'City is required';
    if (!formData.location.area) newErrors['location.area'] = 'Area/Locality is required';
    if (!formData.location.lat) newErrors['location.lat'] = 'Please select location on map';
    if (!formData.location.lng) newErrors['location.lng'] = 'Please select location on map';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setLoading(true);
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        shopName: formData.shopName,
        shopCategory: formData.shopCategory,
        shopDescription: formData.shopDescription,
        shopAddress: formData.location.address,
        shopCity: formData.location.city,
        shopArea: formData.location.area,
        shopLat: parseFloat(formData.location.lat),
        shopLng: parseFloat(formData.location.lng),
        contactNumber: formData.contactNumber || formData.phone,
        fssaiLicense: formData.fssaiLicense,
        bankDetails: {
          accountNumber: formData.bankAccountNumber,
          ifscCode: formData.bankIfsc,
          upiId: formData.upiId,
        }
      };
      
      const response = await authAPI.shopOwnerRegister(registrationData);
      
      if (response.data.success) {
        toast.success('Registration submitted! Awaiting admin approval.', { duration: 5000 });
        navigate('/login/shopowner');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const cityCoordinates = {
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Kolhapur': { lat: 16.7050, lng: 73.7421 },
    'Nashik': { lat: 19.9975, lng: 73.7898 },
    'Nagpur': { lat: 21.1458, lng: 79.0882 },
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    const coords = cityCoordinates[city] || { lat: 18.5204, lng: 73.8567 };
    setFormData({
      ...formData,
      shopCity: city,
      shopLat: coords.lat,
      shopLng: coords.lng,
    });
    if (errors.shopCity) {
      setErrors({ ...errors, shopCity: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C2185B]/5 to-[#FF2E4C]/5 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-[#C2185B] rounded-2xl flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Register Your Shop</h2>
          <p className="mt-2 text-gray-600">Join Mahii and reach more students</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-[#C2185B] text-white' : 'bg-gray-200 text-gray-500'
            }`}>1</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#C2185B]' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-[#C2185B] text-white' : 'bg-gray-200 text-gray-500'
            }`}>2</div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shop & Location Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Building2 size={20} className="text-[#C2185B]" />
                  Shop Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Owner Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C2185B] ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Shop Name *</label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C2185B] ${errors.shopName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Student's Delight Mess"
                    />
                    {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C2185B] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="contact@yourbusiness.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C2185B] ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="9876543210"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    name="shopCategory"
                    value={formData.shopCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B]"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Shop Description</label>
                  <textarea
                    name="shopDescription"
                    rows="3"
                    value={formData.shopDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B]"
                    placeholder="Describe your shop, specialities, facilities..."
                  />
                </div>

                {/* LOCATION SECTION - CRITICAL */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <MapPin size={20} className="text-[#C2185B]" />
                    Shop Location (Required)
                  </h3>
                  
                  {/* Location Search */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Search Location</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search for your shop location..."
                        onChange={(e) => searchLocation(e.target.value)}
                        className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B]"
                      />
                    </div>
                    {locationResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {locationResults.map((place, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectLocation(place)}
                            className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                          >
                            <p className="text-sm font-medium">{place.display_name}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Get Current Location Button */}
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={searchingLocation}
                    className="mb-4 text-sm text-[#C2185B] flex items-center gap-2 hover:underline disabled:opacity-50"
                  >
                    <Navigation size={16} />
                    {searchingLocation ? 'Detecting location...' : 'Use my current location'}
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <select
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C2185B] ${errors['location.city'] ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {errors['location.city'] && <p className="text-red-500 text-xs mt-1">{errors['location.city']}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Area / Locality *</label>
                      <input
                        type="text"
                        name="location.area"
                        value={formData.location.area}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C2185B] ${errors['location.area'] ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Shivaji Nagar, FC Road, etc."
                      />
                      {errors['location.area'] && <p className="text-red-500 text-xs mt-1">{errors['location.area']}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Complete Address *</label>
                    <textarea
                      name="location.address"
                      rows="2"
                      value={formData.location.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C2185B] ${errors['location.address'] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Building name, street number, landmark..."
                    />
                    {errors['location.address'] && <p className="text-red-500 text-xs mt-1">{errors['location.address']}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode</label>
                      <input
                        type="text"
                        name="location.pincode"
                        value={formData.location.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B]"
                        placeholder="411001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Number (Shop)</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B]"
                        placeholder="Same as owner or different"
                      />
                    </div>
                  </div>

                  {/* Hidden coordinates fields */}
                  <input type="hidden" name="location.lat" value={formData.location.lat} />
                  <input type="hidden" name="location.lng" value={formData.location.lng} />
                  
                  {errors['location.lat'] && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors['location.lat']}
                    </p>
                  )}

                  {/* Map Preview */}
                  {formData.location.lat && formData.location.lng && (
                    <div className="mt-4">
                      <p className="text-sm text-green-600 mb-2 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Location selected successfully!
                      </p>
                      <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${formData.location.lng-0.01},${formData.location.lat-0.01},${formData.location.lng+0.01},${formData.location.lat+0.01}&layer=mapnik&marker=${formData.location.lat},${formData.location.lng}`}
                          title="Location Preview"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#C2185B] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#E5093F] transition"
                  >
                    Next: Account Setup →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Account & Verification */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText size={20} className="text-[#C2185B]" />
                  Account & Verification
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-2">FSSAI License Number (Optional)</label>
                  <input
                    type="text"
                    name="fssaiLicense"
                    value={formData.fssaiLicense}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B]"
                    placeholder="FSSAI License Number"
                  />
                  <p className="text-xs text-gray-500 mt-1">You can upload the document later</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">GST Number (Optional)</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B]"
                    placeholder="GSTIN"
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <CreditCard size={18} className="text-[#C2185B]" />
                    Bank Details for Payouts
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Number</label>
                      <input
                        type="text"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B]"
                        placeholder="XXXXXXXXXXXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">IFSC Code</label>
                      <input
                        type="text"
                        name="bankIfsc"
                        value={formData.bankIfsc}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B]"
                        placeholder="SBIN0001234"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">UPI ID (Optional)</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B]"
                      placeholder="shopname@okhdfcbank"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Create Account Password</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C2185B] ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#C2185B] ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-[#C2185B] mt-2"
                  >
                    {showPassword ? 'Hide' : 'Show'} Password
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#C2185B] text-white py-3 rounded-xl font-semibold hover:bg-[#E5093F] transition disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login/shopowner" className="text-[#C2185B] font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ShopOwnerRegister;