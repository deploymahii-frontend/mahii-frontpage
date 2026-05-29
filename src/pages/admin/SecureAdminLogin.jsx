import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Fingerprint,
  Key,
  Mail,
  CheckCircle2,
  Clock,
  Ban,
  LogIn,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SecureAdminLogin = () => {
  const [step, setStep] = useState('secret');
  const [secretKey, setSecretKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutTime, setLockoutTime] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedLockout = localStorage.getItem('adminLockoutUntil');
    if (savedLockout && new Date(savedLockout) > new Date()) {
      setLockoutTime(new Date(savedLockout));
    }
  }, []);

  useEffect(() => {
    if (!lockoutTime) return;

    const interval = setInterval(() => {
      const remaining = new Date(lockoutTime) - new Date();
      if (remaining <= 0) {
        clearInterval(interval);
        setLockoutTime(null);
        localStorage.removeItem('adminLockoutUntil');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTime]);

  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return null;
    const remaining = new Date(lockoutTime) - new Date();
    if (remaining <= 0) return null;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSecretKeySubmit = async (e) => {
    e.preventDefault();
    if (lockoutTime) return;

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyAdminSecret({ secretKey });

      if (response.data.success) {
        setStep('login');
        toast.success('Secret key verified. Proceed to admin credentials.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTime) return;

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password, 'admin', { secretKey });
      if (result.success) {
        if (result.user?.mfaEnabled) {
          setStep('mfa');
          toast.success('Enter your authentication code');
        } else {
          toast.success('Welcome to the Admin Portal');
          navigate('/admin/dashboard');
        }
      } else {
        setError(result.error || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTime) return;

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyMfa({ email, otp });
      if (response.data.success) {
        toast.success('MFA verified! Redirecting...');
        navigate('/admin/dashboard');
      } else {
        setError(response.data.message || 'Invalid authentication code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (lockoutTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center border border-white/10 shadow-2xl">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban size={40} className="text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Access Locked</h2>
          <p className="text-gray-300 mb-4">Too many failed secret-key attempts. Please wait to retry.</p>
          <div className="bg-white/10 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-yellow-300">
              <Clock size={20} />
              <span className="font-mono text-xl">{getRemainingLockoutTime()}</span>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-gray-300 hover:text-white transition"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-20 w-80 h-80 bg-[#C2185B]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00B8D9]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-10 w-60 h-60 bg-[#FFB300]/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-xl w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/10">
            <Shield size={16} className="text-emerald-300" />
            <span className="text-xs font-mono text-emerald-200">SECURE ADMIN PORTAL</span>
          </div>
          <div className="w-24 h-24 bg-gradient-to-br from-[#C2185B] to-[#FF2E4C] rounded-3xl flex items-center justify-center mx-auto shadow-[0_30px_80px_rgba(255,46,76,0.35)]">
            <Shield size={40} className="text-white" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {['secret', 'login', 'mfa'].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step === s
                  ? 'bg-[#C2185B] text-white shadow-xl'
                  : idx < ['secret', 'login', 'mfa'].indexOf(step)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 text-slate-400'
              }`}>
                {idx < ['secret', 'login', 'mfa'].indexOf(step) ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
              {idx < 2 && (
                <div className={`w-12 h-0.5 mx-1 ${idx < ['secret', 'login', 'mfa'].indexOf(step) ? 'bg-emerald-500' : 'bg-white/15'}`} />
              )}
            </div>
          ))}
        </div>

        {step === 'secret' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl text-white font-semibold mb-2">Enter access key</h2>
              <p className="text-sm text-slate-400">Only authorized administrators may continue.</p>
            </div>

            <form onSubmit={handleSecretKeySubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Access Key</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    type="password"
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#C2185B] transition"
                    placeholder="Enter your secret invite key"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/20 rounded-2xl text-red-200">
                  <AlertCircle size={18} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#C2185B] to-[#FF2E4C] py-3 font-semibold text-white transition hover:shadow-xl disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify Access Key'}
              </button>
            </form>

            <p className="mt-6 text-xs text-slate-500 text-center">
              This page is intentionally unlinked. Unauthorized access attempts are logged.
            </p>
          </motion.div>
        )}

        {step === 'login' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl text-white font-semibold mb-2">Admin credentials</h2>
              <p className="text-sm text-slate-400">Enter your admin email and password.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#C2185B] transition"
                    placeholder="admin@mahii.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#C2185B] transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/20 rounded-2xl text-red-200">
                  <AlertCircle size={18} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#C2185B] to-[#FF2E4C] py-3 font-semibold text-white transition hover:shadow-xl disabled:opacity-60"
              >
                {loading ? 'Authenticating...' : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn size={18} />
                    Login to Admin Portal
                  </div>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'mfa' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10"
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
                <Fingerprint size={28} className="text-white" />
              </div>
              <h2 className="text-3xl text-white font-semibold mb-2">Two-Factor Authentication</h2>
              <p className="text-sm text-slate-400">Enter your authenticator code.</p>
            </div>

            <form onSubmit={handleMfaSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Authentication Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  autoFocus
                  className="w-full rounded-2xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-widest py-3 focus:outline-none focus:border-[#C2185B] transition"
                  placeholder="000000"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/20 rounded-2xl text-red-200">
                  <AlertCircle size={18} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-semibold text-white transition hover:shadow-xl disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-4">
              Lost your authenticator? Contact your super administrator.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SecureAdminLogin;
