import React, { useState, useEffect, useCallback } from 'react';
import { resultApi, electionApi } from '../services/api';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Trophy, Award, Users, RefreshCw, Calendar, ChevronDown, Sparkles, TrendingUp } from 'lucide-react';

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

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#0ea5e9', '#14b8a6', '#f59e0b'];
  const totalVotes = results.reduce((sum, item) => sum + parseInt(item.vote_count), 0);

  const getSelectedElection = () => elections.find(e => e.election_id.toString() === selectedElectionId.toString());

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl p-4 rounded-xl shadow-xl border border-slate-100 min-w-[140px]">
          <p className="font-bold text-slate-800 text-sm mb-1">{label || payload[0]?.name}</p>
          <p className="text-primary-600 font-black text-lg">{payload[0].value} votes</p>
          {totalVotes > 0 && (
            <p className="text-slate-400 text-xs font-medium mt-1">
              {Math.round((payload[0].value / totalVotes) * 100)}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-800">Election Results</h2>
            <div className="px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border border-primary-100">
              <Sparkles size={10} />
              Live
            </div>
          </div>
          <p className="text-slate-500">Real-time visualization of the democratic mandate.</p>
        </motion.div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Election selector */}
          <div className="relative">
            <select 
              value={selectedElectionId} 
              onChange={(e) => setSelectedElectionId(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 font-semibold text-sm text-slate-700 outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm"
            >
              <option value="">Select Election</option>
              {elections.map(e => (
                <option key={e.election_id} value={e.election_id}>{e.title}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setView('bar')}
              className={`p-2 rounded-lg transition-all ${view === 'bar' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <BarChart3 size={16} />
            </button>
            <button 
              onClick={() => setView('pie')}
              className={`p-2 rounded-lg transition-all ${view === 'pie' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <PieChartIcon size={16} />
            </button>
            <div className="w-px h-5 bg-slate-100 mx-0.5" />
            <button 
              onClick={fetchResults}
              className="p-2 text-slate-400 hover:text-primary-600 transition-all hover:bg-slate-50 rounded-lg"
              title="Refresh results"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading && results.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card h-[420px] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-2 border-slate-200 border-t-primary-500 rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 text-sm font-medium">Loading results...</p>
            </div>
          </div>
          <div className="card h-[420px]">
            <div className="space-y-4">
              <div className="skeleton h-6 w-24" />
              <div className="skeleton h-40 w-full rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="skeleton h-20 rounded-xl" />
                <div className="skeleton h-20 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="card text-center py-24 space-y-5 border-2 border-dashed">
          <Award size={56} className="mx-auto text-slate-200" />
          <div>
            <p className="text-xl font-bold text-slate-400">No votes recorded yet</p>
            <p className="text-slate-400 text-sm mt-1">Waiting for the first ballot to be cast in this election.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Chart */}
            <div className="card h-[420px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary-500" />
                  Vote Distribution
                </h3>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  {totalVotes} total
                </span>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  {view === 'bar' ? (
                    <BarChart data={results}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
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
                        innerRadius={65}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="vote_count"
                        nameKey="name"
                        stroke="none"
                      >
                        {results.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Winner Card */}
            <div className={`card h-[420px] overflow-hidden transition-all duration-500 ${winner && winner.vote_count > 0 ? 'border-none' : 'bg-slate-50'}`}
              style={winner && winner.vote_count > 0 ? {
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #1a1a2e 100%)'
              } : {}}
            >
              {winner && winner.vote_count > 0 ? (
                <div className="relative h-full flex flex-col justify-center p-8 text-white">
                  {/* Decorative */}
                  <div className="absolute top-0 right-0 p-6 opacity-[0.06]">
                    <Trophy size={180} />
                  </div>
                  <div className="absolute top-6 right-6 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-6 left-6 w-24 h-24 bg-accent-500/10 rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-primary-500/30 text-primary-200 uppercase tracking-widest border border-primary-500/20 backdrop-blur-sm">
                        Current Leader
                      </span>
                      {getSelectedElection()?.status === 'completed' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/30 text-amber-200 uppercase tracking-widest border border-amber-500/20">
                          Winner
                        </span>
                      )}
                    </div>
                    <p className="text-base font-medium text-slate-400 mb-2">{winner.party}</p>
                    <h3 className="text-4xl font-black mb-8 leading-tight">{winner.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl p-5 border border-white/[0.08]">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Votes</p>
                        <p className="text-3xl font-black">{winner.vote_count}</p>
                      </div>
                      <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl p-5 border border-white/[0.08]">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Percentage</p>
                        <p className="text-3xl font-black">
                          {totalVotes > 0 ? Math.round((winner.vote_count / totalVotes) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400 text-center space-y-4">
                  <div className="w-12 h-12 border-2 border-slate-200 border-t-primary-400 rounded-full animate-spin" />
                  <p className="font-semibold">Awaiting election outcome...</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Candidate Standing */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
              <Users size={18} className="text-primary-500" />
              Candidate Standing
            </h3>
            <div className="space-y-3">
              {results.map((candidate, index) => {
                const percentage = totalVotes > 0 ? (candidate.vote_count / totalVotes) * 100 : 0;
                return (
                  <motion.div 
                    key={candidate.candidate_id} 
                    className="relative group p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                          {index + 1}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 text-sm">{candidate.name}</span>
                          <span className="text-xs font-medium text-slate-400 ml-2">{candidate.party}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-800 text-base">{candidate.vote_count}</span>
                        <span className="text-[10px] font-bold text-slate-400 ml-1.5">
                          ({Math.round(percentage)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ResultsPage;
