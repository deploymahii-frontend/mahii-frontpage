import React from 'react';
import ShopLayout from './ShopLayout';
import { HelpCircle, Mail, BookOpen, Headphones } from 'lucide-react';

const ShopHelp = () => {
  const faqs = [
    {
      question: 'How do I update my shop timings?',
      answer: 'Go to Settings > Hours and update your opening or closing times. Your changes are saved immediately so students see the latest schedule.',
    },
    {
      question: 'How can I manage subscriptions?',
      answer: 'Use the Subscriptions page to view all active plans and cancel any subscription if needed. This keeps your shop roster up to date.',
    },
    {
      question: 'How do attendance records work?',
      answer: 'Attendance data is collected automatically when students mark meals. Visit the Attendance page to review daily counts and student trends.',
    },
    {
      question: 'How do my menu changes appear on Explore?',
      answer: 'Menu updates are saved instantly when you add or edit items. If you do not see changes, please refresh the Explore page after a few seconds.',
    },
  ];

  return (
    <ShopLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <HelpCircle size={28} className="text-[#FF6B35]" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help Center</h1>
            <p className="text-gray-500">Find quick answers for common shop owner questions.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-950">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Need more help?</h2>
            <p className="text-gray-500 mb-4">Reach out directly if you need support with your shop settings, subscriptions, or attendance workflow.</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-gray-50 dark:bg-gray-950 p-4">
                <Mail size={20} className="text-[#FF6B35] mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email support</p>
                  <p className="text-sm text-gray-500">support@mahii.dev</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-gray-50 dark:bg-gray-950 p-4">
                <Headphones size={20} className="text-[#4CAF50] mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Live assistance</p>
                  <p className="text-sm text-gray-500">Open a support ticket from the admin portal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default ShopHelp;
