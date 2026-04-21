import React, { useState, useEffect } from 'react';
import { voterApi } from '../services/api';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Fingerprint, ShieldCheck, Sparkles } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await voterApi.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="skeleton h-7 w-48" />
          <div className="skeleton h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center p-8 space-y-4">
            <div className="skeleton w-32 h-32 rounded-full mx-auto" />
            <div className="skeleton h-6 w-32 mx-auto" />
            <div className="skeleton h-4 w-20 mx-auto" />
          </div>
          <div className="md:col-span-2 card p-0">
            <div className="p-6 border-b border-slate-100"><div className="skeleton h-5 w-40" /></div>
            <div className="p-6 grid grid-cols-2 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="space-y-2">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-5 w-36" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return (
    <div className="py-20 text-center">
      <User size={40} className="mx-auto text-slate-300 mb-3" />
      <p className="text-red-400 font-semibold">Failed to load profile details.</p>
    </div>
  );

  const infoItems = [
    { icon: Fingerprint, label: 'Voter Card ID', value: profile.voter_card_id, accent: true },
    { icon: User, label: 'System ID', value: `#${profile.voter_id}` },
    { icon: Calendar, label: 'Date of Birth', value: new Date(profile.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
    { icon: Mail, label: 'Email Address', value: profile.email || 'Not provided' },
    { icon: Phone, label: 'Phone Number', value: profile.phone || 'Not provided' },
    { icon: MapPin, label: 'Residential Address', value: profile.address || 'No address on file', fullWidth: true },
  ];

  return (
    <motion.div 
      className="max-w-4xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Voter Profile</h2>
        <p className="text-slate-500 mt-1">Your registered information in the VoterSync system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Card */}
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card text-center p-8 space-y-5">
            <div className="relative mx-auto w-fit">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-full flex items-center justify-center text-5xl font-black shadow-2xl shadow-primary-200">
                {profile.name.charAt(0)}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-400 rounded-full border-4 border-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{profile.name}</h3>
              <p className="text-sm font-medium text-slate-400">@{profile.username}</p>
            </div>
            <div className="flex flex-col items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                <ShieldCheck size={14} /> Verified Citizen
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 border border-primary-100">
                <Sparkles size={12} /> Active Voter
              </span>
            </div>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <User size={16} className="text-slate-400" />
              <h4 className="font-bold text-slate-700">Personal Information</h4>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {infoItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={idx} 
                    className={`space-y-1.5 ${item.fullWidth ? 'sm:col-span-2' : ''}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.06 }}
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Icon size={12} />
                      {item.label}
                    </div>
                    <div className={`font-semibold text-base ${item.accent ? 'text-primary-600 font-mono font-black text-lg' : 'text-slate-700'}`}>
                      {item.value}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
