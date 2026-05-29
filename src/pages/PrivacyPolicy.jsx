import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom mx-auto px-4">
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-10 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We respect your privacy and handle your personal data with care. This page explains how we collect, use, and protect your information.
          </p>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-300">We collect information you provide directly, such as account details, contact information, and order data.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-300">Your information helps us deliver orders, improve service, and personalize your experience.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Security</h2>
              <p className="text-gray-600 dark:text-gray-300">We use industry-standard security measures to protect your data and never share it without your consent unless required by law.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-300">You can request access to or deletion of your personal information by contacting our support team.</p>
            </div>
          </section>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: May 2026</p>
            <p>
              Need more help? <Link to="/contact" className="text-primary-600 hover:underline">Contact support</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
