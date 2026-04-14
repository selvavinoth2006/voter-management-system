import React, { useState } from 'react';
import { authApi } from '../services/api';
import { Lock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' or 'error'

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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Security Settings</h2>
        <p className="text-slate-500">Update your password to keep your account secure.</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
            <Lock size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-700">Change Password</h4>
            <p className="text-xs text-slate-400 font-medium">Authentication required to update</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {status.message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold border animate-in fade-in slide-in-from-top-2 ${
              status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {status.message}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
            <div className="relative group">
              <input
                type="password"
                name="currentPassword"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                className="input-field h-12 rounded-xl transition-all border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="input-field h-12 rounded-xl border-slate-200"
                placeholder="Min 6 characters"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field h-12 rounded-xl border-slate-200"
                placeholder="Repeat new password"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 rounded-xl font-bold shadow-lg shadow-primary-200 disabled:opacity-70"
            >
              {loading ? 'Updating Security...' : 'Update Password'}
              {!loading && <ShieldCheck size={18} className="ml-2" />}
            </button>
          </div>
        </form>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 italic text-[11px] text-slate-400 font-medium text-center">
          Note: After changing your password, you will use the new one for all future logins.
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
