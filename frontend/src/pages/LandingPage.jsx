import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Vote, Users, BarChart3, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Lock className="text-primary-600" />,
      title: "Secure Identity",
      desc: "Voter authentication using encrypted identifiers and DOB-based secure tokens."
    },
    {
      icon: <Vote className="text-primary-600" />,
      title: "One Person, One Vote",
      desc: "Robust database constraints ensuring absolute integrity of the electoral process."
    },
    {
      icon: <BarChart3 className="text-primary-600" />,
      title: "Live Analytics",
      desc: "Real-time results visualization with transparent, aggregate data tracking."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
            <ShieldCheck size={24} />
          </div>
          <span className="font-bold text-2xl text-slate-800 tracking-tight">VoterSync</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-slate-600 font-bold hover:text-primary-600 transition-colors">Sign In</button>
          <button onClick={() => navigate('/login')} className="btn-primary rounded-xl px-6">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-black uppercase tracking-widest">
            <CheckCircle2 size={16} /> Trusted by Election Commissions
          </div>
          <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            The Future of <span className="text-primary-600">Democracy</span> starts here.
          </h1>
          <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
            VoterSync provides a secure, transparent, and efficient platform for modern election management. Empowering citizens and administrators alike.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button onClick={() => navigate('/login')} className="btn-primary h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl shadow-primary-200">
              Cast Your Vote Now <ArrowRight className="ml-2" />
            </button>
            <button onClick={() => navigate('/login')} className="h-16 px-10 rounded-2xl text-lg font-bold border-2 border-slate-100 hover:bg-slate-50 transition-all text-slate-700">
              Admin Dashboard
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-primary-600/5 rounded-[40px] blur-3xl"></div>
          <div className="relative card p-8 border-none shadow-2xl shadow-slate-200/50 bg-slate-50 overflow-hidden">
            <div className="mb-8 p-6 bg-white rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Election Status</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <h4 className="text-xl font-black text-slate-800">General Election 2024</h4>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary-600 h-full w-[65%]" />
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-500">65% Participation</span>
                <span className="text-primary-600">Active</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Voters</p>
                  <p className="text-lg font-black text-slate-800">12.4k</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Vote size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Votes cast</p>
                  <p className="text-lg font-black text-slate-800">8.2k</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-black text-slate-900">Engineered for Trust</h2>
            <p className="text-slate-500 font-medium">We built VoterSync with three core principles in mind: security, accessibility, and transparency.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="card p-10 hover:translate-y-[-8px] transition-all duration-300">
                <div className="w-16 h-16 bg-white shadow-lg shadow-slate-200/50 rounded-2xl flex items-center justify-center mb-8">
                  {f.icon}
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-4">{f.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <ShieldCheck size={20} />
            <span className="font-bold text-lg">VoterSync</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">&copy; 2024 VoterSync Election Global. Secure Voting Protocol v4.0</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
