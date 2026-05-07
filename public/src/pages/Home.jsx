import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiX, FiTrendingUp, FiClock } from "react-icons/fi";
import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { shopAPI } from "../services/api";
import Footer from "../components/common/Footer";

const Home = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches] = useState([
    "Mess near me",
    "Best cafe in Pune",
    "Budget meals",
    "Pure veg restaurant",
    "Student mess subscription"
  ]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Debounced search function
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
            console.error("Search error:", error);
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

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    
    if (value.length > 1) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery("");
    }
  };

  // Handle key press (Enter)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    saveRecentSearch(suggestion);
    navigate(`/explore?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===========================
     SLIDER DATA
  ============================ */
  const slides = [
    {
      title: "Exclusive Student Discount Is Live!",
      desc: "Get 20% Cashback on your first order this week.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
      cta: "Claim Now"
    },
    {
      title: "Late Night Hunger?",
      desc: "Order from mess & cafes open till midnight.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
      cta: "Order Now"
    },
    {
      title: "Budget Friendly Meals",
      desc: "Delicious meals starting from just ₹79.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
      cta: "Explore Now"
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  /* ===========================
     DATA
  ============================ */

  const categories = [
    { name: "Mess", image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&h=300&fit=crop", link: "/explore?category=mess" },
    { name: "Hotel", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop", link: "/explore?category=hotel" },
    { name: "Cafe", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop", link: "/explore?category=cafe" },
    { name: "Dessert", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop", link: "/explore?category=dessert" },
    { name: "Stall", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop", link: "/explore?category=stall" },
  ];

  const recommended = [
    {
      name: "Deluxe Veg Thali",
      rating: "4.8",
      price: "₹120",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    },
    {
      name: "Spicy Chicken Burger",
      rating: "4.7",
      price: "₹149",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    },
    {
      name: "Butter Chicken Meal",
      rating: "4.9",
      price: "₹249",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
    },
  ];

  const popularNearYou = [
    {
      name: "Royal Spice Hotel",
      rating: "4.6",
      location: "Wakad, Pune",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    },
    {
      name: "Cafe BrewTime",
      rating: "4.5",
      location: "Hinjewadi",
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop",
    },
    {
      name: "Student Mess Hub",
      rating: "4.7",
      location: "Chinchwad",
      image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <div className="flex-grow max-w-7xl mx-auto w-full px-5 md:px-10">

        {/* HERO SECTION */}
        <div className="pt-20 pb-16 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1E1E1E]"
          >
            Discover & Order <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#FF8A00] to-[#FF6A00] bg-clip-text text-transparent">
              Delicious Food Near You
            </span>
          </motion.h1>

          <p className="text-[#6B7280] mt-6 text-lg max-w-xl">
            Affordable mess, hotels & cafes curated specially for students.
          </p>

          {/* ACTIVE SEARCH BAR */}
          <div className="mt-10 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-full md:w-[550px]" ref={searchInputRef}>
              <div className="flex bg-white rounded-full shadow-xl border border-[#FFE6CC] overflow-hidden hover:shadow-2xl transition">
                <div className="px-4 flex items-center text-[#6B7280]">
                  <FiSearch size={18} />
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
                  <button
                    onClick={clearSearch}
                    className="px-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
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
                    {/* Loading Indicator */}
                    {searching && (
                      <div className="p-4 text-center text-gray-500">
                        <div className="inline-block w-5 h-5 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-sm">Searching...</span>
                      </div>
                    )}

                    {/* Search Results */}
                    {!searching && searchResults.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Search Results
                        </div>
                        {searchResults.map((shop) => (
                          <button
                            key={shop._id}
                            onClick={() => handleSuggestionClick(shop.name)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3 border-b border-gray-100 last:border-0"
                          >
                            <img
                              src={shop.coverImage || "https://placehold.co/40x40/e2e8f0/64748b"}
                              alt={shop.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{shop.name}</p>
                              <p className="text-xs text-gray-500">{shop.location?.area}, {shop.location?.city}</p>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-yellow-500">
                              <span>⭐</span>
                              <span>{shop.rating?.toFixed(1) || "New"}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Recent Searches */}
                    {!searching && searchQuery.length === 0 && recentSearches.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                          <span>Recent Searches</span>
                          <button
                            onClick={() => {
                              setRecentSearches([]);
                              localStorage.removeItem("recentSearches");
                            }}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Clear All
                          </button>
                        </div>
                        {recentSearches.map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(term)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition flex items-center gap-3"
                          >
                            <FiClock size={14} className="text-gray-400" />
                            <span className="text-gray-700">{term}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Trending Searches */}
                    {!searching && searchQuery.length === 0 && recentSearches.length === 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                          <FiTrendingUp size={12} />
                          <span>Trending Now</span>
                        </div>
                        {trendingSearches.map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(term)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition flex items-center gap-3"
                          >
                            <span className="text-[#FF8A00]">🔥</span>
                            <span className="text-gray-700">{term}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No Results */}
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
              {[FaInstagram, FaLinkedinIn, FaYoutube, FaWhatsapp].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-white shadow-md border border-[#FFE6CC] flex items-center justify-center text-[#6B7280] hover:bg-gradient-to-r hover:from-[#FF8A00] hover:to-[#FF6A00] hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
                  >
                    <Icon size={18} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* SLIDER SECTION */}
        <div className="mb-20">
          <div className="relative bg-gradient-to-r from-[#FF8A00] to-[#FF6A00] text-white rounded-[40px] overflow-hidden shadow-2xl p-10 md:p-16">

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-center justify-between gap-12"
              >
                <div className="max-w-xl">
                  <h2 className="text-4xl font-bold leading-snug">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="mt-6 text-white/90 text-lg">
                    {slides[currentSlide].desc}
                  </p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="mt-8 bg-white text-[#FF8A00] px-10 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition"
                  >
                    {slides[currentSlide].cta}
                  </button>
                </div>

                <div className="hidden md:block">
                  <img
                    src={slides[currentSlide].image}
                    alt="slide"
                    className="w-72 rounded-3xl shadow-2xl border border-white/20"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* DOTS */}
            <div className="flex justify-center mt-10 gap-4">
              {slides.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-white scale-125"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-[#1E1E1E]">
            Browse Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <Link key={i} to={cat.link}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="bg-white rounded-[15px] p-8 shadow-lg border border-[#FFE6CC] text-center hover:shadow-2xl transition"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-80 h-90 mx-auto rounded-full object-cover border-4 border-[#FFE6CC]"
                    onError={(e) => e.target.src = `https://placehold.co/400x300/e2e8f0/64748b?text=${cat.name}`}
                  />
                  <p className="mt-5 font-semibold text-[#1E1E1E] text-lg">
                    {cat.name}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* RECOMMENDED */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-[#1E1E1E]">
            Recommended For You
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {recommended.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[30px] shadow-lg overflow-hidden border border-[#FFE6CC] hover:shadow-2xl transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                  onError={(e) => e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Recommended+Item'}
                />
                <div className="p-7">
                  <h3 className="font-semibold text-xl text-[#1E1E1E]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#6B7280] mt-2">
                    ⭐ <span className="text-[#FFA41C]">{item.rating}</span>
                  </p>
                  <p className="text-[#FF8A00] font-bold mt-4 text-xl">
                    {item.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* POPULAR NEAR YOU */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-10 text-[#1E1E1E]">
            Popular Near You
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {popularNearYou.map((place, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[30px] shadow-lg overflow-hidden border border-[#FFE6CC] hover:shadow-2xl transition"
              >
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-60 object-cover"
                  onError={(e) => e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Popular+Place'}
                />
                <div className="p-7">
                  <h3 className="font-semibold text-xl text-[#1E1E1E]">
                    {place.name}
                  </h3>
                  <p className="text-sm text-[#6B7280] flex items-center gap-2 mt-2">
                    <FiMapPin size={15} />
                    {place.location}
                  </p>
                  <p className="text-sm mt-4">
                    ⭐ <span className="text-[#FFA41C]">{place.rating}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Home;