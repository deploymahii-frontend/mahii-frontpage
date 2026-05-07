import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSearch, FiHelpCircle, FiMessageCircle, FiMail, 
  FiPhone, FiBook, FiVideo, FiUsers, FiShield,
  FiShoppingBag, FiTruck, FiCreditCard, FiRefreshCw,
  FiUser, FiStar, FiAward, FiClock, FiCheckCircle,
  FiArrowRight, FiThumbsUp, FiThumbsDown
} from 'react-icons/fi';
import { MdRestaurant, MdPayment } from 'react-icons/md';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const categories = [
    { id: 'all', name: 'All Topics', icon: <FiHelpCircle />, color: 'gray' },
    { id: 'ordering', name: 'Ordering', icon: <FiShoppingBag />, color: 'orange' },
    { id: 'delivery', name: 'Delivery', icon: <FiTruck />, color: 'blue' },
    { id: 'payments', name: 'Payments', icon: <MdPayment />, color: 'green' },
    { id: 'account', name: 'Account', icon: <FiUser />, color: 'purple' },
    { id: 'business', name: 'For Business', icon: <MdRestaurant />, color: 'emerald' },
    { id: 'safety', name: 'Safety & Privacy', icon: <FiShield />, color: 'red' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'ordering',
      question: 'How do I place an order?',
      answer: 'To place an order, simply browse through the restaurants, add items to your cart, and proceed to checkout. You can pay using various methods including credit/debit cards, UPI, or cash on delivery.',
      helpful: 0
    },
    {
      id: 2,
      category: 'ordering',
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order within 60 seconds of placing it. After that, cancellation depends on the restaurant\'s preparation status. Go to "My Orders" and click "Cancel Order" if available.',
      helpful: 0
    },
    {
      id: 3,
      category: 'ordering',
      question: 'How do I modify my order?',
      answer: 'Modifications are only possible before the restaurant accepts your order. You can add special instructions for each item like "less spicy" or "no onion" during checkout.',
      helpful: 0
    },
    {
      id: 4,
      category: 'delivery',
      question: 'How long does delivery take?',
      answer: 'Delivery time varies by restaurant and location, typically 20-45 minutes. You can track your order in real-time from the "My Orders" section.',
      helpful: 0
    },
    {
      id: 5,
      category: 'delivery',
      question: 'What are your delivery charges?',
      answer: 'Delivery charges vary by restaurant and distance. Many restaurants offer free delivery on orders above a certain amount. You can see the delivery fee before placing your order.',
      helpful: 0
    },
    {
      id: 6,
      category: 'delivery',
      question: 'Can I schedule a delivery for later?',
      answer: 'Yes! You can schedule orders up to 7 days in advance. Just select "Schedule for later" at checkout and choose your preferred date and time.',
      helpful: 0
    },
    {
      id: 7,
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, Wallets, and Cash on Delivery.',
      helpful: 0
    },
    {
      id: 8,
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption (SSL) and never store your full payment details. All transactions are processed through secure payment gateways.',
      helpful: 0
    },
    {
      id: 9,
      category: 'payments',
      question: 'How do I get a refund?',
      answer: 'Refunds are processed within 5-7 business days after order cancellation or issue resolution. The amount will be credited to your original payment method.',
      helpful: 0
    },
    {
      id: 10,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page. Enter your email address, and we\'ll send you a password reset link. Follow the instructions to create a new password.',
      helpful: 0
    },
    {
      id: 11,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to Settings → Profile Information. You can update your name, phone number, address, and profile picture there.',
      helpful: 0
    },
    {
      id: 12,
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to Settings → Privacy → Delete Account. Note that this action is permanent and cannot be undone.',
      helpful: 0
    },
    {
      id: 13,
      category: 'business',
      question: 'How do I register my restaurant?',
      answer: 'Click "Partner With Us" from the login dropdown or visit our business portal. Fill out the registration form, and our team will review and approve your application within 48 hours.',
      helpful: 0
    },
    {
      id: 14,
      category: 'business',
      question: 'What are the commission charges?',
      answer: 'Commission varies by plan. Basic plan: 15%, Premium plan: 10%, Enterprise: Custom pricing. Contact our business team for detailed information.',
      helpful: 0
    },
    {
      id: 15,
      category: 'safety',
      question: 'How do you protect my data?',
      answer: 'We follow strict data protection policies. Your personal information is encrypted, and we never share your data without your consent. Read our full Privacy Policy for details.',
      helpful: 0
    }
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const searchedFaqs = searchQuery 
    ? filteredFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFaqs;

  const handleVote = (faqId, isHelpful) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [faqId]: isHelpful
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-[#C2185B] to-[#ad1457] text-white py-16">
        <div className="container-custom max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How can we help you?</h1>
          <p className="text-lg text-white/90 mb-8">Find answers to your questions or get in touch with our support team</p>
          <div className="max-w-2xl mx-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="container-custom max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                selectedCategory === category.id
                  ? 'bg-white dark:bg-gray-800 shadow-lg border-2 border-[#C2185B] text-[#C2185B]'
                  : 'bg-white dark:bg-gray-800 hover:shadow-md text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className="text-2xl">{category.icon}</div>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {searchQuery ? `Search Results (${searchedFaqs.length})` : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            {searchedFaqs.map((faq) => (
              <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-5 pb-5 pt-0 border-t border-gray-100 dark:border-gray-700 mt-2">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{faq.answer}</p>
                    <div className="flex items-center gap-4 pt-3">
                      <span className="text-sm text-gray-500">Was this helpful?</span>
                      <button
                        onClick={() => handleVote(faq.id, true)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                          helpfulVotes[faq.id] === true
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
                        }`}
                      >
                        <FiThumbsUp size={14} /> Yes
                      </button>
                      <button
                        onClick={() => handleVote(faq.id, false)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                          helpfulVotes[faq.id] === false
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
                        }`}
                      >
                        <FiThumbsDown size={14} /> No
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
          
          {searchedFaqs.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
              <FiHelpCircle className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400 mt-2">Try different keywords or contact our support team</p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-[#C2185B]/5 to-[#ad1457]/5 rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Still need help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#C2185B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="text-2xl text-[#C2185B]" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-sm text-gray-500 mb-3">Chat with our support team</p>
              <button className="text-[#C2185B] font-medium hover:underline">Start Chat →</button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#C2185B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-2xl text-[#C2185B]" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
              <p className="text-sm text-gray-500 mb-3">Get response within 24 hours</p>
              <a href="mailto:support@mahii.in" className="text-[#C2185B] font-medium hover:underline">support@mahii.in →</a>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#C2185B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="text-2xl text-[#C2185B]" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Documentation</h3>
              <p className="text-sm text-gray-500 mb-3">Detailed guides and tutorials</p>
              <button className="text-[#C2185B] font-medium hover:underline">Read Docs →</button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Popular Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Getting Started with Mahii', icon: <FiStar />, link: '/help/getting-started' },
              { title: 'Subscription Plans Explained', icon: <FiAward />, link: '/help/subscriptions' },
              { title: 'Track Your Order', icon: <FiTruck />, link: '/help/track-order' },
              { title: 'Mahii Pro Benefits', icon: <FiStar className="text-yellow-500" />, link: '/help/pro' },
              { title: 'Partner Onboarding', icon: <MdRestaurant />, link: '/help/partner' },
              { title: 'Safety Guidelines', icon: <FiShield />, link: '/help/safety' }
            ].map((topic, idx) => (
              <Link
                key={idx}
                to={topic.link}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#C2185B]">{topic.icon}</div>
                  <span className="text-gray-700 dark:text-gray-300">{topic.title}</span>
                </div>
                <FiArrowRight className="text-gray-400 group-hover:text-[#C2185B] transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
