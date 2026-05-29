import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Clock, 
  MapPin, 
  Share2, 
  Heart, 
  ChevronLeft,
  Coffee,
  Zap,
  GraduationCap,
  Gift,
  Wallet,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  X,
  Check,
  ExternalLink,
  Utensils,
  Camera,
  Phone,
  Mail
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, productAPI, reviewAPI } from '../../services/api';
import { resolveImageUrl } from '../../utils/media';

const CafePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loadingShop, setLoadingShop] = useState(true);
  const menuRef = useRef(null);
  const reviewsRef = useRef(null);
  const photosRef = useRef(null);
  const aboutRef = useRef(null);

  // Fallback/mock cafe data (used when API is unavailable)
  const fallbackData = {
    id: 1,
    name: "BrewHouse Cafe",
    shortName: "BrewHouse",
    rating: 4.6,
    reviewCount: 248,
    cuisineTypes: ["Cafe", "Fast Food", "Beverages"],
    deliveryTime: "25-30 mins",
    distance: "1.2 km",
    location: "Near KIT College, Kolhapur, Maharashtra 416008",
    openTime: "7:00 AM",
    closeTime: "11:00 PM",
    isOpen: true,
    coverImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=140&h=140&fit=crop",
    description: "BrewHouse Cafe is a cozy place near KIT College, perfect for students to hangout, study, and enjoy great food and coffee. We serve freshly brewed beverages and delicious snacks in a warm, inviting atmosphere.",
    features: ["Fast Delivery", "Student Friendly", "Exclusive Offers", "Budget Friendly"],
    tags: ["Best for Students", "Meals under ₹150"],
    popularDishes: ["Cold Coffee", "Cheese Sandwich", "Paneer Tikka Pizza", "Veg Wrap"],
    menu: {
      "Beverages": [
        { id: 1, name: "Cold Coffee", price: 129, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 2, name: "Hot Coffee", price: 79, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop", isVeg: true },
        { id: 3, name: "Oreo Shake", price: 119, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 4, name: "Chocolate Brownie", price: 89, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop", isVeg: true }
      ],
      "Sandwich": [
        { id: 5, name: "Cheese Sandwich", price: 119, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 6, name: "Grilled Sandwich", price: 149, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop", isVeg: true }
      ],
      "Pizza": [
        { id: 7, name: "Paneer Tikka Pizza", price: 199, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 8, name: "Cheese Corn Pizza", price: 189, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop", isVeg: true }
      ],
      "Wraps": [
        { id: 9, name: "Veg Wrap", price: 99, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop", isVeg: true },
        { id: 10, name: "Paneer Wrap", price: 129, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop", isVeg: true }
      ],
      "Maggi": [
        { id: 11, name: "Masala Maggi", price: 69, image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=200&fit=crop", isVeg: true, popular: true },
        { id: 12, name: "Cheese Maggi", price: 99, image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=200&fit=crop", isVeg: true }
      ],
      "Snacks": [
        { id: 13, name: "French Fries", price: 89, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop", isVeg: true },
        { id: 14, name: "Chicken Popcorn", price: 149, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=300&h=200&fit=crop", isVeg: false }
      ],
      "Desserts": [
        { id: 15, name: "Chocolate Brownie", price: 89, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop", isVeg: true }
      ]
    },
    offers: {
      title: "Exclusive Offer",
      discount: "15% OFF up to ₹100",
      code: "MAHII15",
      minOrder: 199
    },
    reviews: [
      { id: 1, name: "Aman Patil", rating: 5.0, date: "2 days ago", comment: "Great ambiance and affordable prices! The cold coffee is a must try.", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
      { id: 2, name: "Sneha K.", rating: 4.5, date: "5 days ago", comment: "Perfect place to study and chill. Love their cheese sandwich!", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
      { id: 3, name: "Rohit S.", rating: 4.0, date: "1 week ago", comment: "Good coffee and quick service. Budget friendly for students.", avatar: "https://randomuser.me/api/portraits/men/2.jpg" }
    ],
    photos: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
    ]
  };

  const params = useParams();
  const { user } = useAuth();

  // Fetch shop + products when mounted
  const loadCafePageData = async () => {
    const id = params.id;
    if (!id) {
      setLoadingShop(false);
      return;
    }

    setLoadingShop(true);
    try {
      const shopRes = await shopAPI.getShopById(id);
      const shopData = shopRes.data.shop;
      setShop(shopData);

      const [prodRes, reviewRes] = await Promise.all([
        productAPI.getProductsByShop(shopData._id),
        reviewAPI.getShopReviews(shopData._id, { limit: 6 }),
      ]);

      setProducts(prodRes.data.products || []);

      const mappedReviews = (reviewRes.data.reviews || []).map((review) => ({
        id: review._id,
        name: review.userId?.name || 'Guest',
        avatar: review.userId?.profileImage || `https://i.pravatar.cc/150?u=${review._id}`,
        rating: review.rating || 0,
        comment: review.comment || '',
        date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently',
      }));

      setReviews(mappedReviews.length ? mappedReviews : []);
      setReviewCount(reviewRes.data.total || shopData.reviewCount || 0);
    } catch (err) {
      console.error('Failed to load shop data:', err);
      toast.error('Unable to load shop details');
    } finally {
      setLoadingShop(false);
    }
  };

  useEffect(() => {
    loadCafePageData();
  }, [params.id]);

  // Merge API data into the same shape used by the page (fallback to mock)
  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (typeof photo === 'string') return resolveImageUrl(photo);
    return resolveImageUrl(photo.url || photo.path || String(photo));
  };

  const cafeData = shop
    ? (() => {
        const grouped = {};
        (products || []).forEach((p) => {
          const cat = p.category || 'Others';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push({ id: p._id, name: p.name, price: p.price, image: p.imageUrl || p.image, isVeg: p.isVeg, popular: p.popular });
        });
        return {
          id: shop._id,
          name: shop.name || fallbackData.name,
          shortName: shop.shortName || fallbackData.shortName,
          rating: shop.rating || fallbackData.rating,
          reviewCount: reviewCount || shop.reviewCount || fallbackData.reviewCount,
          cuisineTypes: shop.category ? [shop.category] : fallbackData.cuisineTypes,
          deliveryTime: shop.deliveryTime || fallbackData.deliveryTime,
          distance: shop.distance || fallbackData.distance,
          location: shop.location?.address || fallbackData.location,
          openTime: shop.timings?.open || fallbackData.openTime,
          closeTime: shop.timings?.close || fallbackData.closeTime,
          isOpen: shop.isVisible !== undefined ? shop.isVisible : fallbackData.isOpen,
          coverImage: shop.coverImage || fallbackData.coverImage,
          logo: shop.logo || fallbackData.logo,
          description: shop.description || fallbackData.description,
          features: shop.features || fallbackData.features,
          tags: shop.tags || fallbackData.tags,
          popularDishes: (products || []).filter(p => p.popular).map(p => p.name).slice(0,4) || fallbackData.popularDishes,
          menu: Object.keys(grouped).length ? grouped : fallbackData.menu,
          offers: shop.offers || fallbackData.offers,
          reviews: reviews.length ? reviews : fallbackData.reviews,
          photos: (shop.gallery || fallbackData.photos).map(getPhotoUrl).filter(Boolean),
          fontFamily: shop.fontFamily || shop.fontStyle || null,
        };
      })()
    : fallbackData;

  const categories = ["all", ...Object.keys(cafeData.menu)];
  const filteredMenu = selectedCategory === "all" 
    ? Object.values(cafeData.menu).flat() 
    : cafeData.menu[selectedCategory] || [];

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

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please login to submit a review');
      navigate('/login/customer');
      return;
    }

    if (user?.role !== 'customer') {
      toast.error('Only customers can submit reviews');
      return;
    }

    if (!ratingValue) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Please write your review');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewAPI.addReview({ shopId: params.id, rating: ratingValue, comment: reviewComment.trim() });
      toast.success('Thank you! Your review has been submitted.');
      setRatingValue(0);
      setReviewComment('');
      await loadCafePageData();
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error('Error submitting review:', err);
      const message = err.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const scrollToSection = (section, ref) => {
    setActiveTab(section);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const featureCards = [
    { icon: Zap, title: "Fast Delivery", description: "25-30 mins delivery", color: "orange" },
    { icon: GraduationCap, title: "Student Friendly", description: "Budget prices", color: "green" },
    { icon: Gift, title: "Exclusive Offers", description: "15% off on orders", color: "purple" },
    { icon: Wallet, title: "Budget Friendly", description: "Meals under ₹150", color: "blue" }
  ];

  const requestOwnership = async () => {
    if (!shop) return;
    try {
      await shopAPI.requestOwnership(shop._id, { note: 'User requested ownership' });
      toast.success('Ownership request sent to admin');
    } catch (err) {
      console.error('Ownership request failed:', err);
      toast.error('Failed to send ownership request');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]" style={{ fontFamily: cafeData.fontFamily || "Poppins, sans-serif" }}>
      {/* Hero Section */}
      <div className="relative h-[420px] overflow-hidden">
        <img 
          src={resolveImageUrl(cafeData.coverImage)} 
          alt={cafeData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-5 right-5 flex gap-3 items-center">
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
          {/* Owner Controls: Edit or Request Ownership */}
          {!loadingShop && user?.role === 'shopowner' && (
            String(user?.shopId) === String(cafeData.id) ? (
              <button
                onClick={() => navigate('/shop/cafe/dashboard')}
                className="ml-2 px-3 py-2 bg-white text-[#FF7A00] rounded-full font-semibold shadow-sm hover:bg-white/90 transition"
              >
                Open Dashboard
              </button>
            ) : (
              <button
                onClick={requestOwnership}
                className="ml-2 px-3 py-2 bg-white text-[#FF7A00] rounded-full font-semibold shadow-sm hover:bg-white/90 transition"
              >
                Request Ownership
              </button>
            )
          )}
        </div>

        {/* Cafe Info Overlay */}
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
                <img src={resolveImageUrl(cafeData.logo)} alt={cafeData.name} className="w-full h-full object-cover" />
              </motion.div>
              
              {/* Text Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    {cafeData.isOpen ? "OPEN" : "CLOSED"}
                  </span>
                  <span className="text-white/80 text-sm">Closes at {cafeData.closeTime}</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">{cafeData.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                  <div className="flex items-center gap-1.5">
                    <Star className="fill-yellow-400 text-yellow-400" size={16} />
                    <span className="font-semibold">{cafeData.rating}</span>
                    <span className="text-white/70">({cafeData.reviewCount} reviews)</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{cafeData.deliveryTime}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>{cafeData.distance}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <span>{cafeData.cuisineTypes.join(" · ")}</span>
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
          {cafeData.tags.map((tag, index) => (
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
              <div className="flex gap-6 border-b border-[#ECECEC]">
                {[
                  { id: "menu", label: "Menu", ref: menuRef },
                  { id: "reviews", label: `Reviews (${cafeData.reviewCount})`, ref: reviewsRef },
                  { id: "photos", label: "Photos", ref: photosRef },
                  { id: "about", label: "About", ref: aboutRef }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id, tab.ref)}
                    className={`pb-3 text-base font-medium transition-all duration-300 relative ${
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
                    transition={{ delay: index * 0.05 }}
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
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1E1E1E]">What people say</h2>
                  <p className="text-sm text-[#6B7280] mt-1">Tell others about your visit.</p>
                </div>
                <button className="text-[#FF7A00] font-semibold text-sm">View all {cafeData.reviewCount} →</button>
              </div>

              <div className="bg-[#F8FAFC] rounded-3xl p-5 border border-[#E2E8F0] mb-6">
                <p className="font-semibold text-[#1E293B] mb-3">Share your experience</p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRatingValue(value)}
                        className={`text-2xl transition-all ${ratingValue >= value ? 'text-yellow-400 scale-110' : 'text-gray-300 hover:text-yellow-400'}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-sm text-[#475569]">{ratingValue} / 5</span>
                  </div>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write what you liked about this cafe..."
                    className="w-full rounded-3xl border border-[#CBD5E1] bg-white px-4 py-3 text-sm text-[#334155] focus:border-[#F97316] focus:outline-none focus:ring-2 focus:ring-[#FBD38D] transition"
                  />
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                    className="inline-flex items-center justify-center rounded-3xl bg-[#F97316] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {cafeData.reviews.map((review, index) => (
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
                    <p className="text-sm text-[#6B7280] leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Photos Section */}
            <div ref={photosRef} className="pt-8">
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-5">Cafe Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cafeData.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img src={photo} alt={`Cafe ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div ref={aboutRef} className="pt-8 pb-12">
              <h2 className="text-2xl font-bold text-[#1E1E1E] mb-4">About this cafe</h2>
              <p className="text-[#6B7280] leading-relaxed mb-6">{cafeData.description}</p>
              <div className="flex flex-wrap gap-2">
                {cafeData.popularDishes.map((dish, index) => (
                  <span key={index} className="px-3 py-1.5 bg-white border border-[#ECECEC] rounded-full text-sm text-[#6B7280]">
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Offer Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#FF7A00] to-[#FFA94D] rounded-3xl p-6 text-white"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold">{cafeData.offers.title}</h3>
                <Gift size={24} className="opacity-80" />
              </div>
              <p className="text-2xl font-bold mb-1">{cafeData.offers.discount}</p>
              <p className="text-sm opacity-90 mb-4">Valid on orders above ₹{cafeData.offers.minOrder}</p>
              <div className="bg-white/20 backdrop-blur rounded-2xl p-3 flex items-center justify-between">
                <code className="font-mono text-sm font-semibold">Use code: {cafeData.offers.code}</code>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(cafeData.offers.code);
                    toast.success("Code copied!");
                  }}
                  className="px-3 py-1 bg-white text-[#FF7A00] rounded-lg text-xs font-semibold hover:bg-opacity-90 transition"
                >
                  Copy
                </button>
              </div>
            </motion.div>

            {/* Cafe Timings */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-4 flex items-center gap-2">
                <Clock size={18} className="text-[#FF7A00]" />
                Cafe Timings
              </h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[#6B7280]">Monday - Sunday</span>
                <span className="font-semibold text-green-600">OPEN</span>
              </div>
              <p className="text-[#1E1E1E] font-medium">{cafeData.openTime} - {cafeData.closeTime}</p>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-[#FF7A00]" />
                Location
              </h3>
              <p className="text-[#6B7280] text-sm mb-4">{cafeData.location}</p>
              <div className="rounded-2xl overflow-hidden mb-4 h-32 bg-gray-100">
                <img 
                  src="https://maps.googleapis.com/maps/api/staticmap?center=KIT+College,Kolhapur&zoom=14&size=400x200&markers=color:orange%7CKIT+College,Kolhapur&key=YOUR_API_KEY"
                  alt="Map"
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://placehold.co/400x200/f0f0f0/999?text=Map+View"}
                />
              </div>
              <button className="w-full py-2.5 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-sm hover:bg-[#FF7A00] hover:text-white transition">
                View on Map
              </button>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-3">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#6B7280] text-sm">
                  <Phone size={16} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-[#6B7280] text-sm">
                  <Mail size={16} />
                  <span>brewhouse@mahii.com</span>
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
                <button className="w-full py-3 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-left px-4">
                  📞 Call Customer Support
                </button>
                <button className="w-full py-3 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-left px-4">
                  💬 Live Chat
                </button>
                <button className="w-full py-3 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-left px-4">
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
      `}</style>
    </div>
  );
};

export default CafePage;