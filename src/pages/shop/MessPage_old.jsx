import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shopAPI, productAPI, subscriptionAPI, attendanceAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaRupeeSign, FaCalendarAlt, FaQrcode, FaTag } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
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
      
      const options = {
        key: response.data.razorpayKey,
        order_id: response.data.razorpayOrderId,
        handler: async (payment) => {
          await subscriptionAPI.activateSubscription(response.data.subscription.id, {
            paymentId: payment.razorpay_payment_id,
            razorpayOrderId: payment.razorpay_order_id,
            signature: payment.razorpay_signature,
          });
          toast.success('Subscription activated!');
          fetchActiveSubscription();
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: '#f97316' },
      };

      await loadRazorpayScript();
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Subscription failed');
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!shop) {
    return <div className="text-center py-20 text-gray-600">Shop not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* HEADER WITH COVER IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={shop.coverImage || 'https://via.placeholder.com/1200x500'}
          alt={shop.name}
          className="h-80 w-full object-cover brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-custom mx-auto mb-8 rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl text-white shadow-2xl sm:p-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-orange-300">{shop.category || 'Mess'} Experience</p>
              <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{shop.name}</h1>
              <p className="mt-4 max-w-xl text-sm text-gray-100 sm:text-base">{shop.description || 'Fresh meals, friendly pricing and a cozy place for students to enjoy daily attendance, food and offers.'}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Rating</p>
                  <p className="mt-2 text-xl font-semibold">{shop.rating || 'New'} ★</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Reviews</p>
                  <p className="mt-2 text-xl font-semibold">{shop.reviewCount || 0}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Location</p>
                  <p className="mt-2 text-xl font-semibold">{shop.location?.area || 'Nearby'}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-300">Open</p>
                  <p className="mt-2 text-xl font-semibold">{shop.timings?.open || '--'} - {shop.timings?.close || '--'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* SUBSCRIPTION PLANS */}
            {plans.length > 0 && (
              <section className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Subscription Plans</h2>
                    <p className="mt-2 text-sm text-gray-600">Choose a meal plan that works for you.</p>
                  </div>
                  {activeSubscription && (
                    <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold uppercase text-green-700">✓ Active</span>
                  )}
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <motion.div
                      key={plan._id}
                      className={`rounded-3xl border-2 p-6 transition-all ${
                        activeSubscription?._id === plan._id
                          ? 'border-orange-500 bg-orange-50 shadow-lg'
                          : 'border-gray-100 bg-white hover:border-orange-200'
                      }`}
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{plan.mealsPerDay} meals/day</p>
                        </div>
                        {activeSubscription?._id === plan._id && (
                          <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">Active</span>
                        )}
                      </div>
                      <div className="mt-4">
                        <div className="text-3xl font-bold text-gray-900">₹{plan.price}</div>
                        <p className="text-xs text-gray-500 mt-1">per {plan.type || 'month'}</p>
                      </div>
                      <div className="mt-5 space-y-2 text-sm text-gray-600">
                        <p>• {plan.totalMeals} total meals</p>
                        <p>• {plan.mealsPerDay} meals per day</p>
                        <p>• Flexible cancellation</p>
                      </div>
                      <button
                        onClick={() => handleSubscribe(plan)}
                        disabled={activeSubscription?._id === plan._id}
                        className={`mt-6 w-full py-2.5 rounded-2xl font-semibold transition-all ${
                          activeSubscription?._id === plan._id
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        {activeSubscription?._id === plan._id ? 'Current Plan' : 'Subscribe Now'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* COUPONS & OFFERS */}
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaTag className="text-red-500" /> Offers & Coupons
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">Exclusive deals to save more on your meals.</p>
                </div>
                <span className="rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-red-700">Limited Time</span>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(shop.offers && shop.offers.length > 0
                  ? shop.offers
                  : [
                      { title: 'Welcome Offer', description: 'Get 30% off on your first subscription', discount: '30%', code: 'WELCOME30' },
                      { title: 'Referral Bonus', description: 'Invite friends and get ₹200 credits', discount: '₹200', code: 'REFER200' },
                      { title: 'Yearly Discount', description: 'Subscribe for a year, save 15%', discount: '15%', code: 'YEARLY15' },
                      { title: 'Student Offer', description: 'Show your ID and get extra discount', discount: 'Varies', code: 'STUDENT' },
                    ]
                ).map((offer, idx) => (
                  <motion.div
                    key={idx}
                    className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 p-5"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                      </div>
                      <div className="rounded-full bg-orange-500 text-white px-3 py-1 text-sm font-bold text-center">{offer.discount || 'Special'}</div>
                    </div>
                    {offer.code && (
                      <div className="mt-4 flex items-center gap-3 bg-white rounded-2xl p-3 border border-orange-200">
                        <code className="flex-1 font-mono text-sm font-semibold text-gray-900">{offer.code}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(offer.code);
                            toast.success('Code copied!');
                          }}
                          className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded-lg"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* WEEKLY MENU */}
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Weekly Menu</h2>
                  <p className="mt-2 text-sm text-gray-600">Plan your meals for the week.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm text-orange-700">
                  <FaCalendarAlt /> Updated daily
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-4 bg-gray-50 text-sm uppercase tracking-[0.18em] text-gray-500">
                  <div className="p-4">Day</div>
                  <div className="p-4">Breakfast</div>
                  <div className="p-4">Lunch</div>
                  <div className="p-4">Dinner</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {weeklyMenu.map((item) => (
                    <div key={item.day} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 sm:p-5 items-center hover:bg-orange-50/30 transition">
                      <div className="font-semibold text-gray-900">{item.day}</div>
                      <div className="text-sm text-gray-700">{item.breakfast || '—'}</div>
                      <div className="text-sm text-gray-700">{item.lunch || '—'}</div>
                      <div className="text-sm text-gray-700">{item.dinner || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* POPULAR DISHES & INFO */}
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold">Popular Dishes</h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  {(shop.popularDishes || ['Chicken Maggi', 'Paneer Butter Masala', 'Veg Thali']).map((dish, idx) => (
                    <span key={idx} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition">{dish}</span>
                  ))}
                </div>
                <div className="mt-6 rounded-3xl bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">Cuisines</p>
                  <p className="mt-2 text-sm text-gray-600">{shop.cuisines?.join(', ') || 'North Indian, South Indian'}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold">Shop Information</h3>
                <div className="mt-4 space-y-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                    <span>{shop.location?.address || `${shop.location?.area}, ${shop.location?.city}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-orange-500 flex-shrink-0" />
                    <span>{shop.timings?.open || '--'} - {shop.timings?.close || '--'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-orange-500 flex-shrink-0" />
                    <span>{shop.contactNumber || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRupeeSign className="text-orange-500 flex-shrink-0" />
                    <span>Cost for two: ₹{shop.costForTwo || 0}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">
            {/* ATTENDANCE TRACKING */}
            <motion.div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Attendance</h3>
                  <p className="text-sm text-gray-500">Track meal check-ins</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Live</span>
              </div>
              <div className="mt-5 space-y-3">
                {user?.role === 'customer' ? (
                  activeSubscription ? (
                    <div className="space-y-3">
                      <div className="rounded-3xl bg-gradient-to-r from-orange-50 to-yellow-50 p-4 border border-orange-200">
                        <p className="text-xs text-gray-500 font-semibold">ACTIVE PLAN</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{activeSubscription.planName}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm text-gray-600">📊 Meals Left</p>
                          <p className="text-lg font-bold text-orange-600">{activeSubscription.mealsRemaining}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {['breakfast', 'lunch', 'dinner'].map((meal) => (
                          <div key={meal} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                            <span className="font-medium text-gray-700 capitalize">{meal}</span>
                            <span className={`font-semibold flex items-center gap-1 ${todayAttendance[meal]?.status === 'present' ? 'text-green-600' : 'text-gray-400'}`}>
                              {todayAttendance[meal]?.status === 'present' ? '✓ Marked' : '○ Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl bg-blue-50 border border-blue-200 p-4 text-center">
                      <p className="text-sm font-semibold text-gray-800">🎯 No Active Plan</p>
                      <p className="text-xs text-gray-600 mt-2">Subscribe above to start tracking</p>
                    </div>
                  )
                ) : (
                  <div className="rounded-3xl bg-gray-50 border border-gray-200 p-4 text-center">
                    <p className="text-sm text-gray-600">Login as student to track</p>
                    <button
                      onClick={() => navigate('/login/customer')}
                      className="mt-3 w-full py-2 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition"
                    >
                      Login Now
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* QR CODE */}
            <motion.div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Quick Access</h3>
                  <p className="text-sm text-gray-500">Share this shop</p>
                </div>
                <FaQrcode className="text-orange-500 text-2xl" />
              </div>
              <div className="mt-5 rounded-3xl bg-gray-50 p-4 text-center border border-gray-200">
                {qrImage ? (
                  <img src={qrImage} alt="Shop QR Code" className="mx-auto h-48 w-48 rounded-2xl object-cover" />
                ) : (
                  <p className="text-sm text-gray-500">QR unavailable</p>
                )}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shopUrl);
                  toast.success('Link copied!');
                }}
                className="mt-4 w-full py-2.5 rounded-lg border border-orange-200 bg-orange-50 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition"
              >
                Copy Shop Link
              </button>
            </motion.div>

            {/* HELP & SUPPORT */}
            <motion.div className="rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
              <h3 className="text-lg font-semibold">Need Help?</h3>
              <p className="text-sm text-white/90 mt-2">Reach out for queries or issues</p>
              <div className="mt-4 space-y-2">
                <button className="w-full py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-sm font-semibold transition">
                  📞 Call Support
                </button>
                <button className="w-full py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-sm font-semibold transition">
                  💬 Message Us
                </button>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MessPage;
