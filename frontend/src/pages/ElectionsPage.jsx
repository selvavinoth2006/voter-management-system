import React, { useState, useEffect } from 'react';
import { electionApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Plus, Search, Edit2, Trash2, X, Check, Calendar, Activity, Clock, CheckCircle2, Filter } from 'lucide-react';

const ElectionsPage = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', election_date: '', status: 'upcoming'
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await electionApi.getAll();
      setElections(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (election = null) => {
    if (election) {
      setEditingElection(election);
      // Format date for input: YYYY-MM-DD
      const date = election.election_date ? new Date(election.election_date).toISOString().split('T')[0] : '';
      setFormData({ ...election, election_date: date });
    } else {
      setEditingElection(null);
      setFormData({ title: '', description: '', election_date: '', status: 'upcoming' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingElection) {
        await electionApi.update(editingElection.election_id, formData);
      } else {
        await electionApi.create(formData);
      }
      setShowModal(false);
      fetchElections();
    } catch (err) {
      alert("Error saving election: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this election? All associated candidates and votes will be affected.")) {
      try {
        await electionApi.delete(id);
        fetchElections();
      } catch (err) {
        alert("Error deleting election: " + err.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100">
            <Activity size={10} /> Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-widest border border-blue-100">
            <CheckCircle2 size={10} /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 uppercase tracking-widest border border-amber-100">
            <Clock size={10} /> Upcoming
          </span>
        );
    }
  };

  const filteredElections = elections.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800">Election Management</h2>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {elections.length} total
            </span>
          </div>
          <p className="text-slate-500 mt-1">Create and oversee the election lifecycle.</p>
        </div>
        <motion.button 
          onClick={() => handleOpenModal()} 
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Create New Election
        </motion.button>
      </div>

      {/* Table Card */}
      <div className="card p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search elections..."
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Election Detail</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-5"><div className="space-y-2"><div className="skeleton h-4 w-40" /><div className="skeleton h-3 w-56" /></div></td>
                    <td className="py-4 px-5"><div className="skeleton h-4 w-24" /></td>
                    <td className="py-4 px-5"><div className="skeleton h-6 w-20 rounded-full" /></td>
                    <td className="py-4 px-5"><div className="flex justify-end gap-2"><div className="skeleton w-8 h-8 rounded-lg" /><div className="skeleton w-8 h-8 rounded-lg" /></div></td>
                  </tr>
                ))
              ) : filteredElections.length > 0 ? (
                filteredElections.map((election, idx) => (
                  <motion.tr 
                    key={election.election_id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white shrink-0">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{election.title}</div>
                          <div className="text-xs text-slate-400 max-w-xs truncate mt-0.5">{election.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(election.election_date).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      {getStatusBadge(election.status)}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(election)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(election.election_id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <ShieldCheck size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">No elections found.</p>
                    <button onClick={() => handleOpenModal()} className="text-primary-600 text-sm font-semibold mt-2 hover:underline">
                      Create your first election →
                    </button>
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{editingElection ? 'Edit Election' : 'Create Election'}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Configure election settings</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Election Title</label>
                  <input required className="input-field text-sm h-10" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. General Election 2024" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</label>
                  <textarea className="input-field min-h-[100px] text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the election purpose..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</label>
                    <input type="date" required className="input-field text-sm h-10" value={formData.election_date} onChange={e => setFormData({...formData, election_date: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</label>
                    <select className="input-field text-sm h-10" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 h-11">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 h-11">
                    <Check size={18} />
                    {editingElection ? 'Update' : 'Create'}
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

export default ElectionsPage;
