import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom mx-auto px-4">
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-10 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sitemap</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Quick access to the main sections of Mahii.</p>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'Explore', to: '/explore' },
              { label: 'Help Center', to: '/help' },
              { label: 'Contact Us', to: '/contact' },
              { label: 'Customer Login', to: '/login/customer' },
              { label: 'Shop Owner Login', to: '/login/shopowner' },
              { label: 'Admin Login', to: '/login/admin' },
              { label: 'Cart', to: '/cart' },
              { label: 'Settings', to: '/settings' },
              { label: 'Privacy Policy', to: '/privacy-policy' },
              { label: 'Terms of Service', to: '/terms-of-service' },
              { label: 'Refund Policy', to: '/refund-policy' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-5 text-sm font-medium text-gray-700 transition hover:border-primary-500 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
