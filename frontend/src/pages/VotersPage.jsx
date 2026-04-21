import React, { useState, useEffect } from 'react';
import { voterApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Edit2, Trash2, X, Check, Users, Filter } from 'lucide-react';

const VotersPage = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' or 'error'
  const [formData, setFormData] = useState({
    voter_card_id: '', name: '', dob: '', gender: 'Male', address: '', phone: '', email: '', username: ''
  });

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const response = await voterApi.getAll();
      setVoters(response.data);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to load voters. Please refresh.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (voter = null) => {
    setStatus({ type: '', message: '' });
    if (voter) {
      setEditingVoter(voter);
      const date = voter.dob ? new Date(voter.dob).toISOString().split('T')[0] : '';
      setFormData({ ...voter, dob: date });
    } else {
      setEditingVoter(null);
      setFormData({ voter_card_id: '', name: '', dob: '', gender: 'Male', address: '', phone: '', email: '', username: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      if (editingVoter) {
        await voterApi.update(editingVoter.voter_id, formData);
        setStatus({ type: 'success', message: 'Voter updated successfully!' });
      } else {
        await voterApi.create(formData);
        setStatus({ type: 'success', message: 'Voter registered successfully!' });
      }
      setTimeout(() => setShowModal(false), 1500);
      fetchVoters();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Error saving voter details.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this voter?")) {
      try {
        await voterApi.delete(id);
        fetchVoters();
        setStatus({ type: 'success', message: 'Voter deleted successfully!' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to delete voter.' });
      }
    }
  };

  const filteredVoters = voters.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.voter_id?.toString() === searchTerm ||
    v.voter_card_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800">Voter Management</h2>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {voters.length} total
            </span>
          </div>
          <p className="text-slate-500 mt-1">Register and manage citizens eligible for voting.</p>
        </div>
        <motion.button 
          onClick={() => handleOpenModal()} 
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlus size={18} />
          Register New Voter
        </motion.button>
      </div>

      {/* Status message */}
      <AnimatePresence>
        {status.message && !showModal && (
          <motion.div 
            className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 border ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
            }`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {status.type === 'success' ? <Check size={18} /> : <X size={18} />}
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Card */}
      <div className="card p-0 overflow-hidden">
        {/* Search bar */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, username, card ID..."
              className="input-field pl-11 h-11 bg-slate-50 border-slate-100 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="h-11 px-4 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2 font-medium text-sm">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Voter Detail</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Info</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Security</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && voters.length === 0 ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-5"><div className="flex items-center gap-3"><div className="skeleton w-9 h-9 rounded-lg" /><div className="space-y-2"><div className="skeleton h-4 w-32" /><div className="skeleton h-3 w-24" /></div></div></td>
                    <td className="py-4 px-5"><div className="space-y-2"><div className="skeleton h-3 w-36" /><div className="skeleton h-3 w-24" /></div></td>
                    <td className="py-4 px-5"><div className="skeleton h-5 w-16 rounded-full" /></td>
                    <td className="py-4 px-5"><div className="flex justify-end gap-2"><div className="skeleton w-8 h-8 rounded-lg" /><div className="skeleton w-8 h-8 rounded-lg" /></div></td>
                  </tr>
                ))
              ) : filteredVoters.length > 0 ? (
                filteredVoters.map((voter, idx) => (
                  <motion.tr 
                    key={voter.voter_id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {voter.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{voter.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            <span className="font-mono font-semibold text-primary-500">{voter.voter_card_id}</span>
                            <span className="mx-1.5 text-slate-300">•</span>
                            @{voter.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-sm text-slate-600 font-medium">{voter.email}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{voter.phone}</div>
                    </td>
                    <td className="py-4 px-5">
                      {voter.has_changed_password ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">
                          <Check size={10} /> Secure
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 uppercase tracking-widest border border-amber-100">
                          Default
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(voter)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(voter.voter_id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <Users size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">No voters found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{editingVoter ? 'Edit Voter' : 'Register New Voter'}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Fill in the required details below</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <AnimatePresence>
                  {status.message && (
                    <motion.div 
                      className={`p-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                        status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                      }`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {status.type === 'success' ? <Check size={16} /> : <X size={16} />}
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Voter Card ID</label>
                    <input required className="input-field font-mono uppercase text-sm h-10" value={formData.voter_card_id} onChange={e => setFormData({...formData, voter_card_id: e.target.value.toUpperCase()})} placeholder="SCF2222198" maxLength={10} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</label>
                    <input required className="input-field text-sm h-10" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Username</label>
                    <input required className="input-field text-sm h-10" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="johndoe123" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</label>
                    <input type="email" required className="input-field text-sm h-10" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Date of Birth</label>
                    <input type="date" required className="input-field text-sm h-10" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</label>
                    <input required className="input-field text-sm h-10" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1234567890" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Gender</label>
                    <select className="input-field text-sm h-10" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Address</label>
                  <textarea className="input-field resize-none h-20 text-sm" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Enter complete address"></textarea>
                </div>
                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 h-11">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 h-11">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (editingVoter ? 'Update Voter' : 'Register Voter')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VotersPage;
