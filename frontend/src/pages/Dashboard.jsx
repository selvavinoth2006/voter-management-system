import React, { useState, useEffect } from 'react';
import { resultApi, electionApi } from '../services/api';
import { 
  Users, 
  UserSquare2, 
  Vote, 
  ShieldCheck, 
  ArrowUpRight, 
  Calendar,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVoters: 0,
    totalElections: 0,
    totalCandidates: 0,
    totalVotes: 0
  });
  const [recentElections, setRecentElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await resultApi.getStats();
      const electionsRes = await electionApi.getAll();
      
      setStats(statsRes.data);
      setRecentElections(electionsRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Voters', value: stats.totalVoters, icon: <Users className="text-blue-600" />, color: 'bg-blue-100', link: '/voters' },
    { label: 'Elections', value: stats.totalElections, icon: <ShieldCheck className="text-purple-600" />, color: 'bg-purple-100', link: '/elections' },
    { label: 'Candidates', value: stats.totalCandidates, icon: <UserSquare2 className="text-orange-600" />, color: 'bg-orange-100', link: '/candidates' },
    { label: 'Total Votes Cast', value: stats.totalVotes, icon: <Vote className="text-green-600" />, color: 'bg-green-100', link: '/results' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-slate-500">System overview and management statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} 
               onClick={() => navigate(stat.link)}
               className="card p-6 flex items-start justify-between hover:scale-[1.02] cursor-pointer transition-all duration-200">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-800 text-lg">Recent Elections</h4>
              <button onClick={() => navigate('/elections')} className="text-primary-600 text-sm font-bold flex items-center gap-1 hover:underline">
                View All <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="py-8 text-center text-slate-400 text-sm">Loading data...</div>
              ) : recentElections.length > 0 ? (
                recentElections.map((election) => (
                  <div key={election.election_id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{election.title}</div>
                        <div className="text-xs text-slate-400 font-medium">Scheduled for {new Date(election.election_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div>
                      {election.status === 'active' ? (
                        <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">Active</span>
                      ) : election.status === 'completed' ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">Completed</span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full">Upcoming</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm italic">No elections created yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-primary-600 text-white border-none shadow-xl shadow-primary-200">
            <h4 className="font-bold text-lg mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button onClick={() => navigate('/voters')} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 transition-colors font-bold text-sm">
                <Users size={18} /> Add New Voter
              </button>
              <button onClick={() => navigate('/elections')} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 transition-colors font-bold text-sm">
                <ShieldCheck size={18} /> Launch Election
              </button>
              <button onClick={() => navigate('/candidates')} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 transition-colors font-bold text-sm">
                <UserSquare2 size={18} /> Nominate Candidate
              </button>
            </div>
          </div>

          <div className="card">
            <h4 className="font-bold text-slate-800 mb-4">System Status</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Database Connection</span>
                <span className="flex items-center gap-1.5 text-green-600 font-bold">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Auth Service</span>
                <span className="flex items-center gap-1.5 text-green-600 font-bold">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Server Uptime</span>
                <span className="text-slate-800 font-bold">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
