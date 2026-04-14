import React, { useState, useEffect } from 'react';
import { voterApi, candidateApi, voteApi, electionApi } from '../services/api';
import { UserCheck, Vote as VoteIcon, CheckCircle2, AlertCircle, Search, Calendar, ChevronRight } from 'lucide-react';

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
      setError("Failed to load election details.");
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

  if (loading && activeElections.length === 0) return <div className="py-12 text-center text-slate-400">Loading active elections...</div>;

  if (voted) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-50">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Vote Cast Successfully!</h2>
          <p className="text-slate-500 mt-2">Your voice has been heard. Your vote for {selectedElection.title} has been securely recorded.</p>
        </div>
        <button 
          onClick={() => { setVoted(false); setSelectedElection(null); setCandidates([]); }}
          className="btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-800">Secure Voting Portal</h2>
        <p className="text-slate-500 mt-2">Select an active election and cast your secret ballot.</p>
      </div>

      {!selectedElection ? (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-700">Available Active Elections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeElections.length > 0 ? (
              activeElections.map(election => (
                <button
                  key={election.election_id}
                  onClick={() => handleSelectElection(election)}
                  className="card p-6 text-left hover:border-primary-500 hover:ring-4 hover:ring-primary-500/10 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-600">
                      <Calendar size={16} />
                      <span className="text-xs font-black uppercase tracking-widest">{new Date(election.election_date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-800">{election.title}</h4>
                    <p className="text-sm text-slate-500 truncate max-w-xs">{election.description}</p>
                  </div>
                  <ChevronRight size={24} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                </button>
              ))
            ) : (
              <div className="col-span-full py-20 text-center card bg-slate-50 border-dashed">
                <p className="text-slate-400 font-medium">There are no active elections at this time.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div>
              <button onClick={() => setSelectedElection(null)} className="text-xs font-bold text-primary-600 hover:underline mb-1">← Change Election</button>
              <h3 className="text-2xl font-black text-slate-800">{selectedElection.title}</h3>
            </div>
            {hasVotedInSelected && (
              <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl flex items-center gap-2 border border-amber-100">
                <AlertCircle size={18} />
                <span className="text-sm font-bold">You have already voted in this election.</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <button
                key={candidate.candidate_id}
                disabled={hasVotedInSelected || voting}
                onClick={() => setSelectedCandidate(candidate)}
                className={`text-left rounded-3xl border-4 transition-all duration-300 overflow-hidden group ${
                  selectedCandidate?.candidate_id === candidate.candidate_id 
                  ? 'border-primary-500 bg-primary-50 ring-8 ring-primary-500/5' 
                  : (hasVotedInSelected ? 'border-slate-100 opacity-60 grayscale cursor-not-allowed' : 'border-white bg-white hover:border-slate-100')
                }`}
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${selectedCandidate?.candidate_id === candidate.candidate_id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                      {candidate.name.charAt(0)}
                    </div>
                    {selectedCandidate?.candidate_id === candidate.candidate_id && <CheckCircle2 size={24} className="text-primary-600" />}
                  </div>
                  <div>
                    <h4 className={`text-lg font-black ${selectedCandidate?.candidate_id === candidate.candidate_id ? 'text-primary-900' : 'text-slate-800'}`}>{candidate.name}</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{candidate.party}</p>
                  </div>
                  <div className="pt-2">
                    <div className="text-[10px] font-bold text-slate-300 uppercase">Constituency</div>
                    <div className="text-sm font-bold text-slate-600">{candidate.constituency}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {candidates.length === 0 && !loading && (
            <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-medium">No candidates registered for this election yet.</p>
            </div>
          )}

          <div className="max-w-xl mx-auto pt-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            <button
              disabled={!selectedCandidate || voting || hasVotedInSelected}
              onClick={handleCastVote}
              className={`w-full py-5 rounded-3xl font-black text-xl transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 ${
                !selectedCandidate || hasVotedInSelected
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200 hover:-translate-y-1'
              }`}
            >
              {voting ? 'Signing Secure Ballot...' : (hasVotedInSelected ? 'VOTE RECORDED' : 'CAST OFFICIAL VOTE')}
              <VoteIcon size={24} />
            </button>
            
            <p className="text-center text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-[0.2em]">
              Authorized and Secured by VoterSync Encryption
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingPage;
