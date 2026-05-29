import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Clock, 
  MapPin, 
  Share2, 
  Heart, 
  ChevronLeft,
  Building,
  Zap,
  Wifi,
  Coffee,
  Gift,
  Wallet,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  X,
  Check,
  Phone,
  Mail,
  Users,
  Award,
  Shield,
  Utensils,
  Camera,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { resolveImageUrl } from '../../utils/media';

const HotelPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [guestCount, setGuestCount] = useState(2);
  const menuRef = useRef(null);
  const reviewsRef = useRef(null);
  const photosRef = useRef(null);
  const aboutRef = useRef(null);

  // Hotel data
  const hotelData = {
    id: 1,
    name: "Grand Tulip Hotel",
    shortName: "Grand Tulip",
    rating: 4.8,
    reviewCount: 1250,
    cuisineTypes: ["North Indian", "Chinese", "Continental", "Biryani"],
    deliveryTime: "35-40 mins",
    distance: "2.5 km",
    location: "Near Mahalaxmi Temple, Kolhapur, Maharashtra 416012",
    openTime: "8:00 AM",
    closeTime: "11:30 PM",
    isOpen: true,
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=450&fit=crop",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=140&h=140&fit=crop",
    description: "Grand Tulip Hotel offers a premium dining experience with authentic Indian and international cuisines. Known for our signature biryani and warm hospitality, we provide the perfect ambiance for family dinners, business lunches, and special celebrations.",
    features: ["Fine Dining", "Family Restaurant", "Party Hall", "Buffet Available"],
    tags: ["Best for Family", "Luxury Dining", "Pure Veg Option Available", "Parking Available"],
    popularDishes: ["Chicken Biryani", "Butter Chicken", "Paneer Butter Masala", "Garlic Naan"],
    amenities: ["Free WiFi", "Parking", "Air Conditioning", "Private Rooms", "Valet Parking", "Wheelchair Access"],
    menu: {
      "Starters": [
        { id: 1, name: "Paneer Tikka", price: 299, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 2, name: "Chicken Seekh Kebab", price: 349, image: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=300&h=200&fit=crop", isVeg: false, popular: true },
        { id: 3, name: "Spring Roll", price: 249, image: "https://images.unsplash.com/photo-1625937287337-5c75f088e335?w=300&h=200&fit=crop", isVeg: true },
        { id: 4, name: "Fish Fry", price: 399, image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=300&h=200&fit=crop", isVeg: false }
      ],
      "Main Course": [
        { id: 5, name: "Butter Chicken", price: 449, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop", isVeg: false, popular: true },
        { id: 6, name: "Paneer Butter Masala", price: 399, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 7, name: "Dal Makhani", price: 299, image: "https://images.unsplash.com/photo-1546833999-b9f581a4af47?w=300&h=200&fit=crop", isVeg: true },
        { id: 8, name: "Chicken Curry", price: 399, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop", isVeg: false }
      ],
      "Biryani": [
        { id: 9, name: "Chicken Biryani", price: 349, image: "https://images.unsplash.com/photo-1563379091339-03b21ed4a610?w=300&h=200&fit=crop", isVeg: false, popular: true },
        { id: 10, name: "Mutton Biryani", price: 449, image: "https://images.unsplash.com/photo-1563379091339-03b21ed4a610?w=300&h=200&fit=crop", isVeg: false },
        { id: 11, name: "Veg Biryani", price: 299, image: "https://images.unsplash.com/photo-1563379091339-03b21ed4a610?w=300&h=200&fit=crop", isVeg: true },
        { id: 12, name: "Hyderabadi Biryani", price: 399, image: "https://images.unsplash.com/photo-1563379091339-03b21ed4a610?w=300&h=200&fit=crop", isVeg: false, popular: true }
      ],
      "Breads": [
        { id: 13, name: "Garlic Naan", price: 49, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", isVeg: true },
        { id: 14, name: "Butter Naan", price: 45, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", isVeg: true },
        { id: 15, name: "Tandoori Roti", price: 25, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", isVeg: true },
        { id: 16, name: "Laccha Paratha", price: 35, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop", isVeg: true }
      ],
      "Rice & Noodles": [
        { id: 17, name: "Veg Fried Rice", price: 199, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop", isVeg: true },
        { id: 18, name: "Chicken Fried Rice", price: 249, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop", isVeg: false },
        { id: 19, name: "Hakka Noodles", price: 199, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop", isVeg: true },
        { id: 20, name: "Chicken Noodles", price: 249, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop", isVeg: false }
      ],
      "Desserts": [
        { id: 21, name: "Gulab Jamun", price: 99, image: "https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 22, name: "Rasmalai", price: 129, image: "https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=300&h=200&fit=crop", isVeg: true },
        { id: 23, name: "Ice Cream", price: 89, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop", isVeg: true },
        { id: 24, name: "Brownie with Ice Cream", price: 179, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop", isVeg: true }
      ],
      "Beverages": [
        { id: 25, name: "Masala Chai", price: 49, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop", isVeg: true },
        { id: 26, name: "Cold Coffee", price: 129, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=200&fit=crop", isVeg: true },
        { id: 27, name: "Fresh Lime Soda", price: 79, image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=300&h=200&fit=crop", isVeg: true },
        { id: 28, name: "Buttermilk", price: 59, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop", isVeg: true }
      ]
    },
    offers: [
      { title: "Weekend Special", discount: "20% OFF on buffet", code: "BUFFET20", minOrder: 0 },
      { title: "Family Pack", discount: "15% OFF on orders above ₹1500", code: "FAMILY15", minOrder: 1500 },
      { title: "First Order", discount: "10% OFF up to ₹200", code: "WELCOME10", minOrder: 499 }
    ],
    reviews: [
      { id: 1, name: "Rajesh Sharma", rating: 5.0, date: "2 days ago", comment: "Excellent food and service! The butter chicken is the best I've had in Kolhapur. Highly recommended!", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
      { id: 2, name: "Priya Mehta", rating: 4.5, date: "5 days ago", comment: "Great ambiance and delicious food. The biryani is amazing. A bit pricey but worth it.", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
      { id: 3, name: "Amit Patel", rating: 5.0, date: "1 week ago", comment: "Perfect place for family dinner. Staff is very courteous and food quality is top notch.", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
      { id: 4, name: "Neha Gupta", rating: 4.0, date: "2 weeks ago", comment: "Good food but waiting time is long on weekends. Otherwise great experience.", avatar: "https://randomuser.me/api/portraits/women/4.jpg" }
    ],
    photos: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400&h=300&fit=crop"
    ]
  };

  const categories = ["all", ...Object.keys(hotelData.menu)];
  const filteredMenu = selectedCategory === "all" 
    ? Object.values(hotelData.menu).flat() 
    : hotelData.menu[selectedCategory] || [];

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

  const featureCards = [
    { icon: Utensils, title: "Fine Dining", description: "Premium experience", color: "orange" },
    { icon: Users, title: "Family Restaurant", description: "Best for families", color: "green" },
    { icon: Award, title: "Signature Dishes", description: "Chef specialties", color: "purple" },
    { icon: Shield, title: "Hygiene Certified", description: "Safety first", color: "blue" }
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-['Poppins']">
      {/* Hero Section */}
      <div className="relative h-[420px] md:h-[480px] overflow-hidden">
        <img 
          src={resolveImageUrl(hotelData.coverImage)} 
          alt={hotelData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-5 right-5 flex gap-3 z-10">
          <button 
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <Heart className={isWishlisted ? "fill-red-500 text-red-500" : ""} size={22} />
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <Share2 size={20} />
          </button>
          {user?.role === 'shopowner' && String(user?.shopId) === String(hotelData.id) && (
            <button
              onClick={() => navigate('/shop/hotel/dashboard')}
              className="ml-2 px-3 py-2 bg-white text-[#FF7A00] rounded-full font-semibold shadow-sm hover:bg-white/90 transition"
            >
              Open Dashboard
            </button>
          )}
        </div>

        {/* Hotel Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
              {/* Logo Card */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-28 h-28 md:w-36 md:h-36 bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/30"
              >
                <img src={resolveImageUrl(hotelData.logo)} alt={hotelData.name} className="w-full h-full object-cover" />
              </motion.div>
              
              {/* Text Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    OPEN NOW
                  </span>
                  <span className="text-white/80 text-sm">Closes at {hotelData.closeTime}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">{hotelData.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                  <div className="flex items-center gap-1.5">
                    <Star className="fill-yellow-400 text-yellow-400" size={16} />
                    <span className="font-semibold">{hotelData.rating}</span>
                    <span className="text-white/70">({hotelData.reviewCount} reviews)</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{hotelData.deliveryTime}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>{hotelData.distance}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <span>{hotelData.cuisineTypes.join(" · ")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Feature Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {featureCards.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC] hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FFA94D] flex items-center justify-center mb-3`}>
                <feature.icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-[#1E1E1E] text-sm md:text-base">{feature.title}</h3>
              <p className="text-xs text-[#6B7280] mt-1">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mb-6">
          {hotelData.tags.map((tag, index) => (
            <span key={index} className="px-4 py-1.5 bg-[#FF7A00]/10 text-[#FF7A00] text-xs font-semibold rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Menu Section */}
          <div className="lg:col-span-2">
            {/* Tabs Navigation */}
            <div className="sticky top-0 bg-[#F8F7F4] z-20 pt-4 pb-2">
              <div className="flex gap-6 border-b border-[#ECECEC] overflow-x-auto scrollbar-hide">
                {[
                  { id: "menu", label: "Menu", ref: menuRef },
                  { id: "reviews", label: `Reviews (${hotelData.reviewCount})`, ref: reviewsRef },
                  { id: "photos", label: "Photos", ref: photosRef },
                  { id: "about", label: "About", ref: aboutRef }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id, tab.ref)}
                    className={`pb-3 text-base font-medium transition-all duration-300 whitespace-nowrap relative ${
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
            <div ref={menuRef} className="pt-6">
              {/* Category Filters */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredMenu.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC] hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-40">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      {item.popular && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#FF7A00] text-white text-xs font-semibold rounded-full">
                          Popular
                        </span>
                      )}
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition">
                        <Heart size={14} className="text-[#6B7280]" />
                      </button>
                      {!item.isVeg && (
                        <span className="absolute bottom-3 left-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">N</span>
                      )}
                      {item.isVeg && (
                        <span className="absolute bottom-3 left-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">V</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#1E1E1E] text-lg mb-1">{item.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[#FF7A00] font-bold text-xl">₹{item.price}</span>
                        {cartItems.find(i => i.id === item.id) ? (
                          <div className="flex items-center gap-2 bg-[#FFF7ED] rounded-full p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#FF7A00] shadow-sm hover:bg-[#FF7A00] hover:text-white transition"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center font-semibold text-[#1E1E1E]">{cartItems.find(i => i.id === item.id).quantity}</span>
                            <button 
                              onClick={() => addToCart(item)}
                              className="w-7 h-7 bg-[#FF7A00] rounded-full flex items-center justify-center text-white hover:bg-[#FF6A00] transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addToCart(item)}
                            className="px-4 py-1.5 border border-[#FF7A00] text-[#FF7A00] rounded-full text-sm font-semibold hover:bg-[#FF7A00] hover:text-white transition-all duration-300"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 text-center text-[#FF7A00] font-semibold hover:bg-[#FF7A00]/5 rounded-xl transition">
                View Full Menu →
              </button>
            </div>

            {/* Reviews Section */}
            <div ref={reviewsRef} className="pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1E1E1E]">What people say</h2>
                <button className="text-[#FF7A00] font-semibold text-sm flex items-center gap-1">
                  View all {hotelData.reviewCount} <ChevronRight size={16} />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {hotelData.reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-[#1E1E1E]">{review.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold">{review.rating}</span>
                          <span className="text-xs text-[#6B7280]">· {review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Photos Section */}
            <div ref={photosRef} className="pt-8">
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-5">Restaurant Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotelData.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img src={resolveImageUrl(photo)} alt={`Restaurant ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div ref={aboutRef} className="pt-8 pb-12">
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">About this restaurant</h2>
              <p className="text-[#6B7280] leading-relaxed mb-6">{hotelData.description}</p>
              
              <div className="mb-6">
                <h3 className="font-semibold text-[#1E1E1E] mb-3">Popular Dishes</h3>
                <div className="flex flex-wrap gap-2">
                  {hotelData.popularDishes.map((dish, index) => (
                    <span key={index} className="px-3 py-1.5 bg-white border border-[#ECECEC] rounded-full text-sm text-[#6B7280]">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E1E1E] mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {hotelData.amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1.5 bg-[#F8F7F4] border border-[#ECECEC] rounded-full text-sm text-[#6B7280] flex items-center gap-1">
                      <Check size={12} className="text-green-500" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Table Booking Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]"
            >
              <h3 className="font-bold text-[#1E1E1E] text-lg mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-[#FF7A00]" />
                Book a Table
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#6B7280] block mb-2">Date</label>
                  <input 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#6B7280] block mb-2">Time</label>
                  <select 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#FF7A00]"
                  >
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#6B7280] block mb-2">Guests</label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-8 h-8 border border-[#ECECEC] rounded-full flex items-center justify-center hover:bg-[#FFF7ED] hover:border-[#FF7A00] transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center font-semibold">{guestCount}</span>
                    <button 
                      onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                      className="w-8 h-8 border border-[#ECECEC] rounded-full flex items-center justify-center hover:bg-[#FFF7ED] hover:border-[#FF7A00] transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button className="w-full py-3 bg-[#FF7A00] text-white rounded-xl font-semibold hover:bg-[#FF6A00] transition">
                  Book Now
                </button>
              </div>
            </motion.div>

            {/* Offer Cards */}
            <div className="space-y-3">
              {hotelData.offers.map((offer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#FF7A00] to-[#FFA94D] rounded-2xl p-4 text-white"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold">{offer.title}</h4>
                      <p className="text-sm opacity-90">{offer.discount}</p>
                      {offer.minOrder > 0 && (
                        <p className="text-xs opacity-80 mt-1">Min order ₹{offer.minOrder}</p>
                      )}
                    </div>
                    <Gift size={20} className="opacity-80" />
                  </div>
                  <div className="mt-3 bg-white/20 backdrop-blur rounded-xl p-2 flex items-center justify-between">
                    <code className="font-mono text-xs font-semibold">Code: {offer.code}</code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(offer.code);
                        toast.success("Code copied!");
                      }}
                      className="px-2 py-1 bg-white text-[#FF7A00] rounded-lg text-xs font-semibold"
                    >
                      Copy
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Restaurant Timings */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-4 flex items-center gap-2">
                <Clock size={18} className="text-[#FF7A00]" />
                Opening Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280]">Monday - Sunday</span>
                  <span className="font-semibold text-green-600">OPEN</span>
                </div>
                <p className="text-[#1E1E1E] font-medium">{hotelData.openTime} - {hotelData.closeTime}</p>
                <div className="pt-3 border-t border-[#ECECEC]">
                  <p className="text-sm text-[#6B7280]">Last order: 30 mins before closing</p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-[#FF7A00]" />
                Location
              </h3>
              <p className="text-[#6B7280] text-sm mb-4">{hotelData.location}</p>
              <div className="rounded-2xl overflow-hidden mb-4 h-32 bg-gray-100">
                <img 
                  src="https://maps.googleapis.com/maps/api/staticmap?center=Mahalaxmi+Temple,Kolhapur&zoom=14&size=400x200&markers=color:orange%7CMahalaxmi+Temple,Kolhapur&key=YOUR_API_KEY"
                  alt="Map"
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://placehold.co/400x200/f0f0f0/999?text=Map+View"}
                />
              </div>
              <button className="w-full py-2.5 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-sm hover:bg-[#FF7A00] hover:text-white transition">
                Get Directions
              </button>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-3">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#6B7280] text-sm">
                  <Phone size={16} className="text-[#FF7A00]" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-[#6B7280] text-sm">
                  <Mail size={16} className="text-[#FF7A00]" />
                  <span>grandtulip@mahii.com</span>
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
          <div className="bg-white/95 backdrop-blur-lg border-t border-[#ECECEC] rounded-t-3xl shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <p className="font-semibold text-[#1E1E1E]">{getCartItemCount()} items in cart</p>
                  <p className="text-2xl font-bold text-[#FF7A00]">₹{getCartTotal()}</p>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="px-8 py-3 bg-gradient-to-r from-[#FF7A00] to-[#FFA94D] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
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
          boxShadow: ["0 0 0 0 rgba(255,122,0,0.4)", "0 0 0 15px rgba(255,122,0,0)", "0 0 0 0 rgba(255,122,0,0)"]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FF7A00] to-[#FFA94D] rounded-full flex flex-col items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300"
      >
        <MessageCircle size={24} className="text-white" />
        <span className="text-[8px] text-white font-medium mt-0.5">Help</span>
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
              className="bg-white rounded-3xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#1E1E1E]">Need help?</h3>
                <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3">
                <button className="w-full py-3 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-left px-4 hover:bg-[#FF7A00] hover:text-white transition">
                  📞 Call Customer Support
                </button>
                <button className="w-full py-3 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-left px-4 hover:bg-[#FF7A00] hover:text-white transition">
                  💬 Live Chat
                </button>
                <button className="w-full py-3 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-left px-4 hover:bg-[#FF7A00] hover:text-white transition">
                  📧 Email Support
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Hide CSS */}
      <style jsx>{`
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

export default HotelPage;