import React, { useState, useEffect } from 'react';
import { voterApi, candidateApi, voteApi, electionApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Vote as VoteIcon, CheckCircle2, AlertCircle, Search, Calendar, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';

const VotingPage = () => {
  const [activeElections, setActiveElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [hasVotedInSelected, setHasVotedInSelected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActiveElections();
  }, []);

  const fetchActiveElections = async () => {
    try {
      const response = await electionApi.getActive();
      setActiveElections(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load active elections.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectElection = async (election) => {
    setSelectedElection(election);
    setLoading(true);
    setError(null);
    setSelectedCandidate(null);
    setHasVotedInSelected(false);

    try {
      const [candidatesRes, statusRes] = await Promise.all([
        candidateApi.getByElection(election.election_id),
        voteApi.getStatus(election.election_id)
      ]);
      setCandidates(candidatesRes.data);
      setHasVotedInSelected(statusRes.data.hasVoted);
    } catch (err) {
      console.error("Error loading election details:", err);
      const message = err.response?.data?.error || err.message || "Failed to load election details.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCastVote = async () => {
    if (!selectedCandidate || !selectedElection) return;
    
    setVoting(true);
    setError(null);
    try {
      await voteApi.cast({
        election_id: selectedElection.election_id,
        candidate_id: selectedCandidate.candidate_id
      });
      setVoted(true);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while casting your vote.");
    } finally {
      setVoting(false);
    }
  };

  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-violet-500 to-purple-400',
    'from-amber-500 to-orange-400',
    'from-emerald-500 to-teal-400',
    'from-rose-500 to-pink-400',
    'from-indigo-500 to-blue-400',
  ];

  if (loading && activeElections.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-20">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="skeleton h-8 w-64 mx-auto rounded-lg" />
            <div className="skeleton h-5 w-80 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[1,2].map(i => (
              <div key={i} className="card p-6 space-y-4">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-6 w-48" />
                <div className="skeleton h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (voted) {
    return (
      <motion.div 
        className="max-w-xl mx-auto mt-16 text-center space-y-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <CheckCircle2 size={52} />
        </motion.div>
        <div>
          <h2 className="text-3xl font-black text-slate-800">Vote Cast Successfully!</h2>
          <p className="text-slate-500 mt-3 text-lg">
            Your voice has been heard. Your vote for <strong className="text-slate-700">{selectedElection.title}</strong> has been securely recorded.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-100">
          <ShieldCheck size={14} />
          Encrypted & Verified
        </div>
        <div className="pt-4">
          <button 
            onClick={() => { setVoted(false); setSelectedElection(null); setCandidates([]); }}
            className="btn-primary h-12 px-8"
          >
            Return to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-100">
          <Sparkles size={14} />
          Secure Voting
        </div>
        <h2 className="text-3xl font-black text-slate-800">Secure Voting Portal</h2>
        <p className="text-slate-500">Select an active election and cast your secret ballot.</p>
      </motion.div>

      {!selectedElection ? (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-bold text-slate-700">Available Active Elections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeElections.length > 0 ? (
              activeElections.map((election, idx) => (
                <motion.button
                  key={election.election_id}
                  onClick={() => handleSelectElection(election)}
                  className="card p-6 text-left hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/50 transition-all flex items-center justify-between group"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-600">
                      <Calendar size={14} />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {new Date(election.election_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800">{election.title}</h4>
                    <p className="text-sm text-slate-500 truncate max-w-xs">{election.description}</p>
                  </div>
                  <ChevronRight size={22} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </motion.button>
              ))
            ) : (
              <div className="col-span-full py-20 text-center card bg-slate-50 border-2 border-dashed border-slate-200">
                <VoteIcon size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-400 font-medium">There are no active elections at this time.</p>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Election header */}
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <button onClick={() => setSelectedElection(null)} className="text-xs font-bold text-primary-600 hover:underline mb-1 flex items-center gap-1">
                ← Change Election
              </button>
              <h3 className="text-xl font-bold text-slate-800">{selectedElection.title}</h3>
            </div>
            {hasVotedInSelected && (
              <motion.div 
                className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl flex items-center gap-2 border border-amber-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle size={16} />
                <span className="text-sm font-semibold">Already voted</span>
              </motion.div>
            )}
          </div>

          {/* Candidate grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {candidates.map((candidate, idx) => (
              <motion.button
                key={candidate.candidate_id}
                disabled={hasVotedInSelected || voting}
                onClick={() => setSelectedCandidate(candidate)}
                className={`text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden group relative ${
                  selectedCandidate?.candidate_id === candidate.candidate_id 
                  ? 'border-primary-400 bg-primary-50/50 shadow-lg shadow-primary-100' 
                  : (hasVotedInSelected ? 'border-slate-100 opacity-50 grayscale cursor-not-allowed bg-white' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md')
                }`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={!hasVotedInSelected ? { y: -2 } : {}}
              >
                {/* Selection indicator */}
                {selectedCandidate?.candidate_id === candidate.candidate_id && (
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-300`} />
                )}
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                      selectedCandidate?.candidate_id === candidate.candidate_id 
                        ? `bg-gradient-to-br ${gradients[idx % gradients.length]} text-white shadow-lg` 
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                    }`}>
                      {candidate.name.charAt(0)}
                    </div>
                    <AnimatePresence>
                      {selectedCandidate?.candidate_id === candidate.candidate_id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        >
                          <CheckCircle2 size={24} className="text-primary-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${selectedCandidate?.candidate_id === candidate.candidate_id ? 'text-primary-900' : 'text-slate-800'}`}>
                      {candidate.name}
                    </h4>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{candidate.party}</p>
                  </div>
                  <div className="pt-1">
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Constituency</div>
                    <div className="text-sm font-semibold text-slate-600">{candidate.constituency}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {candidates.length === 0 && !loading && (
            <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
              <UserCheck size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 font-medium">No candidates registered for this election yet.</p>
            </div>
          )}

          {/* Vote button */}
          <div className="max-w-xl mx-auto pt-4">
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              disabled={!selectedCandidate || voting || hasVotedInSelected}
              onClick={handleCastVote}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
                !selectedCandidate || hasVotedInSelected
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-primary-200'
              }`}
              whileHover={selectedCandidate && !hasVotedInSelected ? { y: -2 } : {}}
              whileTap={selectedCandidate && !hasVotedInSelected ? { scale: 0.98 } : {}}
            >
              {voting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing Secure Ballot...
                </div>
              ) : (hasVotedInSelected ? 'VOTE RECORDED' : 'CAST OFFICIAL VOTE')}
              <VoteIcon size={22} />
            </motion.button>
            
            <p className="text-center text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-[0.2em]">
              Authorized and Secured by VoterSync Encryption
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VotingPage;
