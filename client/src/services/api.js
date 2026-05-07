import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const shouldRedirect = !currentPath.startsWith('/login');

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (shouldRedirect) {
        window.location.href = '/login/customer';
      }
      if (currentPath !== '/login/customer') {
        toast.error('Session expired. Please login again.');
      }
    }
    return Promise.reject(error);
  }
);

// ============ AUTH APIS ============
export const authAPI = {
  customerRegister: (data) => api.post('/auth/customer/register', data),
  shopOwnerRegister: (data) => api.post('/auth/shopowner/register', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  verifyAdminSecret: (data) => api.post('/auth/verify-admin-secret', data),
  verifyMfa: (data) => api.post('/auth/verify-mfa', data),
  getMe: () => api.get('/auth/me'),
};

// ============ USER APIS ============
export const userAPI = {
  getStats: () => api.get('/user/stats'),
  getSettings: () => api.get('/user/settings'),
  updateProfile: (data) => api.put('/user/profile', data),
  updatePassword: (data) => api.put('/user/password', data),
  updateNotifications: (data) => api.put('/user/notifications', data),
  updatePrivacy: (data) => api.put('/user/privacy', data),
};

// ============ SHOP APIS ============
export const shopAPI = {
  getNearbyShops: (params) => api.get('/shops/nearby', { params }),
  getExploreShops: (params) => api.get('/shops/explore', { params }),
  getCategories: () => api.get('/shops/categories'),
  searchShops: (params) => api.get('/shops/search', { params }),
  getShopById: (id) => api.get(`/shops/${id}`),
  getMyShops: () => api.get('/shops/my'),
  createShop: (data) => api.post('/shops', data),
  updateShop: (id, data) => api.put(`/shops/${id}`, data),
  getShopProducts: (shopId) => api.get(`/products/shop/${shopId}`),
  getEarnings: (shopId, params) => api.get(`/shops/${shopId}/earnings`, { params }),
  updateLocation: (data) => api.put('/shops/location', data),
  uploadLogo: (formData) => api.post('/shops/media/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadCover: (formData) => api.post('/shops/media/cover', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadGallery: (formData) => api.post('/shops/media/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadVideo: (formData) => api.post('/shops/media/video', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (imageId) => api.delete(`/shops/media/image/${imageId}`),
  
  // Shop Edit Approval Workflow
  submitEditForApproval: (shopId, data) => api.post(`/shops/${shopId}/submit-edit`, data),
  getEditHistory: (shopId) => api.get(`/shops/${shopId}/edit-history`),
  
  // Admin - Pending Shop Edits
  getPendingShopEdits: () => api.get('/shops/admin/pending-edits'),
  approveShopEdit: (shopId, data) => api.post(`/shops/admin/${shopId}/approve-edit`, data),
  rejectShopEdit: (shopId, data) => api.post(`/shops/admin/${shopId}/reject-edit`, data),
};

export const mediaAPI = {
  uploadLogo: shopAPI.uploadLogo,
  uploadCover: shopAPI.uploadCover,
  uploadGallery: shopAPI.uploadGallery,
  uploadVideo: shopAPI.uploadVideo,
  deleteImage: shopAPI.deleteImage,
};

// ============ LOCATION APIS ============
export const locationAPI = {
  searchPlaces: (query) => api.get('/location/search', { params: { query } }),
  reverseGeocode: (lat, lng) => api.post('/location/reverse-geocode', { lat, lng }),
  updateLocation: (data) => api.put('/shops/location', data),
};

// ============ PRODUCT APIS ============
export const productAPI = {
  getProductsByShop: (shopId, params) => api.get(`/products/shop/${shopId}`, { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
};

// ============ ORDER APIS ============
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getShopOrders: (shopId) => api.get(`/orders/shop/${shopId}`),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
};

// ============ SUBSCRIPTION APIS ============
export const subscriptionAPI = {
  getPlans: (shopId) => api.get(`/subscriptions/plans/${shopId}`),
  createSubscription: (data) => api.post('/subscriptions/create', data),
  activateSubscription: (id, data) => api.post(`/subscriptions/activate/${id}`, data),
  getMySubscriptions: () => api.get('/subscriptions/my'),
  getShopSubscriptions: (shopId) => api.get(`/subscriptions/shop/${shopId}`),
  getSubscriptionById: (id) => api.get(`/subscriptions/${id}`),
  markAttendance: (data) => api.post('/subscriptions/attendance', data),
  getAttendanceHistory: (id) => api.get(`/subscriptions/attendance/${id}`),
  cancelSubscription: (id, reason) => api.put(`/subscriptions/${id}/cancel`, { reason }),
  generateQRCode: (subscriptionId) => api.get(`/attendance/qr/${subscriptionId}`),
};

// ============ ATTENDANCE APIS ============
export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  getMyAttendance: (subscriptionId) => api.get(`/attendance/my/${subscriptionId}`),
  getAnalytics: (shopId) => api.get(`/attendance/analytics/${shopId}`),
  getAttendanceAnalytics: (params) => api.get('/attendance/analytics', { params }),
  getAttendanceByDate: (params) => api.get('/attendance/by-date', { params }),
  generateQRCode: (subscriptionId) => api.get(`/attendance/qr/${subscriptionId}`),
  scanAttendance: (data) => api.post('/attendance/scan', data),
};

// ============ REVIEW APIS ============
export const reviewAPI = {
  getShopReviews: (shopId) => api.get(`/reviews/shop/${shopId}`),
  replyToReview: (id, data) => api.post(`/reviews/${id}/reply`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  reportReview: (id, data) => api.post(`/reviews/${id}/report`, data),
};

// ============ PAYMENT APIS ============
export const paymentAPI = {
  createOrderPayment: (orderId) => api.post('/payments/create-order', { orderId }),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPaymentHistory: () => api.get('/payments/history'),
  getPaymentDetails: (id) => api.get(`/payments/${id}`),
  getInvoice: (id) => api.get(`/payments/${id}/invoice`),
};

// ============ NOTIFICATION APIS ============
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getPreferences: () => api.get('/notifications/preferences'),
  updatePreferences: (data) => api.put('/notifications/preferences', data),
  sendSpecialDishNotification: (data) => api.post('/notifications/special-dish', data),
};

// ============ ADMIN APIS ============
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),

  // Analytics
  getRevenueAnalytics: (params) => api.get('/admin/analytics/revenue', { params }),
  getSalesAnalytics: (params) => api.get('/admin/analytics/sales', { params }),
  getUserAnalytics: (params) => api.get('/admin/analytics/users', { params }),
  getOrderAnalytics: (params) => api.get('/admin/analytics/orders', { params }),

  // User Management
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Shop Management
  getAllShops: (params) => api.get('/admin/shops', { params }),
  getPendingShops: () => api.get('/admin/shops/pending'),
  approveShop: (id, data) => api.put(`/admin/shops/${id}/approve`, data),
  rejectShop: (id, data) => api.put(`/admin/shops/${id}/reject`, data),
  
  // Reports
  getRevenueReport: (params) => api.get('/admin/reports/revenue', { params }),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  sendInvite: (data) => api.post('/admin/invite', data),
};

// ============ CHAT APIS ============
export const chatAPI = {
  startChat: (data) => api.post('/chats/start', data),
  sendMessage: (data) => api.post('/chats/message', data),
  getChatHistory: (sessionId) => api.get(`/chats/${sessionId}`),
  getAdminChats: (params) => api.get('/chats/admin/chats', { params }),
  resolveChat: (sessionId) => api.put(`/chats/${sessionId}/resolve`),
  markAsRead: (sessionId) => api.put(`/chats/${sessionId}/read`),
};

// ============ CONTACT APIS ============
export const contactAPI = {
  submitContact: (data) => api.post('/contact/submit', data),
  getMessages: (params) => api.get('/contact', { params }),
  updateMessageStatus: (id, data) => api.put(`/contact/${id}`, data),
};

export default api;