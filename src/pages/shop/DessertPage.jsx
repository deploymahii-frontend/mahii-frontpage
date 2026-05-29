import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Clock, 
  MapPin, 
  Share2, 
  Heart, 
  ChevronLeft,
  Cake,
  IceCream,
  Gift,
  Plus,
  Minus,
  MessageCircle,
  X,
  Check,
  Phone,
  Mail,
  Award,
  Sparkles,
  Cookie
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/media';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const DessertPage = () => {
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

  const dessertData = {
    id: 1,
    name: 'Sweet Haven',
    shortName: 'Sweet Haven',
    rating: 4.8,
    reviewCount: 567,
    cuisineTypes: ['Desserts', 'Ice Cream', 'Pastries', 'Beverages'],
    deliveryTime: '30-35 mins',
    distance: '1.5 km',
    location: 'Near Rankala Lake, Kolhapur, Maharashtra 416012',
    openTime: '11:00 AM',
    closeTime: '11:00 PM',
    isOpen: true,
    coverImage: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=140&h=140&fit=crop',
    description: 'Sweet Haven is a paradise for dessert lovers! Indulge in our handcrafted cakes, artisanal pastries, creamy ice creams, and decadent desserts. Every bite is a celebration of sweetness and quality ingredients.',
    features: ['Freshly Baked', 'Premium Ingredients', 'Custom Cakes', 'Party Orders'],
    tags: ['Best Desserts', 'Birthday Special', 'Handcrafted', 'Premium Quality'],
    popularDishes: ['Chocolate Truffle Cake', 'Belgian Dark Chocolate', 'Red Velvet Pastry', 'Gulab Jamun Cheesecake'],
    menu: {
      Cakes: [
        { id: 1, name: 'Chocolate Truffle Cake', price: 499, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9580?w=300&h=200&fit=crop', isVeg: true, popular: true, description: 'Rich chocolate truffle with ganache' },
        { id: 2, name: 'Red Velvet Cake', price: 599, image: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=300&h=200&fit=crop', isVeg: true, popular: true },
        { id: 3, name: 'Black Forest Cake', price: 549, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9580?w=300&h=200&fit=crop', isVeg: true },
        { id: 4, name: 'Pineapple Cake', price: 449, image: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=300&h=200&fit=crop', isVeg: true },
        { id: 5, name: 'Butterscotch Cake', price: 549, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9580?w=300&h=200&fit=crop', isVeg: true },
        { id: 6, name: 'Strawberry Cake', price: 599, image: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?w=300&h=200&fit=crop', isVeg: true }
      ],
      Pastries: [
        { id: 7, name: 'Chocolate Pastry', price: 89, image: 'https://images.unsplash.com/photo-1559617311-a8c5293c8e5a?w=300&h=200&fit=crop', isVeg: true, popular: true },
        { id: 8, name: 'Red Velvet Pastry', price: 99, image: 'https://images.unsplash.com/photo-1559617311-a8c5293c8e5a?w=300&h=200&fit=crop', isVeg: true, popular: true },
        { id: 9, name: 'Black Forest Pastry', price: 89, image: 'https://images.unsplash.com/photo-1559617311-a8c5293c8e5a?w=300&h=200&fit=crop', isVeg: true },
        { id: 10, name: 'Blueberry Cheesecake', price: 149, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop', isVeg: true, popular: true },
        { id: 11, name: 'Biscoff Cheesecake', price: 159, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop', isVeg: true },
        { id: 12, name: 'New York Cheesecake', price: 169, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop', isVeg: true }
      ],
      'Ice Creams': [
        { id: 13, name: 'Belgian Chocolate', price: 129, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop', isVeg: true, popular: true },
        { id: 14, name: 'Strawberry Bliss', price: 119, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop', isVeg: true },
        { id: 15, name: 'Vanilla Dream', price: 99, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop', isVeg: true },
        { id: 16, name: 'Mango Tango', price: 119, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop', isVeg: true },
        { id: 17, name: 'Butterscotch', price: 129, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop', isVeg: true },
        { id: 18, name: 'Pistachio Delight', price: 139, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop', isVeg: true }
      ],
      'Brownies & Cakesicles': [
        { id: 19, name: 'Chocolate Brownie', price: 79, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop', isVeg: true, popular: true },
        { id: 20, name: 'Walnut Brownie', price: 89, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop', isVeg: true },
        { id: 21, name: 'Cakesicle - Rainbow', price: 99, image: 'https://images.unsplash.com/photo-1587313421256-9e1748f2f7ea?w=300&h=200&fit=crop', isVeg: true },
        { id: 22, name: 'Cakesicle - Chocolate', price: 99, image: 'https://images.unsplash.com/photo-1587313421256-9e1748f2f7ea?w=300&h=200&fit=crop', isVeg: true }
      ],
      'Indian Sweets': [
        { id: 23, name: 'Gulab Jamun', price: 99, image: 'https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=300&h=200&fit=crop', isVeg: true, popular: true },
        { id: 24, name: 'Rasmalai', price: 129, image: 'https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=300&h=200&fit=crop', isVeg: true, popular: true },
        { id: 25, name: 'Jalebi', price: 79, image: 'https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=300&h=200&fit=crop', isVeg: true },
        { id: 26, name: 'Kaju Katli', price: 199, image: 'https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=300&h=200&fit=crop', isVeg: true },
        { id: 27, name: 'Mysore Pak', price: 149, image: 'https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=300&h=200&fit=crop', isVeg: true },
        { id: 28, name: 'Motichoor Laddoo', price: 119, image: 'https://images.unsplash.com/photo-1602524819890-2ef4d36afabd?w=300&h=200&fit=crop', isVeg: true }
      ],
      Beverages: [
        { id: 29, name: 'Cold Coffee', price: 129, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=200&fit=crop', isVeg: true },
        { id: 30, name: 'Hot Chocolate', price: 149, image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300&h=200&fit=crop', isVeg: true, popular: true },
        { id: 31, name: 'Chocolate Shake', price: 159, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop', isVeg: true },
        { id: 32, name: 'Strawberry Shake', price: 149, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop', isVeg: true }
      ]
    },
    offers: [
      { title: 'Birthday Special', discount: 'Get 15% OFF on whole cakes', code: 'BIRTHDAY15', minOrder: 499 },
      { title: 'Sweet Tooth', discount: 'Buy 2 Get 1 Free on Pastries', code: 'SWEET3', minOrder: 150 },
      { title: 'First Order', discount: '10% OFF up to ₹150', code: 'DESSERT10', minOrder: 299 }
    ],
    reviews: [
      { id: 1, name: 'Meera Joshi', rating: 5.0, date: '1 day ago', comment: 'Absolutely divine desserts! The chocolate truffle cake is to die for. Best dessert place in Kolhapur!', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
      { id: 2, name: 'Kunal Desai', rating: 4.8, date: '3 days ago', comment: 'Amazing variety of cakes and pastries. The cheesecake is creamy and delicious. Highly recommend!', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
      { id: 3, name: 'Priya Shah', rating: 5.0, date: '5 days ago', comment: 'Ordered a custom cake for my birthday. It was beautiful and tasted incredible!', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
      { id: 4, name: 'Rahul Mehta', rating: 4.5, date: '1 week ago', comment: 'Great place for dessert lovers. The ice cream selection is fantastic.', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9580?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1587313421256-9e1748f2f7ea?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559617311-a8c5293c8e5a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop'
    ]
  };

  const categories = ['all', ...Object.keys(dessertData.menu)];
  const filteredMenu = selectedCategory === 'all'
    ? Object.values(dessertData.menu).flat()
    : dessertData.menu[selectedCategory] || [];

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

  const featureCards = [
    { icon: Cake, title: 'Freshly Baked', description: 'Daily fresh cakes', color: 'orange' },
    { icon: Award, title: 'Premium Quality', description: 'Best ingredients', color: 'green' },
    { icon: Sparkles, title: 'Custom Cakes', description: 'Made to order', color: 'purple' },
    { icon: Gift, title: 'Party Orders', description: 'Bulk discounts', color: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7F4] to-[#FFF8F0] font-['Poppins']">
      <div className="relative h-[380px] md:h-[420px] overflow-hidden">
          <img 
            src={resolveImageUrl(dessertData.coverImage)} 
          alt={dessertData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-white animate-pulse delay-1000"></div>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="absolute top-5 right-5 flex gap-3 z-10">
          <button 
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <Heart className={isWishlisted ? 'fill-red-500 text-red-500' : ''} size={20} />
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied!');
            }}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <Share2 size={18} />
          </button>
          {/* Owner dashboard access */}
          {user?.role === 'shopowner' && String(user?.shopId) === String(dessertData.id) && (
            <button
              onClick={() => navigate('/shop/dessert/dashboard')}
              className="ml-2 px-3 py-2 bg-white text-[#FF7A00] rounded-full font-semibold shadow-sm hover:bg-white/90 transition"
            >
              Open Dashboard
            </button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-5">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-white/90 backdrop-blur-lg rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50"
              >
                <img src={resolveImageUrl(dessertData.logo)} alt={dessertData.name} className="w-full h-full object-cover" />
              </motion.div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  <span className="px-2 md:px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    OPEN NOW
                  </span>
                  <span className="text-white/80 text-xs md:text-sm">Closes at {dessertData.closeTime}</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-white mb-2 flex items-center gap-2">
                  {dessertData.name}
                  <Sparkles size={24} className="text-yellow-300" />
                </h1>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/90 text-xs md:text-sm">
                  <div className="flex items-center gap-1.5">
                    <Star className="fill-yellow-400 text-yellow-400" size={14} />
                    <span className="font-semibold">{dessertData.rating}</span>
                    <span className="text-white/70">({dessertData.reviewCount} reviews)</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{dessertData.deliveryTime}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span>{dessertData.distance}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                  <span>{dessertData.cuisineTypes.slice(0, 2).join(' · ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-8 relative z-10">
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
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FFA94D] flex items-center justify-center mb-2 md:mb-3">
                <feature.icon size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-[#1E1E1E] text-xs md:text-sm">{feature.title}</h3>
              <p className="text-[10px] md:text-xs text-[#6B7280] mt-1">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {dessertData.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 md:px-4 md:py-1.5 bg-[#FF7A00]/10 text-[#FF7A00] text-xs font-semibold rounded-full flex items-center gap-1">
              <IceCream size={12} /> {tag}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div className="sticky top-0 bg-[#F8F7F4] z-20 pt-4 pb-2">
              <div className="flex gap-4 md:gap-6 border-b border-[#ECECEC] overflow-x-auto scrollbar-hide">
                {[
                  { id: 'menu', label: 'Menu', ref: menuRef },
                  { id: 'reviews', label: `Reviews (${dessertData.reviewCount})`, ref: reviewsRef },
                  { id: 'photos', label: 'Photos', ref: photosRef },
                  { id: 'about', label: 'About', ref: aboutRef }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id, tab.ref)}
                    className={`pb-3 text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap relative ${
                      activeTab === tab.id ? 'text-[#FF7A00]' : 'text-[#6B7280] hover:text-[#1E1E1E]'
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
            <div ref={menuRef} className="pt-4 md:pt-6">
              <div className="flex gap-2 overflow-x-auto pb-4 mb-4 md:mb-6 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFA94D] text-white shadow-lg'
                        : 'bg-white text-[#6B7280] border border-[#ECECEC] hover:border-[#FF7A00] hover:text-[#FF7A00]'
                    }`}
                  >
                    {category === 'all' ? '🍰 All Desserts' : category}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {filteredMenu.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC] hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative h-36 md:h-40">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      {item.popular && (
                        <span className="absolute top-2 left-2 md:top-3 md:left-3 px-1.5 py-0.5 md:px-2 md:py-0.5 bg-gradient-to-r from-[#FF7A00] to-[#FFA94D] text-white text-[10px] md:text-xs font-semibold rounded-full flex items-center gap-1">
                          <Sparkles size={10} /> Popular
                        </span>
                      )}
                      <button className="absolute top-2 right-2 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition">
                        <Heart size={12} className="text-[#6B7280]" />
                      </button>
                      {item.isVeg && (
                        <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px] md:text-[10px] font-bold">V</span>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-[#1E1E1E] text-sm md:text-base">{item.name}</h3>
                          {item.description && (
                            <p className="text-[10px] md:text-xs text-[#6B7280] mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>
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
                View Full Menu →  🍪
              </button>
            </div>
            <div ref={reviewsRef} className="pt-6 md:pt-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#1E1E1E]">What sweet lovers say 💕</h2>
                <button className="text-[#FF7A00] font-semibold text-xs md:text-sm">View all {dessertData.reviewCount} →</button>
              </div>
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {dessertData.reviews.map((review, index) => (
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
            <div ref={photosRef} className="pt-6 md:pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-[#1E1E1E] mb-4 md:mb-5">Sweet Gallery 📸</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                {dessertData.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden cursor-pointer"
                  >
                    <img src={resolveImageUrl(photo)} alt={`Dessert ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition flex items-end justify-center p-2">
                      <span className="text-white text-xs font-medium">🍰</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div ref={aboutRef} className="pt-6 md:pt-8 pb-8 md:pb-12">
              <h2 className="text-xl md:text-2xl font-bold text-[#1E1E1E] mb-3 md:mb-4">About Sweet Haven 🧁</h2>
              <p className="text-sm md:text-base text-[#6B7280] leading-relaxed mb-5 md:mb-6">{dessertData.description}</p>
              <div className="mb-5 md:mb-6">
                <h3 className="font-semibold text-[#1E1E1E] mb-2 md:mb-3 text-sm md:text-base flex items-center gap-2">
                  <IceCream size={16} /> Popular Sweets
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dessertData.popularDishes.map((dish, index) => (
                    <span key={index} className="px-2 py-1 md:px-3 md:py-1.5 bg-white border border-[#ECECEC] rounded-full text-xs md:text-sm text-[#6B7280]">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#1E1E1E] mb-2 md:mb-3 text-sm md:text-base flex items-center gap-2">
                  <Award size={16} /> Why Sweet Haven?
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-[#6B7280]">
                    <Check size={14} className="text-green-500" />
                    <span>100% Eggless Cakes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-[#6B7280]">
                    <Check size={14} className="text-green-500" />
                    <span>Fresh Daily Bake</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-[#6B7280]">
                    <Check size={14} className="text-green-500" />
                    <span>Custom Designs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-[#6B7280]">
                    <Check size={14} className="text-green-500" />
                    <span>Free Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl md:rounded-3xl p-5 md:p-6 text-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg md:text-xl font-bold">🎂 Birthday Special!</h3>
                  <p className="text-xs md:text-sm opacity-90 mt-1">Celebrate with sweetness</p>
                </div>
                <Cake size={24} className="opacity-80" />
              </div>
              <p className="text-2xl md:text-3xl font-bold mb-1">15% OFF</p>
              <p className="text-xs md:text-sm opacity-90 mb-4">on whole cakes above ₹499</p>
              <div className="bg-white/20 backdrop-blur rounded-xl p-2 md:p-3 flex items-center justify-between">
                <code className="font-mono text-xs md:text-sm font-semibold">Code: BIRTHDAY15</code>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('BIRTHDAY15');
                    toast.success('Code copied!');
                  }}
                  className="px-2 py-1 bg-white text-pink-600 rounded-lg text-xs font-semibold"
                >
                  Copy
                </button>
              </div>
            </motion.div>
            <div className="space-y-3">
              {dessertData.offers.slice(0, 2).map((offer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-[#1E1E1E] text-sm md:text-base flex items-center gap-1">
                        <Gift size={14} className="text-[#FF7A00]" /> {offer.title}
                      </h4>
                      <p className="text-xs md:text-sm text-[#6B7280] mt-1">{offer.discount}</p>
                      {offer.minOrder > 0 && (
                        <p className="text-[10px] md:text-xs text-[#6B7280] mt-1">Min order ₹{offer.minOrder}</p>
                      )}
                    </div>
                    <Cookie size={16} className="text-[#FF7A00]" />
                  </div>
                  <div className="mt-3 bg-[#F8F7F4] rounded-xl p-2 flex items-center justify-between">
                    <code className="font-mono text-xs font-semibold text-[#1E1E1E]">{offer.code}</code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(offer.code);
                        toast.success('Code copied!');
                      }}
                      className="px-2 py-1 bg-[#FF7A00] text-white rounded-lg text-[10px] md:text-xs font-semibold"
                    >
                      Copy
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2 text-sm md:text-base">
                <Clock size={16} className="text-[#FF7A00]" />
                Opening Hours
              </h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm text-[#6B7280]">Monday - Sunday</span>
                <span className="font-semibold text-green-600 text-xs md:text-sm">OPEN</span>
              </div>
              <p className="text-sm md:text-base text-[#1E1E1E] font-medium">{dessertData.openTime} - {dessertData.closeTime}</p>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2 text-sm md:text-base">
                <MapPin size={16} className="text-[#FF7A00]" />
                Location
              </h3>
              <p className="text-xs md:text-sm text-[#6B7280] mb-4">{dessertData.location}</p>
              <div className="rounded-xl md:rounded-2xl overflow-hidden mb-4 h-28 md:h-32 bg-gray-100">
                <img 
                  src="https://maps.googleapis.com/maps/api/staticmap?center=Rankala+Lake,Kolhapur&zoom=14&size=400x200&markers=color:orange%7CRankala+Lake,Kolhapur&key=YOUR_API_KEY"
                  alt="Map"
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://placehold.co/400x200/f0f0f0/999?text=Map+View'}
                />
              </div>
              <button className="w-full py-2 bg-[#FFF7ED] text-[#FF7A00] rounded-xl font-semibold text-xs md:text-sm hover:bg-[#FF7A00] hover:text-white transition">
                Get Directions
              </button>
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#ECECEC]">
              <h3 className="font-semibold text-[#1E1E1E] mb-3 text-sm md:text-base">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#6B7280] text-xs md:text-sm">
                  <Phone size={14} className="text-[#FF7A00]" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-[#6B7280] text-xs md:text-sm">
                  <Mail size={14} className="text-[#FF7A00]" />
                  <span>sweethaven@mahii.com</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl p-4 md:p-5 text-white text-center">
              <Cake size={32} className="mx-auto mb-2" />
              <h3 className="font-bold text-sm md:text-base">Need a Custom Cake?</h3>
              <p className="text-xs opacity-90 mt-1">Order 48 hours in advance</p>
              <button className="mt-3 px-4 py-1.5 bg-white text-purple-600 rounded-lg text-xs font-semibold hover:bg-opacity-90 transition">
                Request Now →
              </button>
            </div>
          </div>
        </div>
      </div>
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
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: ['0 0 0 0 rgba(255,122,0,0.4)', '0 0 0 15px rgba(255,122,0,0)', '0 0 0 0 rgba(255,122,0,0)']
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#FF7A00] to-[#FFA94D] rounded-full flex flex-col items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300"
      >
        <MessageCircle size={20} className="text-white" />
        <span className="text-[7px] md:text-[8px] text-white font-medium mt-0.5">Help</span>
      </motion.button>
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
                <h3 className="text-lg md:text-xl font-bold text-[#1E1E1E]">Need help? 🍰</h3>
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

export default DessertPage;
