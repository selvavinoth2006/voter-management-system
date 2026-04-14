import React, { useState, useEffect } from 'react';
import { electionApi } from '../services/api';
import { ShieldCheck, Plus, Search, Edit2, Trash2, X, Check, Calendar, Activity, Clock, CheckCircle2 } from 'lucide-react';

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
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-600"><Activity size={12} /> Active</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-600"><CheckCircle2 size={12} /> Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-600"><Clock size={12} /> Upcoming</span>;
    }
  };

  const filteredElections = elections.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Election Management</h2>
          <p className="text-slate-500">Create and oversee the election lifecycle.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={20} />
          Create New Election
        </button>
      </div>

      <div className="card">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search elections..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Election Detail</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-400">Loading elections...</td></tr>
              ) : filteredElections.length > 0 ? (
                filteredElections.map((election) => (
                  <tr key={election.election_id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{election.title}</div>
                      <div className="text-xs text-slate-400 max-w-xs truncate">{election.description}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(election.election_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(election.status)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(election)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(election.election_id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="py-12 text-center text-slate-400">No elections found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">{editingElection ? 'Edit Election' : 'Create Election'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Election Title</label>
                <input required className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. General Election 2024" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea className="input-field min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the electionPurpose..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Date</label>
                  <input type="date" required className="input-field" value={formData.election_date} onChange={e => setFormData({...formData, election_date: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">
                  <Check size={20} />
                  {editingElection ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionsPage;
