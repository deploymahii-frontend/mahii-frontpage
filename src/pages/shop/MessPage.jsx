import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { shopAPI, productAPI, subscriptionAPI, attendanceAPI, reviewAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaRupeeSign, FaCalendarAlt, 
  FaQrcode, FaTag, FaEdit, FaTimes, FaCheck, FaShareAlt, FaChevronRight,
  FaUtensils, FaAward, FaUsers, FaShieldAlt, FaHeart, FaRegHeart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Coffee, ForkKnife, Moon, Shield, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import { resolveImageUrl } from '../../utils/media';
import { loadRazorpayScript } from '../../utils/razorpay';

const MessPage = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState({ breakfast: null, lunch: null, dinner: null });
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const weeklyRef = useRef(null);
  const offersRef = useRef(null);
  const plansRef = useRef(null);
  const attendanceRef = useRef(null);
  const reviewRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShopData();
  }, [id]);

  useEffect(() => {
    if (user?.role === 'customer') {
      fetchActiveSubscription();
    } else {
      setActiveSubscription(null);
      setTodayAttendance({ breakfast: null, lunch: null, dinner: null });
    }
  }, [user, id]);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const [shopRes, productsRes, plansRes] = await Promise.all([
        shopAPI.getShopById(id),
        productAPI.getProductsByShop(id),
        subscriptionAPI.getPlans(id),
      ]);
      setShop(shopRes.data.shop);
      setProducts(productsRes.data.products);
      setPlans(plansRes.data.plans);
    } catch (error) {
      console.error('Error fetching shop data:', error);
      toast.error('Failed to load shop data');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSubscription = async () => {
    try {
      const response = await subscriptionAPI.getMySubscriptions();
      const active = response.data.subscriptions?.find((sub) => sub.isActive && sub.shopId?._id === id);
      setActiveSubscription(active || null);
      if (active) {
        fetchTodayAttendance(active._id);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  };

  const fetchTodayAttendance = async (subscriptionId) => {
    setAttendanceLoading(true);
    try {
      const response = await attendanceAPI.getMyAttendance(subscriptionId);
      const attendanceData = response.data.attendance || [];
      const today = new Date().toISOString().split('T')[0];
      const todayStatus = {
        breakfast: null,
        lunch: null,
        dinner: null,
      };

      attendanceData.forEach((record) => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        if (recordDate === today) {
          todayStatus[record.mealType] = record;
        }
      });

      setTodayAttendance(todayStatus);
    } catch (error) {
      console.error('Error fetching attendance status:', error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast.error('Please login to subscribe');
      navigate('/login/customer');
      return;
    }

    try {
      const response = await subscriptionAPI.createSubscription({
        shopId: id,
        planType: plan.type,
        planName: plan.name,
        price: plan.price,
        mealsPerDay: plan.mealsPerDay,
        totalMeals: plan.totalMeals,
        startDate: new Date(),
      });
      
      toast.success('Subscription request sent! Your request has been sent to the owner. Please wait 2-3 days for approval.', {
        duration: 5000,
      });
      
      fetchActiveSubscription();
      fetchShopData();
    } catch (error) {
      console.error('Error creating subscription:', error);
      const rawMessage = error.response?.data?.message;
      const fallback = 'Failed to request subscription';
      const message = typeof rawMessage === 'string' && /server/i.test(rawMessage)
        ? 'Your request has been sent to the owner. Please wait 2-3 days for approval.'
        : rawMessage || fallback;
      toast.error(message);
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setEditFormData({
      name: plan.name,
      price: plan.price,
      mealsPerDay: plan.mealsPerDay,
      totalMeals: plan.totalMeals,
      type: plan.type || 'monthly',
    });
    setEditModalOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;
    
    setUpdatingPlan(true);
    try {
      await subscriptionAPI.updatePlan(editingPlan._id, editFormData);
      toast.success('Plan updated successfully!');
      setEditModalOpen(false);
      setEditingPlan(null);
      fetchShopData();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Failed to update plan');
    } finally {
      setUpdatingPlan(false);
    }
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

    setSubmittingReview(true);
    try {
      await reviewAPI.addReview({ shopId: id, rating: ratingValue, comment: reviewComment.trim() });
      toast.success('Thank you! Your review has been submitted.');
      setRatingValue(0);
      setReviewComment('');
      fetchShopData();
    } catch (error) {
      console.error('Error submitting review:', error);
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingPlan(null);
    setEditFormData({});
  };

  const topOffers = (shop?.offers?.length > 0 ? shop.offers : [
    { title: 'Welcome Offer', description: 'Get 30% off on your first subscription', discount: '30%', code: 'WELCOME30' },
    { title: 'Referral Bonus', description: 'Invite friends and get ₹200 credits', discount: '₹200', code: 'REFER200' },
    { title: 'Yearly Discount', description: 'Subscribe for a year, save 15%', discount: '15%', code: 'YEARLY15' },
    { title: 'Student Offer', description: 'Show your ID and get extra discount', discount: 'Varies', code: 'STUDENT' },
  ]).slice(0, 2);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const defaultWeeklyMenu = [
    { day: 'Monday', breakfast: 'Poha', lunch: 'Dal Roti', dinner: 'Sabzi Roti' },
    { day: 'Tuesday', breakfast: 'Upma', lunch: 'Chole Bhature', dinner: 'Paneer Rice' },
    { day: 'Wednesday', breakfast: 'Idli Sambhar', lunch: 'Rajma Chawal', dinner: 'Mix Veg Roti' },
    { day: 'Thursday', breakfast: 'Dosa', lunch: 'Kadhi Chawal', dinner: 'Dal Makhani' },
    { day: 'Friday', breakfast: 'Paratha', lunch: 'Biryani', dinner: 'Sabzi Roti' },
    { day: 'Saturday', breakfast: 'Puri Sabzi', lunch: 'Thali', dinner: 'Special Dinner' },
    { day: 'Sunday', breakfast: 'Chilla', lunch: 'Festival Meal', dinner: 'Light Dinner' },
  ];

  const weeklyMenu = shop?.weeklyMenu?.length ? shop.weeklyMenu : defaultWeeklyMenu;
  const shopUrl = shop ? `${window.location.origin}/shop/${shop.category || 'mess'}/${shop._id}` : '';
  const qrValue = shop?.qrCodeData?.trim() || shopUrl;
  const qrImage = qrValue ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrValue)}` : '';

  const mealIcons = {
    breakfast: <Coffee size={18} />,
    lunch: <ForkKnife size={18} />,
    dinner: <Moon size={18} />
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaUtensils className="text-orange-400 text-2xl animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-medium">Loading delicious details...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
          <FaUtensils className="text-orange-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Shop not found</h2>
        <p className="text-gray-500 mt-2">The mess you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition">
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition-all duration-300"
        >
          ↑
        </motion.button>
      </div>

      {/* Hero Section with Modern Layout */}
      <div className="relative">
        {/* Background Cover */}
        <div className="relative h-24 sm:h-48 lg:h-[140px] overflow-hidden">
              {shop.coverImage ? (
            <>
              <img
                src={resolveImageUrl(shop.coverImage)}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-red-500" />
          )}
          
          {/* Floating Heart Button */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
          >
            {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-600" />}
          </button>
        </div>

        {/* Shop Info Card - Overlapping */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Category Badge & Name */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                    <FaUtensils size={12} /> {shop.category || 'Mess'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">{shop.name}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-green-50 px-3 py-2 rounded-2xl">
                    <FaStar className="text-yellow-500" />
                    <span className="font-bold text-gray-800">{shop.rating?.toFixed(1) || 'New'}</span>
                    <span className="text-xs text-gray-500">({shop.reviewCount || 0} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-3 text-sm sm:text-base leading-relaxed">
                {shop.description || 'Fresh meals, friendly pricing and a cozy place for students to enjoy daily attendance, food and offers.'}
              </p>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-orange-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{shop.location?.area || shop.location?.city || 'Nearby'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaClock className="text-orange-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Timings</p>
                    <p className="text-sm font-medium text-gray-800">{shop.timings?.open || '--'} - {shop.timings?.close || '--'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaRupeeSign className="text-orange-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost for two</p>
                    <p className="text-sm font-medium text-gray-800">₹{shop.costForTwo || 300}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaPhone className="text-orange-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm font-medium text-gray-800">{shop.contactNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => scrollToSection(plansRef)}
                  className="flex-1 sm:flex-none px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                >
                  Subscribe Now <FaChevronRight size={14} />
                </button>
                <button
                  onClick={() => scrollToSection(reviewRef)}
                  className="flex-1 sm:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  Write a Review <FaStar size={14} className="text-yellow-500" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shopUrl);
                    toast.success('Link copied!');
                  }}
                  className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                >
                  <FaShareAlt size={18} />
                </button>
                {user?.role === 'shopowner' && String(user?.shopId) === String(id) && (
                  <button
                    onClick={() => navigate('/shop/mess/dashboard')}
                    className="flex-1 sm:flex-none px-6 py-3 bg-white text-[#FF7A00] rounded-xl font-semibold border border-orange-200 hover:bg-orange-50 transition"
                  >
                    Open Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Tabs - Mobile Friendly */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-3">
            {[
              { label: 'Menu', ref: weeklyRef, icon: <FaUtensils size={14} /> },
              { label: 'Plans', ref: plansRef, icon: <FaCalendarAlt size={14} /> },
              { label: 'Offers', ref: offersRef, icon: <FaTag size={14} /> },
              { label: 'Attendance', ref: attendanceRef, icon: <FaClock size={14} /> },
              { label: 'Reviews', ref: reviewRef, icon: <FaStar size={14} /> },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => scrollToSection(tab.ref)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-full transition whitespace-nowrap"
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Menu Section */}
            <section ref={weeklyRef} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Weekly Menu</h2>
                    <p className="text-sm text-gray-500 mt-1">Fresh meals planned for every day</p>
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-semibold">
                    <FaCalendarAlt size={12} /> Updated Weekly
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Breakfast</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lunch</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dinner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {weeklyMenu.map((item, idx) => (
                      <tr key={item.day} className="hover:bg-orange-50/30 transition">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-800">{item.day}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.breakfast || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.lunch || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.dinner || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Subscription Plans Section */}
            {plans.length > 0 && (
              <section ref={plansRef} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
                    <p className="text-sm text-gray-500 mt-1">Choose a plan that fits your lifestyle</p>
                  </div>
                  {activeSubscription && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                      <CheckCircle size={14} /> Active Subscription
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {plans.map((plan) => {
                    const userSubscription = activeSubscription;
                    const isPending = userSubscription?.status === 'pending';
                    const isApproved = userSubscription?.isActive;
                    
                    return (
                      <motion.div
                        key={plan._id}
                        whileHover={{ y: -4 }}
                        className={`relative rounded-2xl p-5 transition-all duration-300 ${
                          isApproved
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg'
                            : isPending
                            ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 shadow-lg'
                            : 'bg-white border border-gray-200 hover:shadow-xl'
                        }`}
                      >
                        {isApproved && (
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-green-500 text-white rounded-full p-1">
                              <CheckCircle size={16} />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{plan.mealsPerDay} meals/day</p>
                          </div>
                          {user?.role === 'shopowner' && String(user?.shopId) === String(id) && (
                            <button
                              onClick={() => handleEditPlan(plan)}
                              className="p-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
                            >
                              <FaEdit size={14} />
                            </button>
                          )}
                        </div>
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                          <span className="text-sm text-gray-500">/{plan.type || 'month'}</span>
                        </div>
                        <div className="space-y-2 mb-5">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500" />
                            {plan.totalMeals} total meals
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500" />
                            {plan.mealsPerDay} meals per day
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500" />
                            Flexible cancellation
                          </p>
                        </div>
                        <button
                          onClick={() => handleSubscribe(plan)}
                          disabled={isApproved || isPending}
                          className={`w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                            isApproved
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : isPending
                              ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                              : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                          }`}
                        >
                          {isApproved && <><CheckCircle size={16} /> Active</>}
                          {isPending && <><Clock size={16} /> Pending Approval</>}
                          {!isApproved && !isPending && 'Request Subscription'}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Attendance Section */}
            <section ref={attendanceRef} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Today's Attendance</h2>
                  <p className="text-sm text-gray-500 mt-1">Track your daily meal check-ins</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              {user?.role === 'customer' ? (
                activeSubscription ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-200">
                      <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Active Plan</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{activeSubscription.planName}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Meals Remaining</span>
                        <span className="text-2xl font-bold text-orange-600">{activeSubscription.mealsRemaining}</span>
                      </div>
                      <div className="mt-2 w-full bg-orange-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(activeSubscription.mealsRemaining / activeSubscription.totalMeals) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {['breakfast', 'lunch', 'dinner'].map((meal) => (
                        <div
                          key={meal}
                          className={`rounded-xl p-3 text-center transition-all ${
                            todayAttendance[meal]?.status === 'present'
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <div className="flex justify-center mb-1">
                            {mealIcons[meal]}
                          </div>
                          <p className="text-sm font-medium capitalize text-gray-700">{meal}</p>
                          <p className={`text-xs font-semibold mt-1 ${
                            todayAttendance[meal]?.status === 'present' ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {todayAttendance[meal]?.status === 'present' ? '✓ Marked' : '○ Pending'}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => navigate('/dashboard/customer', { state: { tab: 'attendance' } })}
                      className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
                    >
                      View Full Dashboard <FaChevronRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-blue-50 rounded-2xl">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield size={28} className="text-blue-500" />
                    </div>
                    <p className="font-semibold text-gray-800">No Active Subscription</p>
                    <p className="text-sm text-gray-500 mt-1">Subscribe to a plan above to start tracking</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-2xl">
                  <p className="text-gray-600 mb-4">Login as a student to track your attendance</p>
                  <button
                    onClick={() => navigate('/login/customer')}
                    className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
                  >
                    Login Now
                  </button>
                </div>
              )}
            </section>

            {/* Offers Section */}
            <section ref={offersRef} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Gift size={22} className="text-orange-500" /> Hot Offers
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Grab these deals before they expire</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">Limited Time</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topOffers.map((offer, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 p-5 border border-orange-200"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200 rounded-full -mr-10 -mt-10 opacity-50" />
                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">{offer.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-xl text-sm font-bold">
                          {offer.discount || 'Special'}
                        </div>
                      </div>
                      {offer.code && (
                        <div className="mt-4 flex items-center gap-2 bg-white rounded-xl p-2 border border-orange-200">
                          <code className="flex-1 font-mono text-sm font-bold text-gray-800">{offer.code}</code>
                          {user ? (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(offer.code);
                                toast.success('Code copied!');
                              }}
                              className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition"
                            >
                              Copy
                            </button>
                          ) : (
                            <Link
                              to="/login/customer"
                              className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600 transition"
                            >
                              Login
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <section ref={reviewRef} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                  <p className="text-sm text-gray-500 mt-1">What people are saying</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-2xl">
                  <FaStar className="text-yellow-500" />
                  <span className="font-bold text-gray-800">{shop.rating?.toFixed(1) || 'New'}</span>
                  <span className="text-xs text-gray-500">({shop.reviewCount || 0})</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="font-semibold text-gray-800 mb-3">Write your review</p>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setRatingValue(value)}
                      className={`text-2xl transition-all ${
                        ratingValue >= value ? 'text-yellow-500 scale-110' : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">({ratingValue}/5)</span>
                </div>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this mess..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="mt-4 px-6 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50 w-full sm:w-auto"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* QR Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-2xl mb-4">
                <FaQrcode className="text-orange-500 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Scan & Order</h3>
              <p className="text-sm text-gray-500 mt-1">Share this QR with friends</p>
              {qrImage ? (
                <img src={qrImage} alt="Shop QR" className="mx-auto mt-4 w-40 h-40 rounded-2xl border-2 border-gray-200 p-2" />
              ) : (
                <div className="w-40 h-40 mx-auto mt-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <p className="text-xs text-gray-400">QR unavailable</p>
                </div>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shopUrl);
                  toast.success('Link copied!');
                }}
                className="mt-5 w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Copy Shop Link
              </button>
            </motion.div>

            {/* Popular Dishes */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FaUtensils className="text-orange-500" /> Popular Dishes
              </h3>
              <div className="flex flex-wrap gap-2">
                {(shop.popularDishes || ['Chicken Maggi', 'Paneer Butter Masala', 'Veg Thali', 'Biryani']).map((dish, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-600 transition cursor-pointer">
                    {dish}
                  </span>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-800 mb-2">Cuisines</p>
                <div className="flex flex-wrap gap-2">
                  {(shop.cuisines || ['North Indian', 'South Indian', 'Chinese']).map((cuisine, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Shield size={20} /> Why Choose Us?
              </h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle size={16} className="text-white/80" />
                  <span>Freshly prepared meals daily</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle size={16} className="text-white/80" />
                  <span>Affordable student pricing</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle size={16} className="text-white/80" />
                  <span>Hygienic kitchen environment</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle size={16} className="text-white/80" />
                  <span>Flexible subscription plans</span>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaPhone className="text-blue-500 text-xl" />
              </div>
              <h3 className="font-bold text-gray-900">Need Help?</h3>
              <p className="text-sm text-gray-500 mt-1">24/7 customer support</p>
              <div className="mt-4 space-y-2">
                <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                  📞 Call Support
                </button>
                <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                  💬 Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Plan Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseEditModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold text-gray-900">Edit Plan</h3>
                <button
                  onClick={handleCloseEditModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  disabled={updatingPlan}
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Name</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => handleEditFormChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    disabled={updatingPlan}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={editFormData.price || 0}
                    onChange={(e) => handleEditFormChange('price', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    disabled={updatingPlan}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Type</label>
                  <select
                    value={editFormData.type || 'monthly'}
                    onChange={(e) => handleEditFormChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition bg-white"
                    disabled={updatingPlan}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Meals Per Day</label>
                  <input
                    type="number"
                    value={editFormData.mealsPerDay || 0}
                    onChange={(e) => handleEditFormChange('mealsPerDay', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    disabled={updatingPlan}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Total Meals</label>
                  <input
                    type="number"
                    value={editFormData.totalMeals || 0}
                    onChange={(e) => handleEditFormChange('totalMeals', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    disabled={updatingPlan}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCloseEditModal}
                  disabled={updatingPlan}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePlan}
                  disabled={updatingPlan}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updatingPlan ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheck size={14} /> Update
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessPage;