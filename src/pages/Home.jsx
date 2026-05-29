import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiX,
  FiTrendingUp,
  FiClock,
  FiFilter,
  FiChevronDown,
  FiHeart,
  FiChevronRight,
  FiStar,
  FiDollarSign,
} from "react-icons/fi";
import { resolveImageUrl } from "../utils/media";
import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
  FaStar,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { shopAPI } from "../services/api";
import Footer from "../components/common/Footer";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Kolhapur");
  const [nearbyLocations] = useState([
    "Tarabai Park",
    "Rajaram puri",
    "Ruikar Colony",
    "Shahupuri",
    "Ujalaiwadi",
    "Sarnobatwadi",
  ]);

  const trendingSearches = [
    "Mess near me",
    "Best cafe in Kolhapur",
    "Budget meals",
    "Pure veg restaurant",
    "Student mess subscription",
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  // Save location to localStorage
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("userLocation", location);
    setShowLocationModal(false);
    toast.success(`Location changed to ${location}`);
    window.dispatchEvent(new CustomEvent("locationChanged", { detail: { location } }));
  };

  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const debouncedSearch = useCallback(
    (query) => {
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
    },
    [searching]
  );

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
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    saveRecentSearch(suggestion);
    navigate(`/explore?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const handleRestaurantClick = (restaurantName) => {
    if (!restaurantName) return;
    saveRecentSearch(restaurantName);
    navigate(`/explore?search=${encodeURIComponent(restaurantName)}`);
  };

  const handleFilterNavigation = (filterType) => {
    const params = new URLSearchParams();
    switch (filterType) {
      case 'under200':
        params.set('maxCost', '200');
        break;
      case 'schedule':
        params.set('isOpenNow', 'true');
        break;
      case 'rating4':
        params.set('minRating', '4');
        break;
      case 'pureVeg':
        params.set('pureVeg', 'true');
        break;
      default:
        break;
    }
    navigate(`/explore?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handleSlideCtaClick = (link) => {
    if (link?.startsWith("http://") || link?.startsWith("https://")) {
      // External link - open in new tab
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      // Internal link - use navigation
      navigate(link);
    }
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

  const slides = [
    {
      title: "Special Offer Shree Mess 25/5/26",
      desc: "Discounts on Mango Ras at Shree Mess, exclusively for Mahii users",
      image: "/sliderdata/mangoras.jpeg",
      cta: "Discount Now",
      link: "https://www.instagram.com/mahii.yourfriend?igsh=ajJoMHd4ZndkNHJy",
    },
    {
      title: "Gold Flash Sale",
      desc: "Get premium membership for students at just ₹10",
      image: "/sliderdata/whatsapp-1.jpeg",
      cta: "Join Gold",
      link: "/membership",
    },
    
    {
      title: "Budget Meals",
      desc: "Delicious meals starting from ₹70 only",
      image: "/sliderdata/whatsapp-2.jpeg",
      cta: "Explore",
      link: "/explore?maxCost=200",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const categories = [
    { name: "Mess", image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=200&h=200&fit=crop", link: "/explore?category=mess" },
    { name: "Hotel", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop", link: "/explore?category=hotel" },
    { name: "Cafe", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop", link: "/explore?category=cafe" },
    { name: "Dessert", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop", link: "/explore?category=dessert" },
    { name: "Stall", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop", link: "/explore?category=stall" },
  ];

  const recommended = [
    { name: "Burger King", rating: "4.2", time: "35-40 mins", offer: "50% OFF select items", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop", cuisine: "Burger • Fast Food" },
    { name: "McDonald's", rating: "4.1", time: "40-45 mins", offer: "50% OFF select items", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=300&fit=crop", cuisine: "Burgers • Fries" },
    { name: "Shravani Kitchen", rating: "4.0", time: "30-35 mins", offer: "15% OFF select items", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop", cuisine: "North Indian • Thali" },
  ];

  const popularNearYou = [
    { name: "shree mess", rating: "4.7", location: "Vrundavan Colony, Near KIT", cuisine: "North Indian", price: "₹500 for two", image: "/images/popular-near-you/shree-mess.png", offer: "Flat 10 mango ras on pre-booking" },
    { name: "Biotech", rating: "4.2", location: "Near KIT's Kolhapur, kolhpur", cuisine: "North Indian", price: "₹600 for two", image: "/images/popular-near-you/biotech.jpeg" },
    { name: "EPH", rating: "4.2", location: "Near KIT's Kolhapur, kolhapur", cuisine: "Fast Food", price: "₹300 for two", image: "/images/popular-near-you/eph.jpeg" },
  ];

  const popularLocationsList = [
    { name: "Tarabai Park", color: "bg-purple-100" },
    { name: "Rajaram puri", color: "bg-blue-100" },
    { name: "Ruikar Colony", color: "bg-green-100" },
    { name: "Shahupuri", color: "bg-yellow-100" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden">
      
      {/* TOP SECTION */}
      <div className="bg-gradient-to-b from-amber-100 to-amber-50 pb-8 rounded-b-3xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          
          {/* LOCATION BAR */}
          {/* <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md transition"
              >
                <FiMapPin className="text-orange-500" size={18} />
                <span className="font-semibold text-gray-800">{selectedLocation}</span>
                <FiChevronDown size={14} className="text-gray-500" />
              </button>
              <div className="bg-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                GOLD ₹1
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition">
              <img src="https://cdn-icons-png.flaticon.com/512/263/263142.png" alt="profile" className="w-5 h-5" />
            </button>
          </div> */}

          {/* ACTIVE SEARCH BAR */}
          <div className="mt-2 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-full md:w-[550px]" ref={searchInputRef}>
              <div className="flex bg-white rounded-full shadow-xl border border-[#FFE6CC] overflow-hidden hover:shadow-2xl transition">
                <div className="px-4 flex items-center text-[#6B7280]">
                  <FiSearch size={18} className="text-[#FF8A00]" />
                </div>
                <input
                  type="text"
                  placeholder="Search mess, hotel, cafe, dish..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(true)}
                  className="flex-1 py-4 text-sm outline-none bg-transparent"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="px-3 flex items-center text-gray-400 hover:text-gray-600">
                    <FiX size={18} />
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-[#FF8A00] to-[#FF6A00] px-8 text-white font-semibold transition hover:opacity-90"
                >
                  Search
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (searchQuery.length > 0 || recentSearches.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-y-auto"
                  >
                    {searching && (
                      <div className="p-4 text-center text-gray-500">
                        <div className="inline-block w-5 h-5 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-sm">Searching...</span>
                      </div>
                    )}
                    {!searching && searchResults.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">Search Results</div>
                        {searchResults.map((shop) => (
                          <button key={shop._id} onClick={() => handleSuggestionClick(shop.name)} className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-100 last:border-0">
                            <img src={resolveImageUrl(shop.coverImage) || "https://placehold.co/40x40/e2e8f0/64748b"} alt={shop.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{shop.name}</p>
                              <p className="text-xs text-gray-500">{shop.location?.area}, {shop.location?.city}</p>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-yellow-500">⭐ {shop.rating?.toFixed(1) || "New"}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    {!searching && searchQuery.length === 0 && recentSearches.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                          <span>Recent Searches</span>
                          <button onClick={() => { setRecentSearches([]); localStorage.removeItem("recentSearches"); }} className="text-xs text-red-500 hover:underline">Clear All</button>
                        </div>
                        {recentSearches.map((term, idx) => (
                          <button key={idx} onClick={() => handleSuggestionClick(term)} className="w-full px-4 py-2 text-left hover:bg-gray-50 transition flex items-center gap-3">
                            <FiClock size={14} className="text-gray-400" /> <span className="text-gray-700">{term}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {!searching && searchQuery.length === 0 && recentSearches.length === 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                          <FiTrendingUp size={12} /> <span>Trending Now</span>
                        </div>
                        {trendingSearches.map((term, idx) => (
                          <button key={idx} onClick={() => handleSuggestionClick(term)} className="w-full px-4 py-2 text-left hover:bg-gray-50 transition flex items-center gap-3">
                            <span className="text-[#FF8A00]">🔥</span> <span className="text-gray-700">{term}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {!searching && searchQuery.length > 1 && searchResults.length === 0 && (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">No results found for "{searchQuery}"</p>
                        <p className="text-sm text-gray-400 mt-1">Try searching for something else</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { href: "https://www.instagram.com/mahii.yourfriend", icon: FaInstagram, color: "text-pink-600" },
                { href: "https://www.linkedin.com/company/mahii-pvt-ltd", icon: FaLinkedinIn, color: "text-blue-700" },
                { href: "https://youtube.com/@mahii.yourfriend", icon: FaYoutube, color: "text-red-600" },
                { href: "https://whatsapp.com/channel/0029VbCkUixEgGfTHNV9Sm3z", icon: FaWhatsapp, color: "text-green-500" },
              ].map((social, idx) => (
                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white shadow-md border border-[#FFE6CC] flex items-center justify-center text-[#6B7280] hover:bg-gradient-to-r hover:from-[#FF8A00] hover:to-[#FF6A00] hover:text-white hover:scale-110 transition-all duration-300">
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* HERO SLIDER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-200 to-amber-100 min-h-[220px] md:min-h-[300px] shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center justify-between h-full"
              >
                <div className="p-6 md:p-8 flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-amber-800 leading-tight uppercase">{slides[currentSlide].title}</h2>
                  <p className="text-amber-700 mt-2 text-sm md:text-base">{slides[currentSlide].desc}</p>
                  <button onClick={() => handleSlideCtaClick(slides[currentSlide].link)} className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition shadow-md">
                    {slides[currentSlide].cta} →
                  </button>
                </div>
                <div className="hidden md:block flex-1 p-6">
                  <img src={slides[currentSlide].image} alt="banner" className="w-64 h-48 object-cover rounded-2xl shadow-xl mx-auto" />
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all ${currentSlide === index ? "w-6 bg-gray-900" : "w-2 bg-gray-400"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* CATEGORIES - Horizontal Scroll (Circular Design) */}
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex gap-5 min-w-max">
            {categories.map((cat, i) => (
              <Link to={cat.link} key={i}>
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md border-2 border-white group-hover:scale-105 transition">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-2 font-semibold text-gray-700 text-sm md:text-base">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FILTER CHIPS */}
        <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm whitespace-nowrap text-sm font-medium hover:shadow-md transition"><FiFilter size={14} /> Filters</button>
          <button onClick={() => handleFilterNavigation('under200')} className="px-4 py-2 bg-white border rounded-full shadow-sm whitespace-nowrap text-sm font-medium hover:shadow-md transition">Under ₹200</button>
          <button onClick={() => handleFilterNavigation('schedule')} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm whitespace-nowrap text-sm font-medium hover:shadow-md transition">Schedule <FiChevronDown size={12} /></button>
          <button onClick={() => handleFilterNavigation('rating4')} className="px-4 py-2 bg-white border rounded-full shadow-sm whitespace-nowrap text-sm font-medium hover:shadow-md transition">Rating 4+</button>
          <button onClick={() => handleFilterNavigation('pureVeg')} className="px-4 py-2 bg-white border rounded-full shadow-sm whitespace-nowrap text-sm font-medium hover:shadow-md transition">Pure Veg</button>
        </div>
        {/* RECOMMENDED SECTION - Modern Cards */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Recommended For You</h2>
            <button onClick={() => navigate("/explore")} className="text-orange-500 text-sm font-semibold flex items-center gap-1">View all <FiChevronRight size={14} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((item, i) => (
              <motion.div whileHover={{ y: -5 }} key={i} onClick={() => handleRestaurantClick(item.name)} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{item.offer}</div>
                  <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"><FiHeart size={16} /></button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.cuisine}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg"><FaStar size={10} className="text-green-600" /> <span className="text-xs font-semibold">{item.rating}</span></div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500"><FiClock size={12} /> <span>{item.time}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BEST CAFES / POPULAR NEAR YOU SECTION */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Popular Near You</h2>
            <button onClick={() => navigate("/explore")} className="text-orange-500 text-sm font-semibold flex items-center gap-1">View all <FiChevronRight size={14} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularNearYou.map((place, i) => (
              <motion.div whileHover={{ y: -5 }} key={i} onClick={() => handleRestaurantClick(place.name)} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md hover:scale-105 transition"><FiHeart size={16} /></button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{place.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{place.location}</p>
                      <p className="text-gray-500 text-xs mt-1">{place.cuisine} • {place.price}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg"><FaStar size={10} className="text-green-600" /> <span className="text-xs font-semibold">{place.rating}</span></div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100"><p className="text-orange-500 text-sm font-semibold">🔥 {place.offer}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* POPULAR LOCATIONS */}
        {/*<div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5">Popular locations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularLocationsList.map((loc, i) => (
              <button key={i} onClick={() => handleLocationChange(loc.name)} className={`${loc.color} p-4 rounded-2xl text-center hover:shadow-md transition hover:scale-105`}>
                <h3 className="font-bold text-gray-800">{loc.name}</h3>
              </button>
            ))}
          </div>
        </div> */}

        {/* SOCIAL ICONS */}
        {/* <div className="mt-12 flex items-center justify-center gap-4 flex-wrap py-6 border-t border-gray-200">
          <a href="https://www.instagram.com/mahii.yourfriend" target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-pink-600 hover:scale-110 transition"><FaInstagram size={20} /></a>
          <a href="https://www.linkedin.com/company/mahii-pvt-ltd" target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-blue-700 hover:scale-110 transition"><FaLinkedinIn size={20} /></a>
          <a href="https://youtube.com/@mahii.yourfriend" target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-red-600 hover:scale-110 transition"><FaYoutube size={20} /></a>
          <a href="https://whatsapp.com/channel/0029VbCkUixEgGfTHNV9Sm3z" target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-green-500 hover:scale-110 transition"><FaWhatsapp size={20} /></a>
        </div> */}
      </div> 

      {/* LOCATION MODAL */}
      {/* <AnimatePresence>
        {showLocationModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLocationModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Select Location</h2>
                <button onClick={() => setShowLocationModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><FiX size={20} /></button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {nearbyLocations.map((loc) => (
                  <button key={loc} onClick={() => handleLocationChange(loc)} className={`w-full text-left px-4 py-3 rounded-xl transition ${selectedLocation === loc ? "bg-orange-100 text-orange-600 font-semibold" : "hover:bg-gray-50"}`}>
                    {loc}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}

      <Footer />
    </div>
  );
};

export default Home;