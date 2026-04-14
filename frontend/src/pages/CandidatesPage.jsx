import React, { useState, useEffect } from 'react';
import { candidateApi } from '../services/api';
import { UserSquare2, Search, Edit2, Trash2, X, Check, Landmark } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Candidate Management</h2>
          <p className="text-slate-500">Manage election participants and their information.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <UserSquare2 size={20} />
          Nominate Candidate
        </button>
      </div>

      <div className="card">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or party..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400">Loading candidates...</div>
          ) : filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <div key={candidate.candidate_id} className="border border-slate-100 rounded-xl p-6 hover:shadow-lg hover:border-primary-100 transition-all duration-300 group bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenModal(candidate)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(candidate.candidate_id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-1">{candidate.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <div className="w-5 h-5 flex items-center justify-center text-primary-500"><Landmark size={14} /></div>
                    {candidate.party}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                      {candidate.constituency}
                    </div>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary-50 text-primary-600">
                      {getElectionTitle(candidate.election_id)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
              No candidates registered yet.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">{editingCandidate ? 'Edit Candidate' : 'Add Candidate'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Candidate Name</label>
                <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter candidate name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Political Party</label>
                  <input required className="input-field" value={formData.party} onChange={e => setFormData({...formData, party: e.target.value})} placeholder="Enter party name" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Constituency</label>
                  <input required className="input-field" value={formData.constituency} onChange={e => setFormData({...formData, constituency: e.target.value})} placeholder="Enter constituency" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Age</label>
                  <input type="number" required className="input-field" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="35" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Gender</label>
                  <select className="input-field" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Assign to Election</label>
                <select required className="input-field" value={formData.election_id} onChange={e => setFormData({...formData, election_id: e.target.value})}>
                  <option value="">Select an election</option>
                  {elections.map(e => (
                    <option key={e.election_id} value={e.election_id}>{e.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">
                  <Check size={20} />
                  {editingCandidate ? 'Update Profile' : 'Confirm Nomination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesPage;
