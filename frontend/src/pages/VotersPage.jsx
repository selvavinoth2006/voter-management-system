import React, { useState, useEffect } from 'react';
import { voterApi } from '../services/api';
import { UserPlus, Search, Edit2, Trash2, X, Check } from 'lucide-react';

const VotersPage = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVoter, setEditingVoter] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' or 'error'
  const [formData, setFormData] = useState({
    name: '', dob: '', gender: 'Male', address: '', phone: '', email: '', username: ''
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
      setFormData({ name: '', dob: '', gender: 'Male', address: '', phone: '', email: '', username: '' });
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
    v.voter_id?.toString() === searchTerm
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Voter Management</h2>
          <p className="text-slate-500">Register and manage citizens eligible for voting.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <UserPlus size={20} />
          Register New Voter
        </button>
      </div>

      {status.message && !showModal && (
        <div className={`p-4 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2 flex items-center gap-2 ${
          status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {status.type === 'success' ? <Check size={18} /> : <X size={18} />}
          {status.message}
        </div>
      )}

      <div className="card">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, username or ID..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-sm uppercase tracking-wider font-semibold">
                <th className="py-4 px-4 font-semibold">Voter Detail</th>
                <th className="py-4 px-4 font-semibold">Contact Info</th>
                <th className="py-4 px-4 font-semibold">Security</th>
                <th className="py-4 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && voters.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-400">Loading voters...</td></tr>
              ) : filteredVoters.length > 0 ? (
                filteredVoters.map((voter) => (
                  <tr key={voter.voter_id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{voter.name}</div>
                      <div className="text-xs text-slate-400">ID: #{voter.voter_id} | @{voter.username}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-slate-600 font-medium">{voter.email}</div>
                      <div className="text-xs text-slate-400">{voter.phone}</div>
                    </td>
                    <td className="py-4 px-4">
                      {voter.has_changed_password ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-600 uppercase tracking-widest">Secure</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-600 uppercase tracking-widest">Default Pass</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(voter)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(voter.voter_id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="py-8 text-center text-slate-400">No voters found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">{editingVoter ? 'Edit Voter' : 'Register New Voter'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {status.message && (
                <div className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {status.type === 'success' ? <Check size={16} /> : <X size={16} />}
                  {status.message}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Username</label>
                  <input required className="input-field" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="johndoe123" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
                  <input type="date" required className="input-field" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Gender</label>
                  <select className="input-field" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Phone</label>
                  <input required className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1234567890" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Residential Address</label>
                <textarea className="input-field resize-none h-20" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Enter complete address"></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Processing...' : (editingVoter ? 'Update Voter' : 'Complete Registration')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotersPage;
