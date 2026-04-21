import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Vote, 
  BarChart3, 
  LogOut,
  ShieldCheck,
  ChevronRight,
  Lock,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const adminLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/elections", icon: ShieldCheck, label: "Elections" },
    { to: "/voters", icon: Users, label: "Voters" },
    { to: "/candidates", icon: UserSquare2, label: "Candidates" },
    { to: "/results", icon: BarChart3, label: "Results" },
  ];

  const voterLinks = [
    { to: "/voting", icon: Vote, label: "Cast Vote" },
    { to: "/profile", icon: UserSquare2, label: "My Profile" },
    { to: "/change-password", icon: Lock, label: "Security" },
    { to: "/results", icon: BarChart3, label: "Live Results" },
  ];

  const links = userRole === 'admin' ? adminLinks : voterLinks;

  return (
    <div className="w-72 h-screen flex flex-col fixed left-0 top-0 z-40 overflow-hidden"
         style={{
           background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
         }}>
      {/* Decorative blurred orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-64 h-64 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-20%] w-48 h-48 bg-accent-600/15 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="relative p-6 pb-4 flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/40" style={{ background: 'linear-gradient(135deg, #1a65f5, #3385ff, #59a8ff)' }}>
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-tight">VoterSync</h1>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
            {userRole === 'admin' ? 'Admin Console' : 'Voter Portal'}
          </p>
        </div>
      </div>

      {/* Nav section label */}
      <div className="relative px-6 pt-4 pb-2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Sparkles size={10} />
          {userRole === 'admin' ? 'Management' : 'Menu'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-4 py-1 space-y-1 sidebar-scroll overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className="relative block"
            >
              <motion.div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(26, 101, 245, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Hover background */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary-400"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-500/25 text-primary-300' 
                    : 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-white'
                }`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                <span className={`relative z-10 font-semibold text-sm flex-1 ${isActive ? 'text-white' : ''}`}>
                  {link.label}
                </span>

                {isActive && (
                  <ChevronRight size={14} className="relative z-10 text-primary-400" />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="relative p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04] mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-500/20">
            {userRole === 'admin' ? 'A' : 'V'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {userRole === 'admin' ? 'Administrator' : 'Voter Account'}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              {userRole === 'admin' ? 'Full access' : 'Standard access'}
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 font-semibold text-sm"
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
