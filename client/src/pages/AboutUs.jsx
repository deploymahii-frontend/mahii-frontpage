// client/src/pages/AboutUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Heart,
  Users,
  Utensils,
  Award,
  Target,
  Eye,
  TrendingUp,
  Shield,
  Clock,
  Star,
  Quote,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Building2,
  Calendar,
  Rocket,
  Zap,
  Briefcase,
  CheckCircle
} from 'lucide-react';
import { FaFacebook as Facebook, FaInstagram as Instagram, FaTwitter as Twitter, FaLinkedin as Linkedin } from 'react-icons/fa';
import Footer from '../components/common/Footer';

const AboutUs = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

     // Stats data
    const stats = [
     { value: "50K+", label: "Orders Completed", icon: Utensils },
     { value: "200+", label: "Restaurant Partners", icon: Building2 },
     { value: "10K+", label: "Happy Students", icon: Users },
     { value: "15+", label: "Cities in India", icon: MapPin },
    ];

  // Journey timeline
  const journey = [
    { year: "2026", title: "Launch soon", description: "Started our journey to connect students with affordable food" },
      //{ year: "2024", title: "Student Mess Subscription", description: "Introduced monthly mess plans with attendance tracking" },
    //{ year: "2025", title: "Quick Commerce Integration", description: "Expanded to include cafes, hotels, and street food" }
  ];

  // Management Team
  const managementTeam = [
    {
      name: "Om Junjal",
      role: "Founder & CEO",
      bio: "Cmputer science and Engineering Student",
      image: "#",
      social: { linkedin: " https://www.linkedin.com/in/om-jaunjal-8b2414306?utm_source=share_via&utm_content=profile&utm_medium=member_android",
         Instagram: " https://www.instagram.com/omjaunjal_?igsh=MXA1Z3I5dGl4dHM2bA==" }
    },
    {
      name: "Karishma Jaunjalkar",
      role: "Project Manager",
      bio: "Cmputer science and Engineering Student",
      image: "#",
      social: { linkedin: "#", Instagram: "#" }
    },
    {
      name: "Jay Gangapure",
      role: "Product Manager",
      bio: "Cmputer science and Engineering Student",
      image: "#",
      social: { linkedin: "#", Instagram: "#" }
    },
    {
      name: "Ayush Mane",
      role: "CIO (Chief Information Officer)",
      bio: "Cmputer science and Engineering Student",
      image: "#",
      social: { linkedin: "https://www.linkedin.com/in/ayush-mane-6a7a6333b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
         Instagram: " https://www.instagram.com/_ayush1803?igsh=YWsxd3cxNnNzcGJx" }
    }
  ];

  // Values
  const values = [
    {
      title: "Student First",
      description: "Every decision is made keeping students' needs at the center",
      icon: Heart
    },
    {
      title: "Quality Assurance",
      description: "Verified shops and quality checks for your safety",
      icon: Shield
    },
    {
      title: "Affordability",
      description: "Best prices with student-friendly subscription plans",
      icon: TrendingUp
    },
    {
      title: "Transparency",
      description: "Clear pricing, no hidden charges, honest reviews",
      icon: Eye
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section - Similar to Swiggy */}
      <section className="bg-white border-b border-gray-100 py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
                <Heart size={14} className="text-[#FF6B35]" />
                <span className="text-xs font-medium text-[#FF6B35]">About Mahii</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Elevating Student Life with
                <span className="text-[#FF6B35]"> Unparalleled Convenience</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Mahii is a student-first convenience platform offering easy access to affordable 
                food, mess subscriptions, and dining experiences through a unified website.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <Calendar size={14} className="text-[#FF6B35]" />
                <span className="text-sm text-gray-600">Launched Soon 2026</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-700 text-lg leading-relaxed">
              Our mission is to elevate the quality of life for students by offering unparalleled 
              convenience in food discovery and mess management. Convenience is what makes us tick. 
              It's what makes us get out of bed and say, "Let's do this."
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={22} className="text-[#FF6B35]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Industry Pioneer Section */}
      {/*<section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full mb-4">
                <Rocket size={12} className="text-[#FF6B35]" />
                <span className="text-xs font-medium text-[#FF6B35]">Industry Pioneer</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Pioneering Student Food Discovery in India
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Mahii is a pioneer in the student food discovery space, launching the first 
                integrated mess subscription platform in 2026. Due to our pioneering status, 
                we are well-recognized as a leader in student convenience, trusted by thousands 
                of students across India.
              </p>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-2xl font-bold text-[#FF6B35]">10K+</p>
                  <p className="text-xs text-gray-500">Active Students</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#FF6B35]">200+</p>
                  <p className="text-xs text-gray-500">Partner Shops</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#FF6B35]">4.8</p>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Mahii Team"
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                    <Quote size={14} className="text-[#FF6B35]" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">"Students First, Always"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* The Mahii Journey */}
      {/* <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full mb-3">
              <Calendar size={12} className="text-[#FF6B35]" />
              <span className="text-xs font-medium text-[#FF6B35]">Our Journey</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">The Mahii Journey</h2>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 hidden md:block"></div>
            <div className="space-y-8">
              {journey.map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 md:text-right">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <span className="text-[#FF6B35] font-bold">{item.year}</span>
                      <h3 className="font-semibold text-gray-900 mt-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}


      {/* Management Team Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full mb-3">
              <Users size={12} className="text-[#FF6B35]" />
              <span className="text-xs font-medium text-[#FF6B35]">Management</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Management Team</h2>
            <p className="text-gray-500 mt-2">The experts driving Mahii's day-to-day operations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementTeam.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                  <p className="text-[#FF6B35] text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
                  <div className="flex gap-2 mt-4">
                    <a href={member.social.linkedin} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#FF6B35] hover:text-white transition">
                      <Linkedin size={14} />
                    </a>
                    <a href={member.social.Instagram} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#FF6B35] hover:text-white transition">
                      <Twitter size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full mb-3">
              <Heart size={12} className="text-[#FF6B35]" />
              <span className="text-xs font-medium text-[#FF6B35]">Our Values</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What Drives Us</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
                  <value.icon size={18} className="text-[#FF6B35]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Section */}
      {/* <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Careers at Mahii
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              When you work at Mahii, you're joining a culture of innovation, teamwork, and endless possibilities. 
              We believe in empowering our employees to take charge of their careers and make a real impact.
            </p>
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 bg-[#FF6B35] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#e55a2b] transition"
            >
              Explore Openings
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-[#FF6B35]">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Start Your Food Journey?
          </h2>
          <p className="text-white/90 mb-6">
            Join thousands of students already using Mahii to discover amazing food
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/explore"
              className="bg-white text-[#FF6B35] px-6 py-2.5 rounded-full font-medium hover:bg-gray-100 transition"
            >
              Explore Food
            </Link>
            <Link
              to="/register/shopowner"
              className="border-2 border-white text-white px-6 py-2.5 rounded-full font-medium hover:bg-white hover:text-[#FF6B35] transition"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;