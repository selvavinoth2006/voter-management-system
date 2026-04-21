import React, { useState } from 'react';
import { authApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, AlertCircle, ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' or 'error'
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'New passwords do not match!' });
    }
    if (formData.newPassword.length < 6) {
      return setStatus({ type: 'error', message: 'New password must be at least 6 characters long!' });
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await authApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setStatus({ type: 'success', message: 'Password updated successfully! Next time you login, use your new password.' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = () => {
    const pwd = formData.newPassword;
    if (pwd.length === 0) return { level: 0, label: '', color: '' };
    if (pwd.length < 6) return { level: 1, label: 'Weak', color: 'bg-red-400' };
    if (pwd.length < 10) return { level: 2, label: 'Fair', color: 'bg-amber-400' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) return { level: 4, label: 'Strong', color: 'bg-emerald-400' };
    return { level: 3, label: 'Good', color: 'bg-blue-400' };
  };

  const strength = getStrength();

  return (
    <motion.div 
      className="max-w-2xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Security Settings</h2>
        <p className="text-slate-500 mt-1">Update your password to keep your account secure.</p>
      </div>

      <div className="card p-0 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-400 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
            <KeyRound size={18} />
          </div>
          <div>
            <h4 className="font-bold text-slate-700">Change Password</h4>
            <p className="text-xs text-slate-400 font-medium">Authentication required to update</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <AnimatePresence>
            {status.message && (
              <motion.div 
                className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold border ${
                  status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Current Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500">
                <Lock size={18} />
              </div>
              <input
                type={showCurrent ? 'text' : 'password'}
                name="currentPassword"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                className="input-field pl-12 pr-12 h-12"
                placeholder="Enter current password"
              />
              <button 
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">New Password</label>
              <div className="relative group">
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="input-field pr-12 h-12"
                  placeholder="Min 6 characters"
                />
                <button 
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password strength indicator */}
              {formData.newPassword.length > 0 && (
                <motion.div 
                  className="space-y-1.5 pt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-slate-100'}`} />
                    ))}
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    strength.level <= 1 ? 'text-red-400' : strength.level === 2 ? 'text-amber-400' : strength.level === 3 ? 'text-blue-400' : 'text-emerald-400'
                  }`}>
                    {strength.label}
                  </p>
                </motion.div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field h-12 ${
                  formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' 
                    : ''
                }`}
                placeholder="Repeat new password"
              />
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mt-1">Passwords don't match</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 rounded-xl font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating Security...
                </div>
              ) : (
                <>Update Password <ShieldCheck size={18} /></>
              )}
            </button>
          </div>
        </form>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 font-medium text-center">
          Note: After changing your password, you will use the new one for all future logins.
        </div>
      </div>
    </motion.div>
  );
};

export default ChangePasswordPage;
