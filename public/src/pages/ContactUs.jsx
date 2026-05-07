import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Headphones,
  FileText,
  Star,
  Users,
  Building2,
  Shield
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { contactAPI } from '../services/api';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const subjects = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'order', label: 'Order Issue', icon: FileText },
    { value: 'subscription', label: 'Subscription Problem', icon: Star },
    { value: 'payment', label: 'Payment Issue', icon: Shield },
    { value: 'partnership', label: 'Partnership Inquiry', icon: Building2 },
    { value: 'complaint', label: 'Complaint', icon: AlertCircle },
    { value: 'feedback', label: 'Feedback', icon: Users },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Pune, Maharashtra", "India - 411001"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 87654 32109"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@mahii.com", "partners@mahii.com"],
    },
    {
      icon: Clock,
      title: "Support Hours",
      details: ["Mon - Sat: 9AM - 8PM", "Sunday: Closed"],
    }
  ];

  const faqs = [
    {
      q: "How do I subscribe to a mess plan?",
      a: "Simply browse messes near you, select a plan (weekly/monthly), and complete the payment. Your subscription will be activated immediately."
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes, you can cancel your subscription from your dashboard. Refunds are processed as per our cancellation policy."
    },
    {
      q: "How do I mark my meal attendance?",
      a: "You can scan the QR code at the mess or manually mark attendance from your subscription page."
    },
    {
      q: "How do I list my shop on Mahii?",
      a: "Click on 'Partner With Us' button, fill out the registration form, and our team will verify and approve your shop within 48 hours."
    },
    {
      q: "Is my payment secure?",
      a: "Yes, all payments are processed through Razorpay, a PCI-DSS compliant payment gateway with bank-grade security."
    },
    {
      q: "What is your refund policy?",
      a: "Refunds are processed within 7-10 business days for eligible cancellations. Contact support for specific cases."
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await contactAPI.submitContact(formData);
      setSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section - Simple */}
      <section className="bg-white border-b border-gray-100 py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
              <Headphones size={14} className="text-[#FF6B35]" />
              <span className="text-xs font-medium text-[#FF6B35]">Get in Touch</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              We're Here to Help!
            </h1>
            <p className="text-gray-600">
              Have questions, feedback, or want to partner with us? Reach out anytime.
              Our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition text-center"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <info.icon size={20} className="text-[#FF6B35]" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-500 text-sm">{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Contact Form */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Send us a Message</h2>
                <p className="text-gray-500 text-sm">
                  Fill out the form and we'll get back to you within 24 hours
                </p>
              </div>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-700 mb-1">Message Sent!</h3>
                  <p className="text-green-600 text-sm">
                    Thank you for reaching out. Our team will respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] appearance-none bg-white"
                    >
                      {subjects.map((sub) => (
                        <option key={sub.value} value={sub.value}>
                          {sub.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF6B35] text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#e55a2b] transition"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map & Social Section */}
            <div className="space-y-5">
              {/* Map */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Our Location</h3>
                  <p className="text-sm text-gray-500">Visit our office in Pune</p>
                </div>
                <div className="h-56 w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242117.6814488127!2d73.6981503180381!3d18.52469014203233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mahii Location"
                  ></iframe>
                </div>
              </div>

              {/* Social Connect */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">Connect With Us</h3>
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/mahii" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#FF6B35] hover:text-white transition">
                    <FaFacebook size={18} />
                  </a>
                  <a href="https://www.instagram.com/mahii" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#FF6B35] hover:text-white transition">
                    <FaInstagram size={18} />
                  </a>
                  <a href="https://www.twitter.com/mahii" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#FF6B35] hover:text-white transition">
                    <FaTwitter size={18} />
                  </a>
                  <a href="https://www.linkedin.com/company/mahii" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#FF6B35] hover:text-white transition">
                    <FaLinkedin size={18} />
                  </a>
                  <a href="https://www.youtube.com/mahii" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#FF6B35] hover:text-white transition">
                    <FaYoutube size={18} />
                  </a>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="bg-[#25D366] rounded-xl p-5 text-white shadow-sm">
                <div className="flex items-center gap-3">
                  <MessageCircle size={28} />
                  <div>
                    <h3 className="font-semibold">WhatsApp Support</h3>
                    <p className="text-sm opacity-90">Chat with us on WhatsApp</p>
                    <a 
                      href="https://wa.me/919876543210" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-2 bg-white text-[#25D366] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                    >
                      Start Chat →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full mb-3">
                  <Building2 size={12} className="text-[#FF6B35]" />
                  <span className="text-xs font-medium text-[#FF6B35]">Partner With Us</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                  Want to List Your Mess or Restaurant?
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  Join Mahii and reach thousands of students looking for quality food options near them.
                  Get verified, increase your visibility, and grow your business.
                </p>
                <ul className="space-y-2 mb-5">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-[#FF6B35]" />
                    <span>Free registration & onboarding</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-[#FF6B35]" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-[#FF6B35]" />
                    <span>Marketing & promotion support</span>
                  </li>
                </ul>
                <Link
                  to="/register/shopowner"
                  className="inline-flex items-center gap-2 bg-[#FF6B35] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#e55a2b] transition"
                >
                  Register Your Shop
                  <ChevronRight size={16} />
                </Link>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=350&fit=crop"
                  alt="Restaurant partnership"
                  className="rounded-xl shadow-md w-full h-56 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full mb-2">
              <MessageCircle size={12} className="text-[#FF6B35]" />
              <span className="text-xs font-medium text-[#FF6B35]">FAQ</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-sm">
              Find answers to common questions about Mahii
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-5 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-800 text-sm">{faq.q}</span>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform ${openFaq === index ? 'rotate-90' : ''}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-3">
                    <p className="text-gray-500 text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactUs;