import React, { createContext, useContext, useState, useEffect } from 'react';
import { firestore } from '../config/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [realTimeOrders, setRealTimeOrders] = useState([]);
  const [realTimeUsers, setRealTimeUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Listen to real-time orders
  useEffect(() => {
    const ordersQuery = query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const orders = [];
      snapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
      setRealTimeOrders(orders);
    });
    return () => unsubscribe();
  }, []);

  // Listen to real-time users
  useEffect(() => {
    const usersQuery = query(collection(firestore, 'users'), orderBy('createdAt', 'desc'), limit(100));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const users = [];
      snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
      setRealTimeUsers(users);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ realTimeOrders, realTimeUsers, notifications }}>
      {children}
    </AdminContext.Provider>
  );
};