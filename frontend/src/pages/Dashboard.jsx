import React, { useState, useEffect } from 'react';
import { resultApi, electionApi } from '../services/api';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserSquare2, 
  Vote, 
  ShieldCheck, 
  ArrowUpRight, 
  Calendar,
  Activity,
  CheckCircle2,
  Clock,
  TrendingUp,
  Zap,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const target = typeof value === 'number' ? value : parseInt(value) || 0;
    if (target === 0) { setDisplay(0); return; }
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
};

const SkeletonCard = () => (
  <div className="card p-6 space-y-4">
    <div className="flex justify-between">
      <div className="space-y-2">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-8 w-16" />
      </div>
      <div className="skeleton w-12 h-12 rounded-2xl" />
    </div>
  </div>
);

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
    { 
      label: 'Total Voters', 
      value: stats.totalVoters, 
      icon: Users, 
      gradient: 'from-blue-500 to-cyan-400',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/voters',
      change: '+12%'
    },
    { 
      label: 'Elections', 
      value: stats.totalElections, 
      icon: ShieldCheck, 
      gradient: 'from-violet-500 to-purple-400',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-600',
      link: '/elections',
      change: '+3'
    },
    { 
      label: 'Candidates', 
      value: stats.totalCandidates, 
      icon: UserSquare2, 
      gradient: 'from-amber-500 to-orange-400',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
      link: '/candidates',
      change: '+8'
    },
    { 
      label: 'Total Votes', 
      value: stats.totalVotes, 
      icon: Vote, 
      gradient: 'from-emerald-500 to-teal-400',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      link: '/results',
      change: '+24%'
    },
  ];

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
            <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Live
            </div>
          </div>
          <p className="text-slate-500">System overview and management statistics.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariant}
                onClick={() => navigate(stat.link)}
                className="card p-6 cursor-pointer group hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                    <TrendingUp size={12} />
                    {stat.change}
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-800">
                  <AnimatedNumber value={stat.value} />
                </h3>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Elections */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-800 text-lg">Recent Elections</h4>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {recentElections.length}
                </span>
              </div>
              <button onClick={() => navigate('/elections')} className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl">
                      <div className="skeleton w-10 h-10 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-4 w-48" />
                        <div className="skeleton h-3 w-32" />
                      </div>
                      <div className="skeleton h-6 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : recentElections.length > 0 ? (
                recentElections.map((election, idx) => (
                  <motion.div 
                    key={election.election_id} 
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100/80 hover:bg-slate-50/80 hover:border-slate-200 transition-all duration-200 group cursor-pointer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.08 }}
                    onClick={() => navigate('/elections')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{election.title}</div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">
                          {new Date(election.election_date).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'short', day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    <div>
                      {election.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">
                          <Activity size={10} /> Active
                        </span>
                      ) : election.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100">
                          <CheckCircle2 size={10} /> Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-100">
                          <Clock size={10} /> Soon
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-xl">
                  <Calendar size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-400 text-sm font-medium">No elections created yet.</p>
                  <button onClick={() => navigate('/elections')} className="text-primary-600 text-sm font-semibold mt-2 hover:underline">
                    Create your first election →
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div 
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          {/* Quick Actions */}
          <div className="rounded-2xl p-6 text-white overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, #1a65f5 0%, #6366f1 50%, #8b5cf6 100%)'
            }}>
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={18} />
                <h4 className="font-bold text-lg">Quick Actions</h4>
              </div>
              <div className="space-y-2">
                <button onClick={() => navigate('/voters')} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 transition-all font-medium text-sm backdrop-blur-sm border border-white/5 hover:border-white/15 group">
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <Users size={16} />
                  </div>
                  Add New Voter
                  <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={() => navigate('/elections')} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 transition-all font-medium text-sm backdrop-blur-sm border border-white/5 hover:border-white/15 group">
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <ShieldCheck size={16} />
                  </div>
                  Launch Election
                  <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={() => navigate('/candidates')} className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 transition-all font-medium text-sm backdrop-blur-sm border border-white/5 hover:border-white/15 group">
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <UserSquare2 size={16} />
                  </div>
                  Nominate Candidate
                  <ArrowUpRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={16} className="text-primary-500" />
              <h4 className="font-bold text-slate-800">System Status</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Database</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Auth Service</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Server Uptime</span>
                <span className="text-slate-800 font-bold">99.9%</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">API Latency</span>
                  <span className="text-slate-800 font-bold">~45ms</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
