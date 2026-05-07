import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Utensils, 
  DollarSign, 
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  BarChart3,
  Store,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

const ShopSidebar = ({ activeTab, sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/shop/dashboard' },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} />, path: '/shop/orders' },
    { id: 'subscriptions', label: 'Subscriptions', icon: <Calendar size={20} />, path: '/shop/subscriptions' },
    { id: 'menu', label: 'Menu', icon: <Utensils size={20} />, path: '/shop/menu' },
    { id: 'students', label: 'Students', icon: <Users size={20} />, path: '/shop/students' },
    { id: 'attendance', label: 'Attendance', icon: <Bell size={20} />, path: '/shop/attendance' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, path: '/shop/analytics' },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={20} />, path: '/shop/earnings' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/shop/settings' },
    { id: 'help', label: 'Help Center', icon: <HelpCircle size={20} />, path: '/shop/help' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-xl z-50 transition-all duration-300 hidden lg:block ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-lg flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-800 dark:text-white text-lg">Mahii</span>
              <span className="text-xs text-gray-500">Shop</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-lg flex items-center justify-center mx-auto">
              <Store size={16} className="text-white" />
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="flex-1 text-left text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 lg:hidden">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
                activeTab === item.id ? 'text-[#FF6B35]' : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default ShopSidebar;