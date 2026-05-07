import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
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
  Award
} from 'lucide-react';
import { shopAPI } from '../services/api';
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

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches] = useState([
    "Mess near me", "Best cafe", "Budget meals", "Pure veg"
  ]);

  const searchDebounceRef = useRef(null);
  const searchInputRef = useRef(null);

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

  useEffect(() => {
    const saved = localStorage.getItem("exploreRecentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("exploreRecentSearches", JSON.stringify(updated));
  };

  const debouncedSearch = useCallback((query) => {
    if (searching) return;
    setSearching(true);
    setTimeout(async () => {
      if (query.length > 1) {
        try {
          const response = await shopAPI.searchShops({ q: query });
          setSearchResults(response.data.shops || []);
        } catch (error) {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
      setSearching(false);
    }, 500);
  }, [searching]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    if (value.length > 1) debouncedSearch(value);
    else setSearchResults([]);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      setShowSuggestions(false);
      fetchShops();
    }
  };

  const handleKeyPress = (e) => e.key === "Enter" && handleSearch();

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    saveRecentSearch(suggestion);
    setShowSuggestions(false);
    fetchShops();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
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

  const fetchShops = useCallback(async (reset = true) => {
    if (reset) { setLoading(true); setShops([]); }
    try {
      const params = {
        page: reset ? 1 : pagination.page + 1,
        limit: 20,
        ...filters,
        search: searchQuery,
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
  }, [filters, location, pagination.page, searchQuery]);

  const loadMoreShops = useCallback(() => {
    if (pagination.page < pagination.pages && !loadingMore && !loading) {
      setLoadingMore(true);
      fetchShops(false);
    }
  }, [pagination.page, pagination.pages, loadingMore, loading, fetchShops]);

  useEffect(() => {
    localStorage.setItem('exploreViewMode', viewMode);
  }, [viewMode]);

  const lastShopRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.page < pagination.pages) loadMoreShops();
    });
    if (node) observerRef.current.observe(node);
  }, [loading, loadingMore, pagination, loadMoreShops]);

  useEffect(() => {
    getLocation();
    fetchShops();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.pureVeg) params.set('pureVeg', 'true');
    if (filters.minRating) params.set('minRating', filters.minRating);
    if (filters.sortBy !== 'rating') params.set('sortBy', filters.sortBy);
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params, { replace: true });

    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.pureVeg) count++;
    if (filters.minRating) count++;
    setActiveFilterCount(count);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => fetchShops(), 500);
    return () => clearTimeout(searchDebounceRef.current);
  }, [filters, searchQuery, setSearchParams, fetchShops]);

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationPermission(true);
          fetchShops();
        },
        () => { setLocationPermission(false); fetchShops(); }
      );
    }
  }, [fetchShops]);

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
      text: isOpen ? 'Open' : 'Closed',
      color: isOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600',
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
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="relative h-36 overflow-hidden bg-gray-100">
              <img
                src={shop.coverImage || `https://placehold.co/400x300/f3f4f6/9ca3af?text=${encodeURIComponent(shop.name)}`}
                alt={shop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                onError={(e) => e.target.src = `https://placehold.co/400x300/f3f4f6/9ca3af?text=${encodeURIComponent(shop.name)}`}
              />

              <div className="absolute top-2 left-2 flex gap-1">
                {shop.pureVeg && <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">Pure Veg</span>}
                {shop.rating >= 4.5 && <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">Top</span>}
              </div>

              <button onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); toast.success(isWishlisted ? 'Removed' : 'Saved'); }} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                <Heart size={14} className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-500'} />
              </button>

              <div className="absolute bottom-2 left-2">
                <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium capitalize shadow-sm flex items-center gap-1">
                  {categoryConfig[shop.category]?.icon}
                  {shop.category}
                </span>
              </div>

              <div className={`absolute bottom-2 right-2 ${openStatus.color} px-1.5 py-0.5 rounded-full text-[10px] font-medium shadow-sm`}>
                {openStatus.text}
              </div>
            </div>

            <div className="p-3">
              <div className="flex justify-between items-start gap-1 mb-1">
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 flex-1">{shop.name}</h3>
                <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-md">
                  <Star size={10} className="text-amber-500 fill-amber-500" />
                  <span className="font-medium text-xs">{shop.rating?.toFixed(1) || 'New'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <MapPin size={10} className="shrink-0" />
                <span className="truncate">{shop.location?.area}, {shop.location?.city}</span>
                {shop.distance && <span className="text-gray-400">• {formatDistance(shop.distance)}</span>}
              </div>

              <div className="flex items-center gap-1 text-xs bg-gray-50 px-1.5 py-0.5 rounded-full w-fit">
                <DollarSign size={10} className="text-gray-500" />
                <span>₹{shop.costForTwo || 300}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-4 pb-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-xl font-bold text-gray-900">
            Find your <span className="text-[#FF6B35]">perfect meal</span>
          </h1>

          {/* Search Bar */}
          <div className="mt-3 relative" ref={searchInputRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search mess, hotel, cafe..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(true)}
                className="w-full py-2 pl-9 pr-8 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] bg-white text-sm"
                autoComplete="off"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar - Simplified for mobile */}
      <div className="sticky top-[76px] z-30 bg-white border-b border-gray-100 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-2">
            {/* Categories - Scrollable horizontally */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar flex-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters({ ...filters, category: cat.id })}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition shrink-0 ${
                    filters.category === cat.id
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Right side controls - fixed width */}
            <div className="flex items-center gap-1 shrink-0">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="text-xs bg-gray-100 px-2 py-1.5 rounded-lg appearance-none cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="distance">Nearest</option>
              </select>

              <button
                onClick={() => setShowFilters(true)}
                className="relative bg-gray-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1 text-xs"
              >
                <Filter size={12} />
                Filter
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B35] text-white text-[9px] rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button onClick={() => setViewMode('grid')} className={`p-1 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}>
                  <Grid size={14} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}>
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100">
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
              <button onClick={clearFilters} className="text-gray-400 text-[10px]">Clear</button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {!loading && shops.length > 0 && (
          <p className="text-xs text-gray-500 mb-3">{pagination.total} places found</p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-56 animate-pulse">
                <div className="h-32 bg-gray-100 rounded-t-xl"></div>
                <div className="p-3 space-y-2"><div className="h-3 bg-gray-100 rounded w-3/4"></div><div className="h-2 bg-gray-100 rounded w-1/2"></div></div>
              </div>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search size={28} className="text-gray-400" />
            </div>
            <h3 className="text-base font-semibold mb-1">No shops found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
            <button onClick={clearFilters} className="mt-3 text-[#FF6B35] text-sm">Clear filters</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {shops.map((shop, index) => <ShopCard key={shop._id} shop={shop} index={index} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {shops.map((shop) => (
              <div key={shop._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <Link to={`/shop/${shop.category}/${shop._id}`} className="flex gap-3">
                  <img src={shop.coverImage || "https://placehold.co/80x80/f3f4f6/9ca3af"} alt={shop.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm">{shop.name}</h3>
                      <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs">{shop.rating?.toFixed(1) || 'New'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{shop.location?.area}, {shop.location?.city}</p>
                    <p className="text-xs font-medium mt-1">₹{shop.costForTwo || 300}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {loadingMore && <div className="flex justify-center py-6"><div className="w-5 h-5 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div></div>}
        {!loading && !loadingMore && shops.length > 0 && pagination.page >= pagination.pages && (
          <div className="text-center py-6 text-gray-400 text-xs">You've seen all {pagination.total} places</div>
        )}
      </div>

      {/* Filter Modal - Bottom Sheet for Mobile */}
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
              className="w-full bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>

              <div className="p-4 space-y-5 pb-6">
                {/* Category */}
                <div>
                  <h3 className="font-medium text-sm mb-2">Category</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => setTempFilters({ ...tempFilters, category: cat.id })} className={`px-3 py-2 rounded-lg text-sm transition ${tempFilters.category === cat.id ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pure Veg */}
                <div>
                  <h3 className="font-medium text-sm mb-2">Dietary</h3>
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-lg text-sm">
                    <input type="checkbox" checked={tempFilters.pureVeg} onChange={(e) => setTempFilters({ ...tempFilters, pureVeg: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#FF6B35]" />
                    <span>Pure Vegetarian Only</span>
                  </label>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-medium text-sm mb-2">Minimum Rating</h3>
                  <div className="flex gap-2">
                    {['', '3.5', '4.0', '4.5'].map(rating => (
                      <button key={rating} onClick={() => setTempFilters({ ...tempFilters, minRating: rating })} className={`flex-1 py-2 rounded-lg text-sm transition ${tempFilters.minRating === rating ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        {rating ? `${rating}+ ★` : 'Any'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
                <button onClick={clearFilters} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium">Clear All</button>
                <button onClick={applyFilters} className="flex-1 bg-[#FF6B35] text-white py-2.5 rounded-xl text-sm font-medium">Apply</button>
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