import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Users,
  Store,
  FileText,
  Settings,
  LogOut,
  Shield,
  Bell,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { id: 'shop-approvals', label: 'Shop Approvals', icon: <Shield size={20} />, path: '/admin/shop-approvals' },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} />, path: '/admin/analytics' },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} />, path: '/admin/payments' },
    { id: 'users', label: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { id: 'shops', label: 'Shops', icon: <Store size={20} />, path: '/admin/shops' },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} />, path: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Mahii</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <HelpCircle size={20} />
          <span className="font-medium">Help & Support</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;