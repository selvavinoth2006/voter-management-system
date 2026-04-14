import React, { useState, useEffect, useCallback } from 'react';
import { resultApi, electionApi } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Trophy, Award, Users, RefreshCw, Calendar, ChevronDown } from 'lucide-react';

const ResultsPage = () => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [results, setResults] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('bar');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await electionApi.getAll();
      const allElections = response.data;
      setElections(allElections);
      
      // Select most recent/active election by default
      if (allElections.length > 0) {
        const defaultElection = allElections.find(e => e.status === 'active') || allElections[0];
        setSelectedElectionId(defaultElection.election_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = useCallback(async () => {
    if (!selectedElectionId) return;
    setLoading(true);
    try {
      const [resultsRes, winnerRes] = await Promise.all([
        resultApi.getElectionResults(selectedElectionId),
        resultApi.getWinner(selectedElectionId)
      ]);
      setResults(resultsRes.data);
      setWinner(winnerRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedElectionId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];
  const totalVotes = results.reduce((sum, item) => sum + parseInt(item.vote_count), 0);

  const getSelectedElection = () => elections.find(e => e.election_id.toString() === selectedElectionId.toString());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Election Live Results</h2>
          <p className="text-slate-500">Real-time visualization of the democratic mandate.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select 
              value={selectedElectionId} 
              onChange={(e) => setSelectedElectionId(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 font-bold text-sm text-slate-700 outline-none focus:border-primary-500 transition-all shadow-sm"
            >
              <option value="">Select Election</option>
              {elections.map(e => (
                <option key={e.election_id} value={e.election_id}>{e.title}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setView('bar')}
              className={`p-1.5 rounded-lg transition-all ${view === 'bar' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <BarChart3 size={18} />
            </button>
            <button 
              onClick={() => setView('pie')}
              className={`p-1.5 rounded-lg transition-all ${view === 'pie' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <PieChartIcon size={18} />
            </button>
            <div className="w-px h-5 bg-slate-100 mx-1"></div>
            <button 
              onClick={fetchResults}
              className="p-1.5 text-slate-400 hover:text-primary-600 transition-all"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {loading && results.length === 0 ? (
        <div className="py-20 text-center text-slate-400">Loading live results...</div>
      ) : results.length === 0 ? (
        <div className="card text-center py-20 space-y-4 border-2 border-dashed">
          <Award size={64} className="mx-auto text-slate-200" />
          <p className="text-xl font-bold text-slate-400">Waiting for first ballot to be cast in this election...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card h-[420px] flex flex-col">
              <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2 text-lg">
                Vote Distribution
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  {view === 'bar' ? (
                    <BarChart data={results}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Bar dataKey="vote_count" radius={[8, 8, 0, 0]}>
                        {results.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={results}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="vote_count"
                        nameKey="name"
                        stroke="none"
                      >
                        {results.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`card h-[420px] overflow-hidden transition-all duration-500 ${winner && winner.vote_count > 0 ? 'bg-primary-900 border-none' : 'bg-slate-50'}`}>
              {winner && winner.vote_count > 0 ? (
                <div className="relative h-full flex flex-col justify-center p-8 text-white">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Trophy size={160} />
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-primary-500 text-white w-max uppercase tracking-widest shadow-lg">
                      Current Leader
                    </span>
                    {getSelectedElection()?.status === 'completed' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-amber-500 text-white w-max uppercase tracking-widest shadow-lg">
                        Winner Declared
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-medium opacity-80 mb-2">{winner.party}</p>
                  <h3 className="text-5xl font-black mb-10 leading-tight">{winner.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                      <p className="text-xs font-bold opacity-60 uppercase mb-1">Total Votes</p>
                      <p className="text-3xl font-black">{winner.vote_count}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                      <p className="text-xs font-bold opacity-60 uppercase mb-1">Percentage</p>
                      <p className="text-3xl font-black">
                        {totalVotes > 0 ? Math.round((winner.vote_count / totalVotes) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 text-center space-y-4">
                  <RefreshCw size={48} className="animate-spin-slow" />
                  <p className="font-bold">Waiting for election outcome...</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users size={20} className="text-primary-500" />
              Candidate Standing
            </h3>
            <div className="space-y-4">
              {results.map((candidate, index) => (
                <div key={candidate.candidate_id} className="relative group p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200">
                  <div className="flex justify-between items-end mb-2 relative z-10">
                    <div>
                      <span className="font-black text-slate-800 text-base uppercase tracking-tight">{candidate.name}</span>
                      <span className="text-xs font-bold text-slate-400 ml-3">{candidate.party}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-800 text-lg">{candidate.vote_count}</span>
                      <span className="text-[10px] font-bold text-slate-400 ml-1">VOTES</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${totalVotes > 0 ? (candidate.vote_count / totalVotes) * 100 : 0}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsPage;
