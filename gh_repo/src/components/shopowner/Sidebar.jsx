import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Image,
  Store,
  ShoppingBag,
  Users,
  QrCode,
  Star,
  MapPin,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  TrendingUp,
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, activeTab, setActiveTab }) => {
  const location = useLocation();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, badge: null },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, badge: null },
    { id: 'media', label: 'Media', icon: Image, badge: null },
    { id: 'menu', label: 'Menu', icon: Store, badge: null },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: '12' },
    { id: 'subscriptions', label: 'Subscriptions', icon: Users, badge: '8' },
    { id: 'attendance', label: 'Attendance', icon: QrCode, badge: null },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: '3' },
    { id: 'location', label: 'Location', icon: MapPin, badge: null },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '5' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">Dashboard</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className={`flex items-center justify-center ${
                isCollapsed ? 'w-8 h-8' : 'w-6 h-6'
              }`}>
                <item.icon size={isCollapsed ? 20 : 18} />
              </div>
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Mahii Dashboard v2.0
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;