import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Clock, 
  MapPin, 
  Share2, 
  Heart, 
  ChevronLeft,
  Store,
  Zap,
  Flame,
  Gift,
  Wallet,
  Plus,
  Minus,
  MessageCircle,
  X,
  Phone,
  Mail,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/media';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const StallPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const menuRef = useRef(null);
  const reviewsRef = useRef(null);
  const photosRef = useRef(null);
  const aboutRef = useRef(null);

  // Stall data
  const stallData = {
    id: 1,
    name: "Chai Spot",
    shortName: "Chai Spot",
    rating: 4.5,
    reviewCount: 342,
    cuisineTypes: ["Street Food", "Snacks", "Beverages", "Fast Food"],
    deliveryTime: "20-25 mins",
    distance: "0.8 km",
    location: "Near KIT College Main Gate, Kolhapur, Maharashtra 416008",
    openTime: "8:00 AM",
    closeTime: "10:00 PM",
    isOpen: true,
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=140&h=140&fit=crop",
    description: "Chai Spot is the go-to destination for students and chai lovers near KIT College. We serve authentic street-side chai, crispy snacks, and quick bites at budget-friendly prices. Perfect for evening hangouts and quick breaks between classes.",
    features: ["Quick Service", "Student Budget", "Evening Hangout", "Takeaway Available"],
    tags: ["Best for Chai", "Student Favorite", "Budget Meals", "Quick Bites"],
    popularDishes: ["Cutting Chai", "Masala Chai", "Bun Maska", "Vada Pav", "Samosa"],
    menu: {
      "Chai & Beverages": [
        { id: 1, name: "Cutting Chai", price: 10, image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 2, name: "Masala Chai", price: 15, image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 3, name: "Ginger Chai", price: 15, image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=300&h=200&fit=crop", isVeg: true },
        { id: 4, name: "Elaichi Chai", price: 15, image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=300&h=200&fit=crop", isVeg: true },
        { id: 5, name: "Lemon Tea", price: 20, image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=300&h=200&fit=crop", isVeg: true },
        { id: 6, name: "Green Tea", price: 25, image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=300&h=200&fit=crop", isVeg: true },
        { id: 7, name: "Cold Coffee", price: 40, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=200&fit=crop", isVeg: true },
        { id: 8, name: "Fresh Lime Soda", price: 30, image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=300&h=200&fit=crop", isVeg: true }
      ],
      "Snacks": [
        { id: 9, name: "Vada Pav", price: 25, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 10, name: "Samosa", price: 15, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 11, name: "Bun Maska", price: 20, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 12, name: "Kanda Bhaji", price: 30, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", isVeg: true },
        { id: 13, name: "Medu Vada", price: 30, image: "https://images.unsplash.com/photo-1589301760014-929ef0d46cc7?w=300&h=200&fit=crop", isVeg: true },
        { id: 14, name: "Idli (2 pcs)", price: 30, image: "https://images.unsplash.com/photo-1589301760014-929ef0d46cc7?w=300&h=200&fit=crop", isVeg: true },
        { id: 15, name: "Dosa", price: 50, image: "https://images.unsplash.com/photo-1589301760014-929ef0d46cc7?w=300&h=200&fit=crop", isVeg: true },
        { id: 16, name: "Pav Bhaji", price: 60, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop", isVeg: true }
      ],
      "Sandwiches & Rolls": [
        { id: 17, name: "Toast Sandwich", price: 40, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop", isVeg: true },
        { id: 18, name: "Grilled Sandwich", price: 60, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop", isVeg: true },
        { id: 19, name: "Veg Cheese Sandwich", price: 70, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 20, name: "Veg Roll", price: 50, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop", isVeg: true },
        { id: 21, name: "Egg Roll", price: 60, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop", isVeg: false },
        { id: 22, name: "Chicken Roll", price: 80, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop", isVeg: false }
      ],
      "Maggi & Noodles": [
        { id: 23, name: "Plain Maggi", price: 30, image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 24, name: "Masala Maggi", price: 40, image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 25, name: "Cheese Maggi", price: 50, image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=200&fit=crop", isVeg: true },
        { id: 26, name: "Veg Noodles", price: 60, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop", isVeg: true },
        { id: 27, name: "Egg Noodles", price: 80, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop", isVeg: false },
        { id: 28, name: "Chicken Noodles", price: 100, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop", isVeg: false }
      ],
      "Fries & Sides": [
        { id: 29, name: "French Fries", price: 40, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop", isVeg: true },
        { id: 30, name: "Chilli Potato", price: 60, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop", isVeg: true },
        { id: 31, name: "Cheese Fries", price: 70, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 32, name: "Onion Rings", price: 50, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop", isVeg: true }
      ],
      "Desserts": [
        { id: 33, name: "Gulab Jamun", price: 30, image: "https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=300&h=200&fit=crop", isVeg: true },
        { id: 34, name: "Jalebi", price: 40, image: "https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=300&h=200&fit=crop", isVeg: true },
        { id: 35, name: "Ice Cream", price: 40, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop", isVeg: true }
      ]
    },
    offers: [
      { title: "Chai Lover's Deal", discount: "Buy 2 Chai Get 1 Free", code: "CHAI20", minOrder: 30 },
      { title: "Student Special", discount: "10% OFF on orders above ₹100", code: "STUDENT10", minOrder: 100, idRequired: true },
      { title: "Evening Combo", discount: "Chai + Samosa @ ₹35", code: "COMBO35", minOrder: 0 }
    ],
    reviews: [
      { id: 1, name: "Raj Patil", rating: 5.0, date: "1 day ago", comment: "Best chai near college! Perfect place for evening snacks. Love their cutting chai and vada pav.", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
      { id: 2, name: "Sneha Desai", rating: 4.5, date: "3 days ago", comment: "Budget friendly and tasty. The bun maska with chai is my go-to order. Service is quick.", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
      { id: 3, name: "Amit Kulkarni", rating: 5.0, date: "1 week ago", comment: "Authentic street food taste! Their masala chai is amazing. Must try for all students.", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
      { id: 4, name: "Priya Sharma", rating: 4.0, date: "2 weeks ago", comment: "Good place for quick bites. Samosa is crispy and chai is perfect.", avatar: "https://randomuser.me/api/portraits/women/4.jpg" }
    ],
    photos: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop"
    ]
  };

  const categories = ["all", ...Object.keys(stallData.menu)];
  const filteredMenu = selectedCategory === "all" 
    ? Object.values(stallData.menu).flat() 
    : stallData.menu[selectedCategory] || [];

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems(prev => {
      const item = prev.find(i => i.id === itemId);
      if (!item) return prev;
      if (item.quantity + delta <= 0) {
        return prev.filter(i => i.id !== itemId);
      }
      return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity + delta } : i);
    });
  };

  const scrollToSection = (section, ref) => {
    setActiveTab(section);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const sections = [
      { id: 'menu', ref: menuRef },
      { id: 'reviews', ref: reviewsRef },
      { id: 'photos', ref: photosRef },
      { id: 'about', ref: aboutRef }
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      let currentSection = sections[0].id;

      sections.forEach((section) => {
        const top = section.ref.current?.offsetTop || 0;
        if (scrollPosition >= top) {
          currentSection = section.id;
        }
      });

      setActiveTab(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featureCards = [
    { icon: Zap, title: "Quick Service", description: "Ready in 10-15 mins", color: "orange" },
    { icon: Wallet, title: "Student Budget", description: "Pocket friendly", color: "green" },
    { icon: Flame, title: "Evening Hangout", description: "Best vibe", color: "purple" },
    { icon: Store, title: "Takeaway", description: "Pack & go", color: "blue" }
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-['Poppins']">
      {/* Hero Section */}
      <div className="relative h-[380px] md:h-[420px] overflow-hidden">
          <img 
            src={resolveImageUrl(stallData.coverImage)} 
          alt={stallData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-5 right-5 flex gap-3 z-10">
          <button 
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <Heart className={isWishlisted ? "fill-red-500 text-red-500" : ""} size={20} />
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <Share2 size={18} />
          </button>
          {user?.role === 'shopowner' && String(user?.shopId) === String(stallData.id) && (
            <button
              onClick={() => navigate('/shop/stall/dashboard')}
              className="ml-2 px-3 py-2 bg-white text-[#FF7A00] rounded-full font-semibold shadow-sm hover:bg-white/90 transition"
            >
              Open Dashboard
            </button>
          )}
        </div>

        {/* Stall Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-5">
              {/* Logo Card */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-white/90 backdrop-blur-lg rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/30"
              >
                <img src={resolveImageUrl(stallData.logo)} alt={stallData.name} className="w-full h-full object-cover" />
              </motion.div>
              
              {/* Text Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  <span className="px-2 md:px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    OPEN NOW
                  </span>
                  <span className="text-white/80 text-xs md:text-sm">Closes at {stallData.closeTime}</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-white mb-2">{stallData.name}</h1>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/90 text-xs md:text-sm">
                  <div className="flex items-center gap-1.5">
                    <Star className="fill-yellow-400 text-yellow-400" size={14} />
                    <span className="font-semibold">{stallData.rating}</span>
                    <span className="text-white/70">({stallData.reviewCount} reviews)</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{stallData.deliveryTime}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span>{stallData.distance}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <span>{stallData.cuisineTypes.slice(0, 2).join(" · ")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-8 relative z-10">
        {/* Feature Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {featureCards.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC] hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FFA94D] flex items-center justify-center mb-2 md:mb-3`}>
                <feature.icon size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-[#1E1E1E] text-xs md:text-sm">{feature.title}</h3>
              <p className="text-[10px] md:text-xs text-[#6B7280] mt-1">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mb-6">
          {stallData.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 md:px-4 md:py-1.5 bg-[#FF7A00]/10 text-[#FF7A00] text-xs font-semibold rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Menu Section */}
          <div className="lg:col-span-2">
            {/* Tabs Navigation */}
            <div className="sticky top-0 bg-[#F8F7F4] z-20 pt-4 pb-2">
              <div className="flex gap-4 md:gap-6 border-b border-[#ECECEC] overflow-x-auto scrollbar-hide">
                {[
                  { id: "menu", label: "Menu", ref: menuRef },
                  { id: "reviews", label: `Reviews (${stallData.reviewCount})`, ref: reviewsRef },
                  { id: "photos", label: "Photos", ref: photosRef },
                  { id: "about", label: "About", ref: aboutRef }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id, tab.ref)}
                    className={`pb-3 text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap relative ${
                      activeTab === tab.id ? "text-[#FF7A00]" : "text-[#6B7280] hover:text-[#1E1E1E]"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A00] rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Section */}
            <div ref={menuRef} className="pt-4 md:pt-6">
              {/* Category Filters */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-4 md:mb-6 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-[#FF7A00] text-white shadow-lg"
                        : "bg-white text-[#6B7280] border border-[#ECECEC] hover:border-[#FF7A00] hover:text-[#FF7A00]"
                    }`}
                  >
                    {category === "all" ? "All Menu" : category}
                  </button>
                ))}
              </div>

              {/* Food Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {filteredMenu.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC] hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-36 md:h-40">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      {item.popular && (
                        <span className="absolute top-2 left-2 md:top-3 md:left-3 px-1.5 py-0.5 md:px-2 md:py-0.5 bg-[#FF7A00] text-white text-[10px] md:text-xs font-semibold rounded-full">
                          Popular
                        </span>
                      )}
                      <button className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition">
                        <Heart size={12} className="text-[#6B7280]" />
                      </button>
                      {!item.isVeg && (
                        <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 w-5 h-5 md:w-6 md:h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] md:text-[10px] font-bold">N</span>
                      )}
                      {item.isVeg && (
                        <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px] md:text-[10px] font-bold">V</span>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="font-semibold text-[#1E1E1E] text-base md:text-lg mb-1">{item.name}</h3>
                      <div className="flex items-center justify-between mt-2 md:mt-3">
                        <span className="text-[#FF7A00] font-bold text-lg md:text-xl">₹{item.price}</span>
                        {cartItems.find(i => i.id === item.id) ? (
                          <div className="flex items-center gap-1 md:gap-2 bg-[#FFF7ED] rounded-full p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 md:w-7 md:h-7 bg-white rounded-full flex items-center justify-center text-[#FF7A00] shadow-sm hover:bg-[#FF7A00] hover:text-white transition"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-5 text-center font-semibold text-[#1E1E1E] text-sm">{cartItems.find(i => i.id === item.id).quantity}</span>
                            <button 
                              onClick={() => addToCart(item)}
                              className="w-6 h-6 md:w-7 md:h-7 bg-[#FF7A00] rounded-full flex items-center justify-center text-white hover:bg-[#FF6A00] transition"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addToCart(item)}
                            className="px-3 py-1 md:px-4 md:py-1.5 border border-[#FF7A00] text-[#FF7A00] rounded-full text-xs md:text-sm font-semibold hover:bg-[#FF7A00] hover:text-white transition-all duration-300"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-6 py-2.5 md:py-3 text-center text-[#FF7A00] font-semibold text-sm md:text-base hover:bg-[#FF7A00]/5 rounded-xl transition">
                View Full Menu →
              </button>
            </div>

            {/* Reviews Section */}
            <div ref={reviewsRef} className="pt-6 md:pt-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#1E1E1E]">What people say</h2>
                <button className="text-[#FF7A00] font-semibold text-xs md:text-sm">View all {stallData.reviewCount} →</button>
              </div>
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {stallData.reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="min-w-[260px] md:min-w-[300px] bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img src={review.avatar} alt={review.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-[#1E1E1E] text-sm md:text-base">{review.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star size={10} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold">{review.rating}</span>
                          <span className="text-[10px] md:text-xs text-[#6B7280]">· {review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-[#6B7280] leading-relaxed line-clamp-3">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Photos Section */}
            <div ref={photosRef} className="pt-6 md:pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-[#1E1E1E] mb-4 md:mb-5">Stall Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                {stallData.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img src={resolveImageUrl(photo)} alt={`Stall ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div ref={aboutRef} className="pt-6 md:pt-8 pb-8 md:pb-12">
              <h2 className="text-xl md:text-2xl font-bold text-[#1E1E1E] mb-3 md:mb-4">About this stall</h2>
              <p className="text-sm md:text-base text-[#6B7280] leading-relaxed mb-5 md:mb-6">{stallData.description}</p>
              
              <div className="mb-5 md:mb-6">
                <h3 className="font-semibold text-[#1E1E1E] mb-2 md:mb-3 text-sm md:text-base">Popular Dishes</h3>
                <div className="flex flex-wrap gap-2">
                  {stallData.popularDishes.map((dish, index) => (
                    <span key={index} className="px-2 py-1 md:px-3 md:py-1.5 bg-white border border-[#ECECEC] rounded-full text-xs md:text-sm text-[#6B7280]">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Student Special Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#FF7A00] to-[#FFA94D] rounded-2xl md:rounded-3xl p-5 md:p-6 text-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg md:text-xl font-bold">Student Special!</h3>
                  <p className="text-xs md:text-sm opacity-90 mt-1">Show your college ID</p>
                </div>
                <Users size={24} className="opacity-80" />
              </div>
              <p className="text-2xl md:text-3xl font-bold mb-1">10% OFF</p>
              <p className="text-xs md:text-sm opacity-90 mb-4">on orders above ₹100</p>
              <div className="bg-white/20 backdrop-blur rounded-xl p-2 md:p-3 flex items-center justify-between">
                <code className="font-mono text-xs md:text-sm font-semibold">Code: STUDENT10</code>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("STUDENT10");
                    toast.success("Code copied!");
                  }}
                  className="px-2 py-1 bg-white text-[#FF7A00] rounded-lg text-xs font-semibold"
                >
                  Copy
                </button>
              </div>
            </motion.div>

            {/* Other Offers */}
            <div className="space-y-3">
              {stallData.offers.slice(0, 2).map((offer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-[#1E1E1E] text-sm md:text-base">{offer.title}</h4>
                      <p className="text-xs md:text-sm text-[#6B7280] mt-1">{offer.discount}</p>
                      {offer.minOrder > 0 && (
                        <p className="text-[10px] md:text-xs text-[#6B7280] mt-1">Min order ₹{offer.minOrder}</p>
                      )}
                    </div>
                    <Gift size={16} className="text-[#FF7A00]" />
                  </div>
                  <div className="mt-3 bg-[#F8F7F4] rounded-xl p-2 flex items-center justify-between">
                    <code className="font-mono text-xs font-semibold text-[#1E1E1E]">{offer.code}</code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(offer.code);
                        toast.success("Code copied!");
                      }}
                      className="px-2 py-1 bg-[#FF7A00] text-white rounded-lg text-[10px] md:text-xs font-semibold"
                    >
                      Copy
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stall Timings */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2 text-sm md:text-base">
                <Clock size={16} className="text-[#FF7A00]" />
                Opening Hours
              </h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm text-[#6B7280]">Monday - Sunday</span>
                <span className="font-semibold text-green-600 text-xs md:text-sm">OPEN</span>
              </div>
              <p className="text-sm md:text-base text-[#1E1E1E] font-medium">{stallData.openTime} - {stallData.closeTime}</p>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2 text-sm md:text-base">
                <MapPin size={16} className="text-[#FF7A00]" />
                Location
              </h3>
              <p className="text-xs md:text-sm text-[#6B7280] mb-4">{stallData.location}</p>
              <div className="rounded-xl md:rounded-2xl overflow-hidden mb-4 h-28 md:h-32 bg-gray-100">
                <img 
                  src="https://maps.googleapis.com/maps/api/staticmap?center=KIT+College,Kolhapur&zoom=15&size=400x200&markers=color:orange%7CKIT+College,Kolhapur&key=YOUR_API_KEY"
                  alt="Map"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://placehold.co/400x200/f0f0f0/999?text=Map+View"; }}
                />
              </div>
              <button className="w-full py-2 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-xs md:text-sm hover:bg-[#FF7A00] hover:text-white transition">
                Get Directions
              </button>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-3 text-sm md:text-base">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#6B7280] text-xs md:text-sm">
                  <Phone size={14} className="text-[#FF7A00]" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-[#6B7280] text-xs md:text-sm">
                  <Mail size={14} className="text-[#FF7A00]" />
                  <span>chaispot@mahii.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Cart Bar */}
      {cartItems.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <div className="bg-white/95 backdrop-blur-lg border-t border-[#ECECEC] rounded-t-2xl md:rounded-t-3xl shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
              <div className="flex items-center justify-between gap-3 md:gap-4 flex-wrap">
                <div className="flex-1">
                  <p className="font-semibold text-[#1E1E1E] text-sm md:text-base">{getCartItemCount()} items in cart</p>
                  <p className="text-xl md:text-2xl font-bold text-[#FF7A00]">₹{getCartTotal()}</p>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="px-5 md:px-8 py-2 md:py-3 bg-gradient-to-r from-[#FF7A00] to-[#FFA94D] text-white font-semibold rounded-xl text-sm md:text-base hover:shadow-lg transition-all duration-300"
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Help Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: ["0 0 0 0 rgba(255,122,0,0.4)", "0 0 0 15px rgba(255,122,0,0)", "0 0 0 0 rgba(255,122,0,0)" ]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#FF7A00] to-[#FFA94D] rounded-full flex flex-col items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300"
      >
        <MessageCircle size={20} className="text-white" />
        <span className="text-[7px] md:text-[8px] text-white font-medium mt-0.5">Help</span>
      </motion.button>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl md:rounded-3xl max-w-md w-full p-5 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-[#1E1E1E]">Need help?</h3>
                <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2 md:space-y-3">
                <button className="w-full py-2.5 md:py-3 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-left px-3 md:px-4 text-sm md:text-base hover:bg-[#FF7A00] hover:text-white transition">
                  📞 Call Customer Support
                </button>
                <button className="w-full py-2.5 md:py-3 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-left px-3 md:px-4 text-sm md:text-base hover:bg-[#FF7A00] hover:text-white transition">
                  💬 Live Chat
                </button>
                <button className="w-full py-2.5 md:py-3 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-left px-3 md:px-4 text-sm md:text-base hover:bg-[#FF7A00] hover:text-white transition">
                  📧 Email Support
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default StallPage;
