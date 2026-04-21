import React, { useState, useEffect } from 'react';
import { candidateApi, electionApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserSquare2, Search, Edit2, Trash2, X, Check, Landmark, Filter, Award } from 'lucide-react';

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [elections, setElections] = useState([]);
  const [formData, setFormData] = useState({
    name: '', party: '', constituency: '', age: '', gender: 'Male', election_id: ''
  });

  useEffect(() => {
    fetchCandidates();
    fetchElections();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await candidateApi.getAll();
      setCandidates(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchElections = async () => {
    try {
      const response = await electionApi.getAll();
      setElections(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (candidate = null) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData({ ...candidate });
    } else {
      setEditingCandidate(null);
      setFormData({ name: '', party: '', constituency: '', age: '', gender: 'Male', election_id: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCandidate) {
        await candidateApi.update(editingCandidate.candidate_id, formData);
      } else {
        await candidateApi.create(formData);
      }
      setShowModal(false);
      fetchCandidates();
    } catch (err) {
      alert("Error saving candidate: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await candidateApi.delete(id);
        fetchCandidates();
      } catch (err) {
        alert("Error deleting candidate: " + err.message);
      }
    }
  };

  const getElectionTitle = (id) => {
    const election = elections.find(e => e.election_id === id);
    return election ? election.title : 'Unassigned';
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-violet-500 to-purple-400',
    'from-amber-500 to-orange-400',
    'from-emerald-500 to-teal-400',
    'from-rose-500 to-pink-400',
    'from-indigo-500 to-blue-400',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800">Candidate Management</h2>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {candidates.length} total
            </span>
          </div>
          <p className="text-slate-500 mt-1">Manage election participants and their information.</p>
        </div>
        <motion.button 
          onClick={() => handleOpenModal()} 
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserSquare2 size={18} />
          Nominate Candidate
        </motion.button>
      </div>

      {/* Search & Grid Card */}
      <div className="card p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or party..."
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

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-100 p-6 space-y-4">
                  <div className="flex justify-between">
                    <div className="skeleton w-12 h-12 rounded-xl" />
                    <div className="flex gap-1">
                      <div className="skeleton w-8 h-8 rounded-lg" />
                      <div className="skeleton w-8 h-8 rounded-lg" />
                    </div>
                  </div>
                  <div className="skeleton h-5 w-32" />
                  <div className="skeleton h-4 w-24" />
                  <div className="flex gap-2">
                    <div className="skeleton h-6 w-20 rounded-full" />
                    <div className="skeleton h-6 w-24 rounded-full" />
                  </div>
                </div>
              ))
            ) : filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate, idx) => (
                <motion.div 
                  key={candidate.candidate_id} 
                  className="border border-slate-100 rounded-xl p-6 hover:shadow-lg hover:border-slate-200 transition-all duration-300 group bg-white relative overflow-hidden"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  {/* Subtle gradient accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[idx % gradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradients[idx % gradients.length]} text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {candidate.name.charAt(0)}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(candidate)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(candidate.candidate_id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{candidate.name}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Landmark size={14} className="text-slate-400" />
                      {candidate.party}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100">
                        {candidate.constituency}
                      </div>
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary-50 text-primary-600 border border-primary-100">
                        {getElectionTitle(candidate.election_id)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-100 rounded-xl">
                <Award size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400 text-sm font-medium">No candidates registered yet.</p>
                <button onClick={() => handleOpenModal()} className="text-primary-600 text-sm font-semibold mt-2 hover:underline">
                  Nominate the first candidate →
                </button>
              </div>
            )}
          </div>
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
                  <h3 className="text-lg font-bold text-slate-800">{editingCandidate ? 'Edit Candidate' : 'Add Candidate'}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Fill in candidate nomination details</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Candidate Name</label>
                  <input required className="input-field text-sm h-10" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter candidate name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Political Party</label>
                    <input required className="input-field text-sm h-10" value={formData.party} onChange={e => setFormData({...formData, party: e.target.value})} placeholder="Enter party name" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Constituency</label>
                    <input required className="input-field text-sm h-10" value={formData.constituency} onChange={e => setFormData({...formData, constituency: e.target.value})} placeholder="Enter constituency" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Age</label>
                    <input type="number" required className="input-field text-sm h-10" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="35" />
                  </div>
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
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Assign to Election</label>
                  <select required className="input-field text-sm h-10" value={formData.election_id} onChange={e => setFormData({...formData, election_id: e.target.value})}>
                    <option value="">Select an election</option>
                    {elections.map(e => (
                      <option key={e.election_id} value={e.election_id}>{e.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 h-11">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 h-11">
                    <Check size={18} />
                    {editingCandidate ? 'Update Profile' : 'Confirm Nomination'}
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

export default CandidatesPage;
