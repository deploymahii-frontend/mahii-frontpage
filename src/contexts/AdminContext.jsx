import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { firestore } from '../config/firebase';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [realTimeOrders, setRealTimeOrders] = useState([]);
  const [realTimeUsers, setRealTimeUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const isAdminUser = user?.role === 'admin' || user?.role === 'super_admin';

  // Listen to real-time orders only for admin users.
  useEffect(() => {
    if (!isAdminUser) {
      setRealTimeOrders([]);
      return;
    }

    const ordersQuery = query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const orders = [];
        snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
        setRealTimeOrders(orders);
      },
      (error) => {
        console.error('Firestore orders listener error:', error);
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch (cleanupError) {
        console.warn('Failed to unsubscribe from orders listener:', cleanupError);
      }
    };
  }, [isAdminUser]);

  // Listen to real-time users only for admin users.
  useEffect(() => {
    if (!isAdminUser) {
      setRealTimeUsers([]);
      return;
    }

    const usersQuery = query(collection(firestore, 'users'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const users = [];
        snapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));
        setRealTimeUsers(users);
      },
      (error) => {
        console.error('Firestore users listener error:', error);
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch (cleanupError) {
        console.warn('Failed to unsubscribe from users listener:', cleanupError);
      }
    };
  }, [isAdminUser]);

  return (
    <AdminContext.Provider value={{ realTimeOrders, realTimeUsers, notifications }}>
      {children}
    </AdminContext.Provider>
  );
};