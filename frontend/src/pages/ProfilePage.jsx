import React, { useState, useEffect } from 'react';
import { voterApi } from '../services/api';
import { User, Mail, Phone, MapPin, Calendar, Fingerprint, ShieldCheck } from 'lucide-react';

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

  if (loading) return <div className="py-12 text-center text-slate-400">Loading your profile...</div>;
  if (!profile) return <div className="py-12 text-center text-red-400">Failed to load profile details.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Voter Profile</h2>
        <p className="text-slate-500">Your registered information in the VoterSync system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="card text-center p-8 space-y-4">
            <div className="w-32 h-32 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-4xl font-black mx-auto shadow-inner">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{profile.name}</h3>
              <p className="text-sm font-medium text-slate-400">@{profile.username}</p>
            </div>
            <div className="pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                <ShieldCheck size={14} /> Verified Citizen
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h4 className="font-bold text-slate-700">Personal Information</h4>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Fingerprint size={12} /> Voter ID
                </div>
                <div className="text-slate-700 font-semibold">{profile.voter_id}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar size={12} /> Date of Birth
                </div>
                <div className="text-slate-700 font-semibold">{new Date(profile.dob).toLocaleDateString()}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Mail size={12} /> Email Address
                </div>
                <div className="text-slate-700 font-semibold">{profile.email || 'Not provided'}</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Phone size={12} /> Phone Number
                </div>
                <div className="text-slate-700 font-semibold">{profile.phone || 'Not provided'}</div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin size={12} /> Residential Address
                </div>
                <div className="text-slate-700 font-semibold">{profile.address || 'No address on file'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
