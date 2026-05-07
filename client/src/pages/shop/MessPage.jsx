import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shopAPI, productAPI, subscriptionAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
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
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShopData();
  }, [id]);

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
      
      // Redirect to payment
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
          navigate('/my-subscriptions');
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

  const weeklyMenu = [
    { day: 'Monday', breakfast: 'Poha', lunch: 'Dal Roti', dinner: 'Sabzi Roti' },
    { day: 'Tuesday', breakfast: 'Upma', lunch: 'Chole Bhature', dinner: 'Paneer Rice' },
    { day: 'Wednesday', breakfast: 'Idli Sambhar', lunch: 'Rajma Chawal', dinner: 'Mix Veg Roti' },
    { day: 'Thursday', breakfast: 'Dosa', lunch: 'Kadhi Chawal', dinner: 'Dal Makhani' },
    { day: 'Friday', breakfast: 'Paratha', lunch: 'Biryani', dinner: 'Sabzi Roti' },
    { day: 'Saturday', breakfast: 'Puri Sabzi', lunch: 'Thali', dinner: 'Special Dinner' },
    { day: 'Sunday', breakfast: 'Chilla', lunch: 'Festival Meal', dinner: 'Light Dinner' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!shop) {
    return <div className="text-center py-20">Shop not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Banner */}
      <div className="relative h-64 md:h-96">
        <img
          src={shop.coverImage || 'https://via.placeholder.com/1200x400'}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container-custom">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{shop.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{shop.rating || 'New'} ({shop.reviewCount || 0} reviews)</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-1" />
                <span>{shop.location?.area}, {shop.location?.city}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="mr-1" />
                <span>{shop.timings?.open} - {shop.timings?.close}</span>
              </div>
              {shop.pureVeg && (
                <span className="bg-green-500 px-2 py-1 rounded text-xs">Pure Veg</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Subscription Plans */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`card p-6 cursor-pointer ${
                      selectedPlan === index ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setSelectedPlan(index)}
                  >
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-primary-500 mb-2">
                      ₹{plan.price}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {plan.mealsPerDay} meals/day • {plan.totalMeals} total meals
                    </p>
                    <p className="text-green-500 text-sm">Save {plan.savings}</p>
                    <button
                      onClick={() => handleSubscribe(plan)}
                      className="mt-4 w-full btn-primary text-sm py-2"
                    >
                      Subscribe Now
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weekly Menu */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Weekly Menu</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="p-3 text-left">Day</th>
                      <th className="p-3 text-left">Breakfast</th>
                      <th className="p-3 text-left">Lunch</th>
                      <th className="p-3 text-left">Dinner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyMenu.map((item) => (
                      <tr key={item.day} className="border-b dark:border-gray-700">
                        <td className="p-3 font-semibold">{item.day}</td>
                        <td className="p-3">{item.breakfast}</td>
                        <td className="p-3">{item.lunch}</td>
                        <td className="p-3">{item.dinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Mess Information</h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1" />
                  <span>{shop.location?.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone />
                  <span>{shop.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaRupeeSign />
                  <span>Monthly: ₹2,500 - ₹3,500</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>Subscription starts from any date</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <h4 className="font-semibold mb-2">Features</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>✓ Home-style food</li>
                  <li>✓ Clean & Hygienic</li>
                  <li>✓ Flexible timing</li>
                  <li>✓ Student friendly prices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessPage;