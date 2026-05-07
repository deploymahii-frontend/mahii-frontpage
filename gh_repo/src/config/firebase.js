// Firebase configuration and utilities for Mahii App
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  off,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  onChildAdded,
  serverTimestamp
} from 'firebase/database';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Your Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ============ REAL-TIME ORDER FUNCTIONS ============

// Listen to new orders for a shop
const listenToOrders = (shopId, callback) => {
  const ordersRef = ref(database, `shopOrders/${shopId}`);
  const ordersQuery = query(ordersRef, orderByChild('createdAt'), limitToLast(50));

  const unsubscribe = onChildAdded(ordersQuery, (snapshot) => {
    const order = { id: snapshot.key, ...snapshot.val() };
    callback(order);
  });

  return () => off(ordersRef);
};

// Create a new order
const createOrder = async (orderData) => {
  const orderId = push(ref(database, 'orders')).key;
  const newOrder = {
    ...orderData,
    id: orderId,
    createdAt: serverTimestamp(),
    status: 'pending',
  };

  await set(ref(database, `orders/${orderId}`), newOrder);
  await set(ref(database, `shopOrders/${orderData.shopId}/${orderId}`), newOrder);

  return orderId;
};

// Update order status
const updateOrderStatus = async (orderId, shopId, status) => {
  const updates = {};
  updates[`orders/${orderId}/status`] = status;
  updates[`shopOrders/${shopId}/${orderId}/status`] = status;
  await update(ref(database), updates);
};

// ============ REAL-TIME ATTENDANCE FUNCTIONS ============

// Listen to attendance updates
const listenToAttendance = (subscriptionId, callback) => {
  const attendanceRef = ref(database, `attendance/${subscriptionId}`);
  const attendanceQuery = query(attendanceRef, orderByChild('date'), limitToLast(30));

  const unsubscribe = onChildAdded(attendanceQuery, (snapshot) => {
    const record = { id: snapshot.key, ...snapshot.val() };
    callback(record);
  });

  return () => off(attendanceRef);
};

// Mark attendance
const markAttendance = async (subscriptionId, date, mealType) => {
  const attendanceId = `${subscriptionId}_${date}_${mealType}`;
  await set(ref(database, `attendance/${subscriptionId}/${attendanceId}`), {
    date,
    mealType,
    status: 'present',
    markedAt: serverTimestamp(),
  });
};

// ============ REAL-TIME NOTIFICATIONS ============

// Listen to user notifications
const listenToNotifications = (userId, callback) => {
  const notificationsRef = ref(database, `notifications/${userId}`);
  const notificationsQuery = query(notificationsRef, orderByChild('createdAt'), limitToLast(20));

  const unsubscribe = onChildAdded(notificationsQuery, (snapshot) => {
    const notification = { id: snapshot.key, ...snapshot.val() };
    callback(notification);
  });

  return () => off(notificationsRef);
};

// Send notification
const sendNotification = async (userId, title, message, type, data = {}) => {
  const notificationId = push(ref(database, `notifications/${userId}`)).key;
  await set(ref(database, `notifications/${userId}/${notificationId}`), {
    title,
    message,
    type,
    data,
    read: false,
    createdAt: serverTimestamp(),
  });
};

// ============ REAL-TIME CHAT FUNCTIONS ============

// Listen to chat messages
const listenToChat = (chatId, callback) => {
  const chatRef = ref(database, `chats/${chatId}/messages`);
  const chatQuery = query(chatRef, orderByChild('createdAt'), limitToLast(50));

  const unsubscribe = onChildAdded(chatQuery, (snapshot) => {
    const message = { id: snapshot.key, ...snapshot.val() };
    callback(message);
  });

  return () => off(chatRef);
};

// Send chat message
const sendMessage = async (chatId, message, senderId, senderName) => {
  const messageId = push(ref(database, `chats/${chatId}/messages`)).key;
  await set(ref(database, `chats/${chatId}/messages/${messageId}`), {
    message,
    senderId,
    senderName,
    createdAt: serverTimestamp(),
    read: false,
  });
};

export {
  database,
  auth,
  // Auth functions
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  // Order functions
  listenToOrders,
  createOrder,
  updateOrderStatus,
  // Attendance functions
  listenToAttendance,
  markAttendance,
  // Notification functions
  listenToNotifications,
  sendNotification,
  // Chat functions
  listenToChat,
  sendMessage,
  // Database utilities
  ref,
  set,
  push,
  onValue,
  off,
  update,
  remove,
  serverTimestamp,
};