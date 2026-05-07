import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUtensils,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQs', path: '/faqs' },
  ];

  const categories = [
    { name: 'Mess', path: '/explore?category=mess' },
    { name: 'Hotel', path: '/explore?category=hotel' },
    { name: 'Cafe', path: '/explore?category=cafe' },
    { name: 'Dessert', path: '/explore?category=dessert' },
    { name: 'Stall', path: '/explore?category=stall' },
    { name: 'Street Food', path: '/explore?category=stall' },
  ];

  const forBusiness = [
    { name: 'Register Your Shop', path: '/register/shopowner' },
    { name: 'Partner with Us', path: '/partner' },
    { name: 'Advertise', path: '/advertise' },
    { name: 'Merchant Support', path: '/merchant-support' },
  ];

  const socialIcons = [
    { icon: FaFacebook, href: 'https://facebook.com/mahii.in' },
    { icon: FaInstagram, href: 'https://instagram.com/mahii.in' },
    { icon: FaTwitter, href: 'https://twitter.com/mahii_in' },
    { icon: FaYoutube, href: 'https://youtube.com/@mahii' },
  ];

  return (
    <footer className="relative bg-[#F5F5F5] pt-16 pb-8 mt-auto overflow-hidden">
      
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF8A00] via-[#FFA41C] to-[#FF6A00]" />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE6CC] rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFE6CC] rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#FF8A00] to-[#FF6A00] p-3 rounded-2xl shadow-lg">
                <FaUtensils className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide text-[#1E1E1E]">
                  Mah<span className="text-[#FF8A00]">ii</span>
                </h2>
                <p className="text-[10px] text-[#6B7280] -mt-1">.in</p>
              </div>
            </div>

            <p className="text-sm text-[#6B7280] leading-relaxed">
              Connecting students with affordable, hygienic food options near their college.
              Your trusted partner for mess subscriptions and food delivery.
            </p>

            <div className="flex gap-4 pt-3">
              {socialIcons.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white border border-[#FFE6CC] flex items-center justify-center text-[#6B7280] hover:text-white hover:bg-gradient-to-br hover:from-[#FF8A00] hover:to-[#FF6A00] transition-all duration-300 hover:scale-110 shadow-sm"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6A00]" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-sm text-[#6B7280] hover:text-[#FF8A00] transition duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#FF8A00] rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6 relative inline-block">
              Categories
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6A00]" />
            </h3>
            <ul className="space-y-3">
              {categories.map((cat, i) => (
                <li key={i}>
                  <Link
                    to={cat.path}
                    className="text-sm text-[#6B7280] hover:text-[#FF8A00] transition duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#FF8A00] rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* For Business Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-[#1E1E1E] mb-6 relative inline-block">
              For Business
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6A00]" />
            </h3>
            <ul className="space-y-3">
              {forBusiness.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="text-sm text-[#6B7280] hover:text-[#FF8A00] transition duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#FF8A00] rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-[#FFE6CC] to-[#FFE6CC]/50 rounded-3xl p-8 mb-14 flex flex-col md:flex-row justify-between items-center gap-6 border border-[#FF8A00]/20"
        >
          <div>
            <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2 flex items-center gap-2">
              📬 Subscribe to Newsletter
            </h3>
            <p className="text-sm text-[#6B7280]">
              Get exclusive student discounts & food updates delivered to your inbox.
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-72 px-5 py-3 rounded-l-full bg-white border border-[#FFE6CC] focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20 text-[#1E1E1E] placeholder:text-[#6B7280]"
            />
            <button className="bg-gradient-to-r from-[#FF8A00] to-[#FF6A00] px-8 py-3 rounded-r-full font-semibold text-white hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Subscribe <FaArrowRight size={12} />
            </button>
          </div>
        </motion.div>

        {/* Contact Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-[#FFE6CC] hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-[#FFE6CC] flex items-center justify-center">
              <FaMapMarkerAlt className="text-[#FF8A00] text-xl" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wide">Visit Us</p>
              <p className="text-sm font-medium text-[#1E1E1E]">Kolhapur, Maharashtra, India</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-[#FFE6CC] hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-[#FFE6CC] flex items-center justify-center">
              <FaPhone className="text-[#FF8A00] text-xl" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wide">Call Us</p>
              <p className="text-sm font-medium text-[#1E1E1E]">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-[#FFE6CC] hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-[#FFE6CC] flex items-center justify-center">
              <FaEnvelope className="text-[#FF8A00] text-xl" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wide">Email Us</p>
              <p className="text-sm font-medium text-[#1E1E1E]">hello@mahii.in</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 pb-4">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <div className="w-2 h-2 bg-[#FF8A00] rounded-full"></div>
            <span>100% Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <div className="w-2 h-2 bg-[#FF8A00] rounded-full"></div>
            <span>Verified Shops</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <div className="w-2 h-2 bg-[#FF8A00] rounded-full"></div>
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <div className="w-2 h-2 bg-[#FF8A00] rounded-full"></div>
            <span>Student Discounts</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <div className="w-2 h-2 bg-[#FF8A00] rounded-full"></div>
            <span>No Hidden Charges</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FFE6CC] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#6B7280]">
            © {currentYear} Mahii.in. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-xs text-[#6B7280] hover:text-[#FF8A00] transition">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-xs text-[#6B7280] hover:text-[#FF8A00] transition">
              Terms of Service
            </Link>
            <Link to="/refund-policy" className="text-xs text-[#6B7280] hover:text-[#FF8A00] transition">
              Refund Policy
            </Link>
            <Link to="/sitemap" className="text-xs text-[#6B7280] hover:text-[#FF8A00] transition">
              Sitemap
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;