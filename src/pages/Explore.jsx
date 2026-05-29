import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Filter,
  X,
  Star,
  MapPin,
  Clock,
  DollarSign,
  ChevronDown,
  Grid,
  List,
  Heart,
  Navigation,
  Coffee,
  Utensils,
  IceCream,
  Store,
  Map,
  Award,
  TrendingUp,
  Flame,
  Locate,
  Search
} from 'lucide-react';
import { shopAPI, subscriptionAPI } from '../services/api';
import { resolveImageUrl } from '../utils/media';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('exploreViewMode') || 'grid';
  });
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return localStorage.getItem('selectedLocation') || 'Kolhapur';
  });
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [subscribedShopIds, setSubscribedShopIds] = useState([]);
  const { user } = useAuth();

  // Simplified filters - only essential ones
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    pureVeg: searchParams.get('pureVeg') === 'true',
    minRating: searchParams.get('minRating') || '',
    sortBy: searchParams.get('sortBy') || 'rating',
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const observerRef = useRef();

  // Expanded categories (from image reference)
  const allCategories = [
    { id: 'all', name: 'All', icon: <Flame size={16} /> },
    { id: 'mess', name: 'Mess', icon: <Utensils size={16} /> },
    { id: 'hotel', name: 'Hotel', icon: <Store size={16} /> },
    { id: 'cafe', name: 'Cafe', icon: <Coffee size={16} /> },
    { id: 'dessert', name: 'Dessert', icon: <IceCream size={16} /> },
    { id: 'stall', name: 'Stall', icon: <Map size={16} /> },
    { id: 'healthy', name: 'Healthy', icon: <Heart size={16} /> },
    { id: 'fastfood', name: 'Fast Food', icon: <TrendingUp size={16} /> },
  ];

  const fetchShops = useCallback(async (reset = true) => {
    if (reset) { 
      setLoading(true); 
      setShops([]); 
    }
    try {
      const params = {
        page: reset ? 1 : pagination.page + 1,
        limit: 20,
        ...filters,
        ...(location && { lat: location.lat, lng: location.lng }),
      };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) delete params[key];
      });
      const response = await shopAPI.getExploreShops(params);
      if (reset) {
        setShops(response.data.shops || []);
        setPagination(response.data.pagination || { page: 1, total: 0, pages: 1 });
      } else {
        setShops(prev => [...prev, ...(response.data.shops || [])]);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, location, pagination.page]);

  const loadMoreShops = useCallback(() => {
    if (pagination.page < pagination.pages && !loadingMore && !loading) {
      setLoadingMore(true);
      fetchShops(false);
    }
  }, [pagination.page, pagination.pages, loadingMore, loading, fetchShops]);

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          setLocation(userLocation);
          localStorage.setItem('userLocation', JSON.stringify(userLocation));
          setLocationPermission(true);
        },
        () => {
          setLocationPermission(false);
          const savedLocation = localStorage.getItem('userLocation');
          if (savedLocation) {
            try {
              const parsed = JSON.parse(savedLocation);
              if (parsed?.lat && parsed?.lng) {
                setLocation(parsed);
              }
            } catch (error) {
              console.error('Error parsing saved location:', error);
            }
          }
        }
      );
    } else {
      setLocationPermission(false);
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          if (parsed?.lat && parsed?.lng) {
            setLocation(parsed);
          }
        } catch (error) {
          console.error('Error parsing saved location:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        if (parsed?.lat && parsed?.lng) {
          setLocation(parsed);
          setLocationPermission(true);
        } else {
          getLocation();
        }
      } catch (error) {
        getLocation();
      }
    } else {
      getLocation();
    }
  }, [getLocation]);

  useEffect(() => {
    if (user?.role === 'customer') {
      fetchSubscribedShopIds();
    } else {
      setSubscribedShopIds([]);
    }
  }, [user]);

  const fetchSubscribedShopIds = async () => {
    try {
      const response = await subscriptionAPI.getMySubscriptions();
      const activeShopIds = response.data.subscriptions
        ?.filter((sub) => sub.isActive && sub.shopId?._id)
        .map((sub) => sub.shopId._id) || [];
      setSubscribedShopIds(activeShopIds);
    } catch (error) {
      console.error('Unable to load subscription status:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('exploreViewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.pureVeg) params.set('pureVeg', 'true');
    if (filters.minRating) params.set('minRating', filters.minRating);
    if (filters.sortBy !== 'rating') params.set('sortBy', filters.sortBy);
    setSearchParams(params, { replace: true });

    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.pureVeg) count++;
    if (filters.minRating) count++;
    setActiveFilterCount(count);

    fetchShops();
  }, [filters, fetchShops, setSearchParams]);

  useEffect(() => {
    if (location) {
      fetchShops();
    }
  }, [location, fetchShops]);

  const handleLocationSelect = (locationName) => {
    setSelectedLocation(locationName);
    localStorage.setItem('selectedLocation', locationName);
    setShowLocationDropdown(false);
    
    // If "Current Location" is selected, try to get real location
    if (locationName === 'Current Location') {
      getLocation();
    } else {
      // For other locations, you could set predefined coordinates
      // For now, we'll just update the display
      setLocation(null); // Clear GPS location when selecting named location
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          setLocation(userLocation);
          localStorage.setItem('userLocation', JSON.stringify(userLocation));
          setLocationPermission(true);
          setSelectedLocation('Current Location');
          localStorage.setItem('selectedLocation', 'Current Location');
          toast.success('Location updated successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please check permissions.');
          setLocationPermission(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.location-dropdown')) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categoryConfig = {
    mess: { icon: <Utensils size={18} />, name: 'Mess' },
    hotel: { icon: <Store size={18} />, name: 'Hotel' },
    cafe: { icon: <Coffee size={18} />, name: 'Cafe' },
    dessert: { icon: <IceCream size={18} />, name: 'Dessert' },
    stall: { icon: <Map size={18} />, name: 'Stall' },
  };

  const lastShopRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.page < pagination.pages) {
        loadMoreShops();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, loadingMore, pagination, loadMoreShops]);

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
    toast.success('Filters applied');
  };

  const clearFilters = () => {
    const resetFilters = {
      category: 'all',
      pureVeg: false,
      minRating: '',
      sortBy: 'rating',
    };
    setFilters(resetFilters);
    setTempFilters(resetFilters);
    setSearchQuery('');
    toast.success('All filters cleared');
  };

  const sortOptions = [
    { value: 'rating', label: 'Top Rated', icon: Star },
    { value: 'distance', label: 'Nearest', icon: Navigation },
    { value: 'popularity', label: 'Most Popular', icon: Flame },
    { value: 'newest', label: 'Newly Added', icon: TrendingUp },
  ];

  const formatDistance = (distance) => {
    if (!distance) return null;
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const getOpenStatus = (timings) => {
    if (!timings) return { text: 'Closed', color: 'bg-red-100 text-red-600' };
    const now = new Date();
    const currentHour = now.getHours();
    const [openHour, openMinute] = (timings.open || '09:00').split(':').map(Number);
    const [closeHour, closeMinute] = (timings.close || '22:00').split(':').map(Number);
    const currentTime = currentHour + now.getMinutes() / 60;
    const openTime = openHour + openMinute / 60;
    const closeTime = closeHour + closeMinute / 60;
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    return {
      text: isOpen ? 'Open Now' : 'Closed',
      color: isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600',
    };
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'mess', name: 'Mess' },
    { id: 'hotel', name: 'Hotel' },
    { id: 'cafe', name: 'Cafe' },
    { id: 'dessert', name: 'Dessert' },
    { id: 'stall', name: 'Stall' },
  ];

  const ShopCard = ({ shop, index }) => {
    const openStatus = getOpenStatus(shop.timings);
    const [isWishlisted, setIsWishlisted] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.3) }}
        whileHover={{ y: -4 }}
        ref={index === shops.length - 1 ? lastShopRef : null}
        className="group"
      >
        <Link to={`/shop/${shop.category}/${shop._id}`}>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
            {/* Image Section */}
            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={resolveImageUrl(
                  shop.exploreImage ||
                  shop.coverImage ||
                  shop.images?.[0]?.url ||
                  shop.images?.[0] ||
                  shop.gallery?.[0]?.url ||
                  shop.gallery?.[0] ||
                  shop.logo
                ) || `https://placehold.co/400x300/f3f4f6/9ca3af?text=${encodeURIComponent(shop.name)}`}
                alt={shop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                onError={(e) => e.target.src = `https://placehold.co/400x300/f3f4f6/9ca3af?text=${encodeURIComponent(shop.name)}`}
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-1">
                {shop.pureVeg && (
                  <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-md">
                    Pure Veg
                  </span>
                )}
                {shop.rating >= 4.5 && (
                  <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-md flex items-center gap-0.5">
                    <Award size={10} /> Top Rated
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button 
                onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); toast.success(isWishlisted ? 'Removed' : 'Saved'); }} 
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-md"
              >
                <Heart size={14} className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'} />
              </button>
              
              {/* Category Badge */}
              <div className="absolute bottom-3 left-3">
                <span className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize shadow-md flex items-center gap-1.5">
                  {categoryConfig[shop.category]?.icon}
                  {shop.category}
                </span>
              </div>
              
              {/* Open Status */}
              <div className={`absolute bottom-3 right-3 ${openStatus.color} px-2 py-0.5 rounded-full text-[10px] font-medium shadow-md`}>
                {openStatus.text}
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-4">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="font-semibold text-base text-gray-900 line-clamp-1 flex-1">
                  {shop.name}
                </h3>
                <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-lg">
                  <Star size={10} className="text-amber-500 fill-amber-500" />
                  <span className="font-medium text-xs">{shop.rating?.toFixed(1) || 'New'}</span>
                </div>
              </div>
                {subscribedShopIds.includes(shop._id) && (
                  <div className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mb-2">
                    <span className="w-2 h-2 bg-green-700 rounded-full"></span>
                    Subscribed
                  </div>
                )}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-xs bg-gray-100 px-2 py-1 rounded-full">
                  <DollarSign size={10} className="text-gray-500" />
                  <span className="font-medium">₹{shop.costForTwo || 300}</span>
                  <span className="text-gray-400">for two</span>
                </div>
                {shop.homeDelivery && (
                  <div className="flex items-center gap-0.5 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Free Delivery
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      
      {/* Location Selector Section */}
      <div className="bg-white border-b border-gray-100 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative location-dropdown">
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
                >
                  <Locate size={16} className="text-[#FF6B35]" />
                  <span className="text-sm font-medium">{selectedLocation}</span>
                  <ChevronDown size={14} className={`transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Location Dropdown */}
                <AnimatePresence>
                  {showLocationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-48"
                    >
                      <div className="py-2">
                        <button
                          onClick={() => handleLocationSelect('Kolhapur')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                        >
                          Kolhapur
                        </button>
                        <button
                          onClick={() => handleLocationSelect('Pune')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                        >
                          Pune
                        </button>
                        <button
                          onClick={() => handleLocationSelect('Mumbai')}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                        >
                          Mumbai
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={getCurrentLocation}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm flex items-center gap-2"
                        >
                          <Navigation size={14} />
                          Use Current Location
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {locationPermission && location && (
                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Location Active</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              {shops.length} shops available
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section - Horizontal Scroll like image */}
      <div className="bg-white border-b border-gray-100 py-4 sticky top-[73px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Top Categories</h2>
              <p className="text-xs text-gray-500">This is the top picked foods for you</p>
            </div>
          </div>
          
          {/* Horizontal Scroll Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilters({ ...filters, category: cat.id })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition shrink-0 ${
                  filters.category === cat.id
                    ? 'bg-[#FF6B35] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort & Filter Bar */}
      <div className="bg-white border-b border-gray-100 py-3 sticky top-[145px] z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg appearance-none cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              {locationPermission && location && (
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1.5 rounded-lg">
                  <Navigation size={12} />
                  <span>Nearby</span>
                </div>
              )}
              
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs transition relative"
              >
                <Filter size={12} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B35] text-white text-[9px] rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}>
                  <Grid size={14} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}>
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-100">
              {filters.category !== 'all' && (
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                  {categoryConfig[filters.category]?.icon} {categoryConfig[filters.category]?.name}
                  <button onClick={() => setFilters({ ...filters, category: 'all' })}><X size={10} /></button>
                </span>
              )}
              {filters.pureVeg && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px]">🌱 Pure Veg <button onClick={() => setFilters({ ...filters, pureVeg: false })}><X size={10} /></button></span>
              )}
              {filters.minRating && (
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px]">⭐ {filters.minRating}+ <button onClick={() => setFilters({ ...filters, minRating: '' })}><X size={10} /></button></span>
              )}
              <button onClick={clearFilters} className="text-gray-400 text-[10px] hover:text-gray-600">Clear</button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!loading && shops.length > 0 && (
          <p className="text-xs text-gray-500 mb-4">{pagination.total} places found</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse">
                <div className="h-36 bg-gray-100 rounded-t-2xl"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No shops found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
            <button onClick={clearFilters} className="mt-4 text-[#FF6B35] text-sm font-medium">Clear filters</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {shops.map((shop, index) => <ShopCard key={shop._id} shop={shop} index={index} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {shops.map((shop) => (
              <div key={shop._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <Link to={`/shop/${shop.category}/${shop._id}`} className="flex gap-4">
                  <img src={resolveImageUrl(
                    shop.exploreImage ||
                    shop.coverImage ||
                    shop.images?.[0]?.url ||
                    shop.images?.[0] ||
                    shop.gallery?.[0]?.url ||
                    shop.gallery?.[0] ||
                    shop.logo
                  ) || "https://placehold.co/100x100/f3f4f6/9ca3af"} alt={shop.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-base">{shop.name}</h3>
                      <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs">{shop.rating?.toFixed(1) || 'New'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{shop.location?.area}, {shop.location?.city}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-medium text-gray-700">₹{shop.costForTwo || 300}</span>
                      <span className="text-xs text-gray-400">for two</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {loadingMore && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {!loading && !loadingMore && shops.length > 0 && pagination.page >= pagination.pages && (
          <div className="text-center py-8 text-gray-400 text-sm">
            You've explored all {pagination.total} places
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filter Shops</h2>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-6 pb-24">
                {/* Category */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Category</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setTempFilters({ ...tempFilters, category: cat.id })}
                        className={`px-3 py-2 rounded-lg text-sm transition ${
                          tempFilters.category === cat.id
                            ? 'bg-[#FF6B35] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pure Veg */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Dietary Preference</h3>
                  <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={tempFilters.pureVeg}
                      onChange={(e) => setTempFilters({ ...tempFilters, pureVeg: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-[#FF6B35]"
                    />
                    <span className="text-sm">Pure Vegetarian Only</span>
                  </label>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-medium text-sm mb-3">Minimum Rating</h3>
                  <div className="flex gap-2">
                    {['', '3.5', '4.0', '4.5'].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setTempFilters({ ...tempFilters, minRating: rating })}
                        className={`flex-1 py-2 rounded-lg text-sm transition ${
                          tempFilters.minRating === rating
                            ? 'bg-[#FF6B35] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {rating ? `${rating}+ ★` : 'Any'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3 max-w-md mx-auto w-full">
                <button onClick={clearFilters} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">
                  Clear All
                </button>
                <button onClick={applyFilters} className="flex-1 bg-[#FF6B35] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#e55a2b]">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Explore;