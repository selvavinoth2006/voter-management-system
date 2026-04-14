import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { ShieldCheck, User, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('voter'); // 'admin' or 'voter'
  const [identifier, setIdentifier] = useState(''); // email/username/voter_id
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        <div className="bg-primary-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold">VoterSync Platform</h2>
          <p className="text-primary-100 mt-1">Secure Election Management System</p>
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setRole('voter')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                role === 'voter' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Voter Login
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                role === 'admin' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Admin Access
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
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
                  className="input-field pl-12 h-12 rounded-xl transition-all border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  placeholder={role === 'admin' ? 'admin@example.com' : 'Enter your identifier'}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 h-12 rounded-xl transition-all border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  placeholder="••••••••"
                />
              </div>
              {role === 'voter' && (
                <p className="text-[11px] text-slate-400 mt-1 ml-1 font-medium italic">
                  Default password is your DOB (DDMMYYYY)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary-200 mt-4 disabled:opacity-70"
            >
              {loading ? 'Authenticating...' : 'Sign In To Account'}
              {!loading && <ArrowRight size={18} className="ml-2" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
              <CheckCircle2 size={12} className="text-primary-500" />
              Verified Secure Portal
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-sm font-medium">
        &copy; 2024 VoterSync. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;
