import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../services/api';
import { ShieldCheck, User, Lock, Mail, ArrowRight, CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('voter');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (role === 'admin') {
        response = await authApi.adminLogin({ username: identifier, password });
      } else {
        response = await authApi.voterLogin({ identifier, password });
      }

      const { token, role: userRole } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      
      onLogin(userRole);
      
      if (userRole === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/voting');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)' }}>
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] right-[15%] w-56 h-56 bg-accent-600/20 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '48px 48px'
            }}
          />
        </div>

        <motion.div 
          className="relative z-10 max-w-md space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30" style={{ background: 'linear-gradient(135deg, #1a65f5, #3385ff, #59a8ff)' }}>
              <ShieldCheck size={26} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">VoterSync</span>
          </div>
          
          <h2 className="text-4xl font-black text-white leading-tight">
            Secure. Transparent.{' '}
            <span style={{ backgroundImage: 'linear-gradient(to right, #59a8ff, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Democratic.
            </span>
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed">
            Access the most trusted election management platform. Your vote is encrypted, verified, and permanently secured.
          </p>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Auditable Ledger</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right panel – login form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white relative">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(at 40% 20%, rgba(26, 101, 245, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(217, 70, 239, 0.08) 0px, transparent 50%)' }} />
        
        <motion.div 
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30" style={{ background: 'linear-gradient(135deg, #1a65f5, #3385ff, #59a8ff)' }}>
              <ShieldCheck size={22} />
            </div>
            <span className="font-bold text-xl text-slate-800">VoterSync</span>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-black text-slate-900">Welcome back</h2>
            <p className="text-slate-500 font-medium">Sign in to your account to continue</p>
          </div>

          {/* Role switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setRole('voter')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                role === 'voter' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User size={16} />
              Voter Login
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                role === 'admin' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck size={16} />
              Admin Access
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-3"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-500 text-xs font-bold">!</span>
                </div>
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                {role === 'admin' ? 'Admin Email' : 'Voter ID / Username / Email'}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500">
                  {role === 'admin' ? <Mail size={18} /> : <User size={18} />}
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input-field pl-12 h-12"
                  placeholder={role === 'admin' ? 'admin@example.com' : 'Enter your identifier'}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 pr-12 h-12"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {role === 'voter' && (
                <p className="text-[11px] text-slate-400 mt-1.5 ml-1 font-medium italic">
                  Default password is your DOB (DDMMYYYY)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 rounded-xl text-base font-bold mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <>Sign In To Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <Sparkles size={12} className="text-primary-500" />
              Verified Secure Portal
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
