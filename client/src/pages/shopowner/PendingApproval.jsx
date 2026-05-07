import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, AlertCircle, LogOut, Home, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const PendingApproval = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
        >
          {/* Icon */}
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400 animate-spin" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Pending Admin Approval
          </h1>

          {/* Message */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-2">
                  Your shop registration is under review
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Our admin team is reviewing your shop details. This typically takes 24-48 hours. You will be notified via email once approved.
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Account Details
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-medium">Name:</span> {user?.name}
              </p>
              <p className="text-sm text-gray-900 dark:text-white break-all">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                <span className="font-medium">Status:</span> Pending Review
              </p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <p className="text-xs text-blue-600 dark:text-blue-300 uppercase tracking-wider font-semibold mb-3">
              What happens next?
            </p>
            <ol className="text-xs text-blue-700 dark:text-blue-400 space-y-2">
              <li className="flex gap-2">
                <span className="font-bold flex-shrink-0">1.</span>
                <span>Admin reviews your shop details and documents</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold flex-shrink-0">2.</span>
                <span>You receive approval confirmation email</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold flex-shrink-0">3.</span>
                <span>Access your shop dashboard and start accepting orders</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Back to Home
            </Link>
            
            <a
              href="mailto:support@mahii.in?subject=Shop%20Approval%20Status"
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              Contact Support
            </a>

            <button
              onClick={handleLogout}
              className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-red-200 dark:border-red-800"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            You can check your status anytime by logging in. Keep your browser updated for real-time notifications.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PendingApproval;
