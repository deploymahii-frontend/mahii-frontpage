import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI, productAPI, orderAPI, subscriptionAPI, attendanceAPI } from '../../services/api';
import { resolveImageUrl } from '../../utils/media';
import { ImagePlus, UploadCloud, QrCode, Star, Camera, Sparkles, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import ShopLayout from './ShopLayout';
import SubscriptionRequests from '../shopowner/SubscriptionRequests';

// Dashboard Components
import StatsCards from './components/dashboard/StatsCards';
import RevenueChart from './components/dashboard/RevenueChart';
import AttendanceChart from './components/dashboard/AttendanceChart';
import MealDistribution from './components/dashboard/MealDistribution';
import RecentOrdersTable from './components/dashboard/RecentOrdersTable';

const ShopDashboard = ({ categoryOverride }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    attendanceRate: 0,
  });

  const categoryLabels = {
    cafe: 'Cafe Dashboard',
    mess: 'Mess Dashboard',
    hotel: 'Hotel Dashboard',
    dessert: 'Dessert Dashboard',
    stall: 'Stall Dashboard',
  };

  const categoryThemes = {
    cafe: {
      overlay: 'from-orange-950/90 via-orange-900/40 to-orange-500/20',
      labelColor: 'text-orange-300',
      taglineColor: 'text-orange-200',
      cardBackground: 'bg-orange-950/30',
      cardBorder: 'border-orange-300/20',
      statTitle: 'text-orange-100',
      statValue: 'text-white',
    },
    mess: {
      overlay: 'from-emerald-950/90 via-emerald-900/40 to-emerald-500/20',
      labelColor: 'text-emerald-300',
      taglineColor: 'text-emerald-200',
      cardBackground: 'bg-emerald-950/30',
      cardBorder: 'border-emerald-300/20',
      statTitle: 'text-emerald-100',
      statValue: 'text-white',
    },
    hotel: {
      overlay: 'from-sky-950/90 via-sky-900/40 to-sky-500/20',
      labelColor: 'text-sky-300',
      taglineColor: 'text-sky-200',
      cardBackground: 'bg-sky-950/30',
      cardBorder: 'border-sky-300/20',
      statTitle: 'text-sky-100',
      statValue: 'text-white',
    },
    dessert: {
      overlay: 'from-fuchsia-950/90 via-fuchsia-900/40 to-fuchsia-500/20',
      labelColor: 'text-fuchsia-300',
      taglineColor: 'text-fuchsia-200',
      cardBackground: 'bg-fuchsia-950/30',
      cardBorder: 'border-fuchsia-300/20',
      statTitle: 'text-fuchsia-100',
      statValue: 'text-white',
    },
    stall: {
      overlay: 'from-amber-950/90 via-amber-900/40 to-amber-500/20',
      labelColor: 'text-amber-300',
      taglineColor: 'text-amber-200',
      cardBackground: 'bg-amber-950/30',
      cardBorder: 'border-amber-300/20',
      statTitle: 'text-amber-100',
      statValue: 'text-white',
    },
  };

  const getDashboardLabel = () => {
    const category = (categoryOverride || shop?.category || '').toLowerCase();
    return categoryLabels[category] || 'Shop Dashboard';
  };

  const categoryTaglines = {
    cafe: 'Serve perfect coffee and cafe snacks to every guest.',
    mess: 'Deliver wholesome meal plans and consistent daily meals.',
    hotel: 'Manage rooms, dining and premium guest services.',
    dessert: 'Keep cakes, ice creams and treats ready to delight.',
    stall: 'Serve fast bites and quick orders with ease.',
  };

  const getCategoryTagline = () => {
    const category = (categoryOverride || shop?.category || '').toLowerCase();
    return categoryTaglines[category] || 'Manage your shop, orders, offers and subscriptions from one place.';
  };

  const getHeroStats = () => {
    const category = (categoryOverride || shop?.category || '').toLowerCase();
    const beverageCount = products.filter((p) => (p.category || '').toLowerCase() === 'beverages').length;
    const dessertCount = products.filter((p) => (p.category || '').toLowerCase() === 'dessert').length;
    const facilityCount = (shop?.facilities || []).length;
    const roomCount = shop?.roomCount || (shop?.rooms?.length ?? 0);
    const topItems = products.slice(0, 2).map((p) => p.name).join(', ') || 'No items';

    switch (category) {
      case 'cafe':
        return [
          { title: 'Coffee items', value: beverageCount },
          { title: 'Live offers', value: offers.length },
          { title: 'Shop rating', value: shop?.rating?.toFixed(1) || 'New' },
        ];
      case 'mess':
        return [
          { title: 'Active subscriptions', value: stats.activeSubscriptions },
          { title: 'Attendance', value: `${stats.attendanceRate}%` },
          { title: 'Meal plans', value: shop?.weeklyMenu?.length || 'N/A' },
        ];
      case 'hotel':
        return [
          { title: 'Facilities', value: facilityCount },
          { title: 'Rooms listed', value: roomCount },
          { title: 'Guest rating', value: shop?.rating?.toFixed(1) || 'New' },
        ];
      case 'dessert':
        return [
          { title: 'Dessert items', value: dessertCount },
          { title: 'Top desserts', value: topItems },
          { title: 'Live offers', value: offers.length },
        ];
      case 'stall':
        return [
          { title: 'Quick items', value: products.length },
          { title: 'Top sellers', value: topItems },
          { title: 'Live offers', value: offers.length },
        ];
      default:
        return [
          { title: 'Total orders', value: stats.totalOrders },
          { title: 'Revenue', value: `₹${stats.totalRevenue}` },
          { title: 'Pending orders', value: stats.pendingOrders },
        ];
    }
  };

  const getCategoryTheme = () => {
    const category = (categoryOverride || shop?.category || '').toLowerCase();
    return categoryThemes[category] || {
      overlay: 'from-gray-950/90 via-gray-900/40 to-gray-500/10',
      labelColor: 'text-white',
      taglineColor: 'text-gray-200',
      cardBackground: 'bg-white/10',
      cardBorder: 'border-white/10',
      statTitle: 'text-gray-300',
      statValue: 'text-white',
    };
  };

  const [orders, setOrders] = useState([]);
  const [attendanceChartData, setAttendanceChartData] = useState([]);
  const [mealDistributionData, setMealDistributionData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({ totalStudents: 0, totalAttendance: 0 });
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingExplore, setUploadingExplore] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryFile, setGalleryFile] = useState(null);
  const [offers, setOffers] = useState([]);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingOfferIndex, setEditingOfferIndex] = useState(null);
  const [offerForm, setOfferForm] = useState({ title: '', description: '', discount: '', code: '' });
  const [savingOffers, setSavingOffers] = useState(false);

  useEffect(() => {
    if (user?.role === 'shopowner') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const shopsRes = await shopAPI.getMyShops();
      const userShop = shopsRes.data.shops?.[0];
      setShop(userShop);
      setOffers(userShop?.offers || []);

      if (userShop) {
        // fetch products for cafe-specific insights
        try {
          const productsRes = await productAPI.getProductsByShop(userShop._id);
          setProducts(productsRes.data.products || []);
        } catch (err) {
          console.warn('Failed to fetch products for insights', err);
        }

        const [ordersRes, subsRes, analyticsRes] = await Promise.all([
          orderAPI.getShopOrders(userShop._id),
          subscriptionAPI.getShopSubscriptions(userShop._id),
          attendanceAPI.getAnalytics(userShop._id),
        ]);

        const allOrders = ordersRes.data.orders || [];
        const activeSubs = subsRes.data.subscriptions?.filter((s) => s.isActive) || [];
        const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = allOrders.filter((o) => o.orderStatus === 'pending').length;
        const analytics = analyticsRes.data.analytics || {};

        setStats({
          totalOrders: allOrders.length,
          activeSubscriptions: activeSubs.length,
          totalRevenue,
          pendingOrders,
          attendanceRate: analytics.attendanceRate || 0,
        });

        setAttendanceSummary({
          totalStudents: analytics.totalStudents || 0,
          totalAttendance: analytics.totalAttendance || 0,
        });

        setOrders(allOrders);

        setAttendanceChartData(
          analytics.dailyData?.slice(-7).map((d) => ({
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            breakfast: d.breakfast,
            lunch: d.lunch,
            dinner: d.dinner,
          })) || []
        );

        setMealDistributionData([
          { name: 'Breakfast', value: analytics.mealDistribution?.breakfast || 0 },
          { name: 'Lunch', value: analytics.mealDistribution?.lunch || 0 },
          { name: 'Dinner', value: analytics.mealDistribution?.dinner || 0 },
        ]);

        setRevenueData(
          allOrders.slice(-7).map((order) => ({
            date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: order.total || 0,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = async (type, file) => {
    if (!file || !shop) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      if (type === 'logo') {
        setUploadingLogo(true);
        const response = await shopAPI.uploadLogo(formData);
        setShop((prev) => ({ ...prev, logo: response.data.logo }));
        toast.success('Logo updated');
      } else if (type === 'cover') {
        setUploadingCover(true);
        const response = await shopAPI.uploadCover(formData);
        setShop((prev) => ({ ...prev, coverImage: response.data.coverImage }));
        toast.success('Cover image updated');
      } else if (type === 'explore') {
        setUploadingExplore(true);
        const response = await shopAPI.uploadExplore(formData);
        setShop((prev) => ({ ...prev, exploreImage: response.data.exploreImage }));
        toast.success('Explore image updated');
      } else if (type === 'gallery') {
        setUploadingGallery(true);
        const response = await shopAPI.uploadLocal(shop._id, formData);
        setShop((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), response.data.url],
        }));
        setGalleryFile(null);
        toast.success('Gallery image added');
      }
    } catch (error) {
      console.error('Media upload failed:', error);
      toast.error(error.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingLogo(false);
      setUploadingCover(false);
      setUploadingExplore(false);
      setUploadingGallery(false);
    }
  };

  const handleOfferChange = (field, value) => {
    setOfferForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartEditOffer = (index) => {
    setEditingOfferIndex(index);
    setOfferForm({ ...offers[index] });
    setShowOffersModal(true);
  };

  const handleStartAddOffer = () => {
    setEditingOfferIndex(null);
    setOfferForm({ title: '', description: '', discount: '', code: '' });
    setShowOffersModal(true);
  };

  const handleRemoveOffer = (index) => {
    setOffers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveOffer = () => {
    if (!offerForm.title || !offerForm.description) {
      toast.error('Please add a title and description for the offer');
      return;
    }

    setOffers((prev) => {
      if (editingOfferIndex !== null) {
        return prev.map((offer, i) => (i === editingOfferIndex ? offerForm : offer));
      }
      return [...prev, offerForm];
    });
    setShowOffersModal(false);
    setEditingOfferIndex(null);
    setOfferForm({ title: '', description: '', discount: '', code: '' });
  };

  const handleSaveOffers = async () => {
    if (!shop) return;
    setSavingOffers(true);
    try {
      await shopAPI.updateShop(shop._id, { offers });
      setShop((prev) => ({ ...prev, offers }));
      toast.success('Offers saved successfully');
    } catch (error) {
      console.error('Failed to save offers:', error);
      toast.error(error.response?.data?.message || 'Failed to save offers');
    } finally {
      setSavingOffers(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <ShopLayout>
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={40} className="text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Shop Registered</h2>
          <p className="text-gray-600 mb-4">You haven't registered a shop yet.</p>
          <Link to="/register/shopowner" className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-semibold">
            Register Your Shop
          </Link>
        </div>
      </ShopLayout>
    );
  }

  const shopUrl = `${window.location.origin}/shop/${shop.category || 'mess'}/${shop._id}`;
  const qrValue = shop.qrCodeData?.trim() || shopUrl;
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrValue)}`;
  const menuItems = shop.weeklyMenu?.length
    ? shop.weeklyMenu
    : [
        { day: 'Monday', breakfast: 'Poha', lunch: 'Dal Roti', dinner: 'Sabzi Roti' },
        { day: 'Tuesday', breakfast: 'Upma', lunch: 'Chole Bhature', dinner: 'Paneer Rice' },
        { day: 'Wednesday', breakfast: 'Idli Sambar', lunch: 'Rajma Chawal', dinner: 'Mix Veg Roti' },
        { day: 'Thursday', breakfast: 'Dosa', lunch: 'Kadhi Chawal', dinner: 'Dal Makhani' },
        { day: 'Friday', breakfast: 'Paratha', lunch: 'Biryani', dinner: 'Sabzi Roti' },
        { day: 'Saturday', breakfast: 'Puri Sabzi', lunch: 'Thali', dinner: 'Special Dinner' },
        { day: 'Sunday', breakfast: 'Chilla', lunch: 'Festival Meal', dinner: 'Light Dinner' },
      ];

  const galleryImages = ((shop.gallery && shop.gallery.length > 0
    ? shop.gallery
    : [shop.coverImage, shop.logo]).map(resolveImageUrl)).filter(Boolean).slice(0, 4);

  const offersToShow = offers;
  const defaultOfferHints = [
    { title: 'Launch Offer', description: '20% off for first 50 customers' },
    { title: 'Weekend Special', description: 'Buy 2 get 1 free on select meals' },
  ];

  const popularDishes = shop.popularDishes?.length
    ? shop.popularDishes
    : ['Paneer Butter Masala', 'Chicken Biryani', 'Veg Thali'];

  const cuisines = shop.cuisines?.length ? shop.cuisines : ['North Indian', 'South Indian', 'Continental'];

  return (
    <ShopLayout>
      <div className="space-y-6">
        <div className="overflow-hidden rounded-3xl bg-gray-900 text-white shadow-xl">
          <div className="relative h-72 sm:h-80 lg:h-96">
            <img
              src={resolveImageUrl(shop.coverImage) || 'https://via.placeholder.com/1400x500'}
              alt={shop.name}
              className="h-full w-full object-cover opacity-90"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryTheme().overlay}`} />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-4">
                    <div className="rounded-3xl bg-white/10 p-2 border border-white/10 shadow-lg">
                      {shop.logo ? (
                        <img src={resolveImageUrl(shop.logo)} alt="Logo" className="h-16 w-16 rounded-3xl object-cover" />
                      ) : (
                        <ImagePlus size={32} className="text-orange-300" />
                      )}
                    </div>
                    <div>
                        <p className={`text-sm uppercase tracking-[0.3em] ${getCategoryTheme().labelColor}`}>{getDashboardLabel()}</p>
                      <h1 className="text-4xl sm:text-5xl font-semibold">{shop.name}</h1>
                        <p className={`mt-2 text-sm ${getCategoryTheme().taglineColor} max-w-xl`}>{getCategoryTagline()}</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {getHeroStats().map((stat) => (
                            <div key={stat.title} className={`rounded-3xl p-3 ${getCategoryTheme().cardBackground} ${getCategoryTheme().cardBorder} text-sm`}>
                              <p className={getCategoryTheme().statTitle}>{stat.title}</p>
                              <p className={`mt-2 text-lg font-semibold ${getCategoryTheme().statValue}`}>{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="max-w-2xl text-sm text-gray-200 sm:text-base">{shop.description || 'Keep your shop profile updated so students can discover your meals, offers, and weekly menu easily.'}</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs sm:text-sm">
                    <div className="rounded-2xl bg-white/10 px-3 py-2">{shop.location?.area}, {shop.location?.city}</div>
                    <div className="rounded-2xl bg-white/10 px-3 py-2">{shop.timings?.open} - {shop.timings?.close}</div>
                    <div className="rounded-2xl bg-white/10 px-3 py-2">₹{shop.costForTwo || 0} for two</div>
                    <div className="rounded-2xl bg-white/10 px-3 py-2">{shop.rating?.toFixed(1) || 'New'} ★</div>
                  </div>
                </div>
                <div className="grid gap-3 text-right">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <span className="block text-xs uppercase tracking-[0.2em] text-gray-300">Shop URL</span>
                    <p className="mt-2 text-sm break-all">{shopUrl}</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <span className="block text-xs uppercase tracking-[0.2em] text-gray-300">Saved QR text</span>
                    <p className="mt-2 text-sm break-all">{shop.qrCodeData || 'Auto-generated from shop page'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.8fr_1.2fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Active Subscriptions</p>
                <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.activeSubscriptions}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.attendanceRate}%</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Total Attendance</p>
                <p className="mt-3 text-3xl font-semibold text-gray-900">{attendanceSummary.totalAttendance}</p>
              </div>
            </div>
            {/* Cafe-specific insights */}
            {shop.category === 'cafe' && (
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Cafe Insights</p>
                    <h2 className="text-xl font-semibold text-gray-900">Beverage Insights</h2>
                  </div>
                  <div className="text-sm text-gray-500">Quick view</div>
                </div>
                <div className="grid gap-3">
                  <p className="text-sm text-gray-600">Beverage items: <span className="font-semibold text-gray-900">{products.filter(p => (p.category || '').toLowerCase() === 'beverages').length}</span></p>
                  <p className="text-sm text-gray-600">Popular picks:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {products
                      .filter(p => (p.category || '').toLowerCase() === 'beverages')
                      .sort((a,b) => (b.isPopular ? 1:0) - (a.isPopular ? 1:0))
                      .slice(0,3)
                      .map((p) => (<li key={p._id}>{p.name} {p.isPopular ? '• Popular' : ''}</li>))}
                    {products.filter(p => (p.category || '').toLowerCase() === 'beverages').length === 0 && (
                      <li className="text-gray-400">No beverages yet — add from menu</li>
                    )}
                  </ul>
                  <div className="mt-4">
                    <Link to="/shop/menu" className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100">Manage Menu</Link>
                  </div>
                </div>
              </div>
            )}

            {/* Mess-specific insights */}
            {shop.category === 'mess' && (
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Mess Insights</p>
                    <h2 className="text-xl font-semibold text-gray-900">Meal Plan Summary</h2>
                  </div>
                  <div className="text-sm text-gray-500">Weekly overview</div>
                </div>
                <div className="grid gap-3">
                  <p className="text-sm text-gray-600">Active subscriptions: <span className="font-semibold text-gray-900">{stats.activeSubscriptions}</span></p>
                  <p className="text-sm text-gray-600">Avg meals/day: <span className="font-semibold text-gray-900">{Math.round((attendanceSummary.totalAttendance || 0) / 7)}</span></p>
                  <p className="text-sm text-gray-600">Most served: <span className="font-semibold text-gray-900">{popularDishes[0] || '—'}</span></p>
                  <div className="mt-4">
                    <Link to="/shop/settings?tab=weeklyMenu" className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100">Edit Weekly Menu</Link>
                  </div>
                </div>
              </div>
            )}

            {/* Hotel-specific insights */}
            {shop.category === 'hotel' && (
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Hotel Insights</p>
                    <h2 className="text-xl font-semibold text-gray-900">Accommodation Summary</h2>
                  </div>
                  <div className="text-sm text-gray-500">Quick view</div>
                </div>
                <div className="grid gap-3">
                  <p className="text-sm text-gray-600">Rooms listed: <span className="font-semibold text-gray-900">{shop.roomCount || (shop.rooms ? shop.rooms.length : '—')}</span></p>
                  <p className="text-sm text-gray-600">Facilities: <span className="font-semibold text-gray-900">{(shop.facilities || []).slice(0,3).join(', ') || '—'}</span></p>
                  <div className="mt-4">
                    <Link to="/shop/settings" className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100">Manage Hotel Info</Link>
                  </div>
                </div>
              </div>
            )}

            {/* Dessert-specific insights */}
            {shop.category === 'dessert' && (
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Dessert Insights</p>
                    <h2 className="text-xl font-semibold text-gray-900">Sweet Spot</h2>
                  </div>
                  <div className="text-sm text-gray-500">Top treats</div>
                </div>
                <div className="grid gap-3">
                  <p className="text-sm text-gray-600">Dessert items: <span className="font-semibold text-gray-900">{products.filter(p => (p.category || '').toLowerCase() === 'dessert').length}</span></p>
                  <p className="text-sm text-gray-600">Top picks:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {products
                      .filter(p => (p.category || '').toLowerCase() === 'dessert')
                      .slice(0,3)
                      .map((p) => (<li key={p._id}>{p.name}</li>))}
                    {products.filter(p => (p.category || '').toLowerCase() === 'dessert').length === 0 && (
                      <li className="text-gray-400">No desserts yet — add from menu</li>
                    )}
                  </ul>
                  <div className="mt-4">
                    <Link to="/shop/menu" className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100">Manage Menu</Link>
                  </div>
                </div>
              </div>
            )}

            {/* Stall-specific insights */}
            {shop.category === 'stall' && (
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Stall Insights</p>
                    <h2 className="text-xl font-semibold text-gray-900">Quick Sales</h2>
                  </div>
                  <div className="text-sm text-gray-500">Daily preview</div>
                </div>
                <div className="grid gap-3">
                  <p className="text-sm text-gray-600">Active offers: <span className="font-semibold text-gray-900">{offers.length}</span></p>
                  <p className="text-sm text-gray-600">Top sellers:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {products.slice(0,3).map((p) => (<li key={p._id}>{p.name}</li>))}
                    {products.length === 0 && <li className="text-gray-400">No items yet — add from menu</li>}
                  </ul>
                  <div className="mt-4">
                    <Link to="/shop/menu" className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100">Edit Stall Menu</Link>
                  </div>
                </div>
              </div>
            )}
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Weekly Menu</p>
                    <h2 className="text-xl font-semibold text-gray-900">Menu at a glance</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/shop/settings?tab=weeklyMenu"
                      className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-100"
                    >
                      Edit Menu
                    </Link>
                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      <Sparkles size={14} /> Favorite
                    </span>
                  </div>
                </div>
                <div className="grid gap-3">
                  {menuItems.map((item) => (
                    <div key={item.day} className="grid gap-2 rounded-3xl border border-gray-100 p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900">{item.day}</p>
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">{item.breakfast ? 'Fresh' : 'No menu'}</span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-3 text-sm text-gray-700">
                        <div className="rounded-2xl bg-white p-3 shadow-sm">Breakfast: {item.breakfast || '—'}</div>
                        <div className="rounded-2xl bg-white p-3 shadow-sm">Lunch: {item.lunch || '—'}</div>
                        <div className="rounded-2xl bg-white p-3 shadow-sm">Dinner: {item.dinner || '—'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Shop QR Code</p>
                    <h2 className="text-xl font-semibold text-gray-900">Scan to view shop</h2>
                  </div>
                  <QrCode size={24} className="text-orange-500" />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                    <img src={qrImage} alt="Shop QR code" className="h-56 w-56 object-cover" />
                  </div>
                  <p className="text-sm text-gray-500 text-center">Share this QR to let customers open your shop page instantly.</p>
                  <div className="w-full space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Upload gallery image</label>
                    <div className="flex gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setGalleryFile(file);
                        }}
                        className="block w-full rounded-2xl border border-gray-200 p-3 text-sm text-gray-700"
                      />
                      <button
                        onClick={() => handleMediaUpload('gallery', galleryFile)}
                        disabled={!galleryFile || uploadingGallery}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#FF6B35] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        <UploadCloud size={16} />
                        {uploadingGallery ? 'Uploading' : 'Add'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Gallery uploads use local fallback if Cloudinary isn’t configured.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Quick actions</p>
                    <h3 className="text-xl font-semibold text-gray-900">Update shop media</h3>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
                        {shop.logo ? (
                          <img src={resolveImageUrl(shop.logo)} alt="Logo Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ImagePlus size={28} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Logo</p>
                        <p className="text-sm text-gray-500">Upload or replace your shop logo.</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => document.getElementById('logo-upload').click()}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <UploadCloud size={16} /> {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      </button>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-2 text-xs text-gray-600">
                        {shop.logo ? 'Saved' : 'Not set'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
                        {shop.coverImage ? (
                          <img src={resolveImageUrl(shop.coverImage)} alt="Cover Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ImagePlus size={28} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Cover Image</p>
                        <p className="text-sm text-gray-500">Upload or replace your shop cover image.</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => document.getElementById('cover-upload').click()}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <UploadCloud size={16} /> {uploadingCover ? 'Uploading...' : 'Upload Cover'}
                      </button>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-2 text-xs text-gray-600">
                        {shop.coverImage ? 'Saved' : 'Not set'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
                        {shop.exploreImage ? (
                          <img src={resolveImageUrl(shop.exploreImage)} alt="Explore Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ImagePlus size={28} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Explore Image</p>
                        <p className="text-sm text-gray-500">Upload image for the Explore page display.</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => document.getElementById('explore-upload').click()}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <UploadCloud size={16} /> {uploadingExplore ? 'Uploading...' : 'Upload Explore'}
                      </button>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-2 text-xs text-gray-600">
                        {shop.exploreImage ? 'Saved' : 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleMediaUpload('logo', e.target.files?.[0])}
                />
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleMediaUpload('cover', e.target.files?.[0])}
                />
                <input
                  id="explore-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleMediaUpload('explore', e.target.files?.[0])}
                />
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Attendance summary</p>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">Students & scan activity</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Total students</p>
                    <p className="mt-3 text-3xl font-semibold text-gray-900">{attendanceSummary.totalStudents}</p>
                  </div>
                  <div className="rounded-3xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Marked attendance</p>
                    <p className="mt-3 text-3xl font-semibold text-gray-900">{attendanceSummary.totalAttendance}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueChart data={revenueData} />
              <AttendanceChart data={attendanceChartData} />
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
              <RecentOrdersTable orders={orders} />
            </div>

            {/* Subscription Requests Section - for Mess category */}
            {shop.category === 'mess' && (
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <SubscriptionRequests shopId={shop._id} />
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Gallery preview</h3>
                <Camera size={20} className="text-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((img, idx) => (
                  <img key={idx} src={img} alt={`gallery-${idx}`} className="h-32 w-full rounded-3xl object-cover" />
                ))}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Offers</h4>
                    <p className="text-xs text-gray-500">Manage your shop coupons for students</p>
                  </div>
                  <button
                    onClick={handleStartAddOffer}
                    className="rounded-full bg-orange-500 text-white px-4 py-2 text-xs font-semibold hover:bg-orange-600 transition"
                  >
                    Add Offer
                  </button>
                </div>
                {offersToShow.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    {offersToShow.map((offer, idx) => (
                      <li key={idx} className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-gray-900">{offer.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{offer.discount || 'Special'}</p>
                            <p className="mt-2">{offer.description}</p>
                            {offer.code && <p className="mt-2 text-xs text-gray-500">Code: {offer.code}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => handleStartEditOffer(idx)}
                              className="text-orange-600 hover:text-orange-700 text-xs font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemoveOffer(idx)}
                              className="text-red-500 hover:text-red-600 text-xs font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-3xl bg-gray-50 p-4 text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">No active offers yet</p>
                    <p className="mt-2">Create a new offer and save it to display on your public shop page.</p>
                    <div className="mt-4 grid gap-3">
                      {defaultOfferHints.map((hint, idx) => (
                        <div key={idx} className="rounded-2xl border border-dashed border-gray-200 bg-white p-3">
                          <p className="font-medium text-gray-900">{hint.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{hint.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleSaveOffers}
                  disabled={savingOffers}
                  className="mt-4 w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {savingOffers ? 'Saving...' : 'Save Offers'}
                </button>
              </div>
              {showOffersModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
                  <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{editingOfferIndex !== null ? 'Edit Offer' : 'Add Offer'}</h3>
                        <p className="text-sm text-gray-500">Update the offer text, discount, and coupon code.</p>
                      </div>
                      <button onClick={() => setShowOffersModal(false)} className="text-gray-500 hover:text-gray-900">Close</button>
                    </div>
                    <div className="grid gap-4">
                      <label className="space-y-2 text-sm">
                        <span className="font-semibold text-gray-700">Title</span>
                        <input
                          value={offerForm.title}
                          onChange={(e) => handleOfferChange('title', e.target.value)}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
                          placeholder="Welcome Offer"
                        />
                      </label>
                      <label className="space-y-2 text-sm">
                        <span className="font-semibold text-gray-700">Description</span>
                        <textarea
                          value={offerForm.description}
                          onChange={(e) => handleOfferChange('description', e.target.value)}
                          className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
                          placeholder="Get 30% off on your first subscription"
                          rows={3}
                        />
                      </label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm">
                          <span className="font-semibold text-gray-700">Discount</span>
                          <input
                            value={offerForm.discount}
                            onChange={(e) => handleOfferChange('discount', e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
                            placeholder="30%"
                          />
                        </label>
                        <label className="space-y-2 text-sm">
                          <span className="font-semibold text-gray-700">Code</span>
                          <input
                            value={offerForm.code}
                            onChange={(e) => handleOfferChange('code', e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-orange-500 focus:outline-none"
                            placeholder="WELCOME30"
                          />
                        </label>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          onClick={() => setShowOffersModal(false)}
                          className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveOffer}
                          className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600"
                        >
                          {editingOfferIndex !== null ? 'Update Offer' : 'Add Offer'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Popular dishes</h3>
                  <p className="text-sm text-gray-500">Highlight best sellers</p>
                </div>
                <Sparkles size={20} className="text-orange-500" />
              </div>
              <div className="flex flex-wrap gap-2">
                {popularDishes.map((dish, idx) => (
                  <span key={idx} className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700">{dish}</span>
                ))}
              </div>
              <div className="mt-5 rounded-3xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">Cuisines</p>
                <p className="mt-2 text-sm text-gray-600">{cuisines.join(', ')}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </ShopLayout>
  );
};

export default ShopDashboard;
