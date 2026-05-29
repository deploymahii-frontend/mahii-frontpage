import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom mx-auto px-4">
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-10 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            These terms govern your use of the Mahii platform. By accessing our service, you agree to comply with these terms.
          </p>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Use of Service</h2>
              <p className="text-gray-600 dark:text-gray-300">You agree to use the platform lawfully, provide accurate information, and respect other users.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Responsibility</h2>
              <p className="text-gray-600 dark:text-gray-300">You are responsible for maintaining the confidentiality of your account credentials.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payments and Subscriptions</h2>
              <p className="text-gray-600 dark:text-gray-300">All payments are processed through secure gateways. Subscription terms and refund policies apply as described.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Modifications</h2>
              <p className="text-gray-600 dark:text-gray-300">We may update these terms from time to time. Continued use of the service constitutes acceptance of any updates.</p>
            </div>
          </section>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: May 2026</p>
            <p>
              Have questions? <Link to="/help" className="text-primary-600 hover:underline">Visit the Help Center</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
