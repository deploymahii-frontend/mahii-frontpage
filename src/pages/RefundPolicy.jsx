import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom mx-auto px-4">
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-10 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Refund Policy</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We strive to make every order perfect. This page explains how refunds are handled for cancellations, payment issues, and service disruptions.
          </p>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order Cancellations</h2>
              <p className="text-gray-600 dark:text-gray-300">You may request a cancellation before the shop begins preparation. Refunds for cancelled orders are processed according to the partner's policy.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Failed Payments</h2>
              <p className="text-gray-600 dark:text-gray-300">If a payment fails or is duplicated, we will investigate and refund the amount through your original payment method.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subscription Refunds</h2>
              <p className="text-gray-600 dark:text-gray-300">Subscription refunds are handled on a case-by-case basis. Please contact support for assistance with plan cancellations.</p>
            </div>
          </section>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: May 2026</p>
            <p>
              Need help? <Link to="/contact" className="text-primary-600 hover:underline">Contact us</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
