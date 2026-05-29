import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { shopAPI } from '../../services/api';

const ShopDashboardRedirect = () => {
  const { user } = useAuth();
  const [redirectPath, setRedirectPath] = useState(null);
  const [loading, setLoading] = useState(true);

  const getShopDashboardPath = (category) => {
    switch (category) {
      case 'mess':
        return '/shop/mess/dashboard';
      case 'hotel':
        return '/shop/hotel/dashboard';
      case 'cafe':
        return '/shop/cafe/dashboard';
      case 'dessert':
        return '/shop/dessert/dashboard';
      case 'stall':
        return '/shop/stall/dashboard';
      default:
        return '/shop/dashboard';
    }
  };

  useEffect(() => {
    const fetchShopCategory = async () => {
      if (!user || user.role !== 'shopowner') {
        setLoading(false);
        return;
      }

      try {
        const shopsRes = await shopAPI.getMyShops();
        const category = shopsRes.data.shops?.[0]?.category?.toLowerCase();
        const path = getShopDashboardPath(category);
        setRedirectPath(path);
      } catch (error) {
        console.error('Error determining shop dashboard redirect:', error);
        setRedirectPath('/shop/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchShopCategory();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (redirectPath && redirectPath !== '/shop/dashboard') {
    return <Navigate to={redirectPath} replace />;
  }

  return <Navigate to="/shop/dashboard" replace />;
};

export default ShopDashboardRedirect;
