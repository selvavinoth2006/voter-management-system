import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Vote, 
  BarChart3, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const adminLinks = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/elections", icon: <ShieldCheck size={20} />, label: "Manage Elections" },
    { to: "/voters", icon: <Users size={20} />, label: "Voters" },
    { to: "/candidates", icon: <UserSquare2 size={20} />, label: "Candidates" },
    { to: "/results", icon: <BarChart3 size={20} />, label: "Election Results" },
  ];

  const voterLinks = [
    { to: "/voting", icon: <Vote size={20} />, label: "Cast Your Vote" },
    { to: "/profile", icon: <UserSquare2 size={20} />, label: "My Profile" },
    { to: "/change-password", icon: <LogOut size={20} />, label: "Security" }, // Lock icon would be better but using what's imported
    { to: "/results", icon: <BarChart3 size={20} />, label: "Live Results" },
  ];

  const links = userRole === 'admin' ? adminLinks : voterLinks;

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
          <ShieldCheck size={24} />
        </div>
        <h1 className="font-bold text-xl text-slate-800 tracking-tight">VoterSync</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
          {userRole === 'admin' ? 'Administration' : 'Voter Panel'}
        </div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
