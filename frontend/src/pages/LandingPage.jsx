import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Vote, Users, BarChart3, ArrowRight, CheckCircle2, Lock, Zap, Globe, Sparkles } from 'lucide-react';

const FloatingParticle = ({ delay, size, x, y, duration }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: `radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)`
    }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.3, 0.7, 0.3],
      scale: [1, 1.2, 1]
    }}
    transition={{
      duration: duration || 5,
      repeat: Infinity,
      delay: delay,
      ease: 'easeInOut'
    }}
  />
);

const StatCounter = ({ label, value, icon: Icon }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numVal = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9.]/g, '');
    const duration = 2000;
    const steps = 60;
    const increment = numVal / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numVal) {
        setCount(numVal);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  const suffix = value.replace(/[0-9.]/g, '');

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-2">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-300">
          <Icon size={18} />
        </div>
      </div>
      <div className="text-3xl font-black text-white">{formatNumber(count)}{suffix}</div>
      <div className="text-xs text-slate-400 font-medium mt-1">{label}</div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      desc: "Military-grade encryption protects every vote. Voter authentication uses encrypted identifiers with DOB-based secure tokens.",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: Vote,
      title: "One Person, One Vote",
      desc: "Robust database constraints and real-time validation ensure absolute integrity of the entire electoral process.",
      gradient: "from-violet-500 to-purple-400"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      desc: "Live results visualization with beautiful charts, aggregate data tracking, and transparent counting dashboards.",
      gradient: "from-amber-500 to-orange-400"
    }
  ];

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30" style={{ background: 'linear-gradient(135deg, #1a65f5, #3385ff, #59a8ff)' }}>
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">VoterSync</span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button onClick={() => navigate('/login')} className="text-slate-600 font-semibold hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50">
            Sign In
          </button>
          <button onClick={() => navigate('/login')} className="btn-primary rounded-xl px-6 py-2.5 text-sm">
            Get Started <ArrowRight size={16} />
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        {/* Dark hero background */}
        <div className="absolute inset-0" style={{ height: '110%', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)' }}>
          {/* Animated particles */}
          <FloatingParticle delay={0} size={80} x={10} y={20} duration={7} />
          <FloatingParticle delay={1.5} size={60} x={75} y={15} duration={5} />
          <FloatingParticle delay={0.5} size={100} x={85} y={60} duration={8} />
          <FloatingParticle delay={2} size={50} x={25} y={70} duration={6} />
          <FloatingParticle delay={1} size={70} x={55} y={40} duration={7} />
          <FloatingParticle delay={3} size={40} x={45} y={80} duration={5} />
          
          {/* Gradient mesh overlays */}
          <div className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(at 20% 30%, rgba(26, 101, 245, 0.3) 0px, transparent 50%),
                radial-gradient(at 80% 20%, rgba(139, 92, 246, 0.2) 0px, transparent 50%),
                radial-gradient(at 50% 80%, rgba(14, 165, 233, 0.15) 0px, transparent 50%)
              `
            }}
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-36 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-8">
            <motion.div variants={itemVariant}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-primary-300 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                <Sparkles size={14} />
                Trusted by Election Commissions
              </div>
            </motion.div>
            
            <motion.h1 variants={itemVariant} className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
              The Future of{' '}
              <span style={{ backgroundImage: 'linear-gradient(to right, #59a8ff, #e879f9, #8ec7ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Democracy
              </span>{' '}
              starts here.
            </motion.h1>
            
            <motion.p variants={itemVariant} className="text-lg text-slate-400 max-w-lg leading-relaxed">
              VoterSync provides a secure, transparent, and efficient platform for modern election management. Empowering citizens and administrators alike.
            </motion.p>
            
            <motion.div variants={itemVariant} className="flex flex-col sm:flex-row gap-4 pt-2">
              <button onClick={() => navigate('/login')} className="group h-14 px-8 rounded-2xl text-base font-bold shadow-2xl shadow-primary-500/30 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5">
                Cast Your Vote Now 
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
              </button>
              <button onClick={() => navigate('/login')} className="h-14 px-8 rounded-2xl text-base font-bold border border-white/15 hover:bg-white/5 transition-all text-white/80 hover:text-white flex items-center justify-center gap-2 backdrop-blur-md">
                Admin Dashboard
              </button>
            </motion.div>
          </div>

          {/* Right side dashboard preview */}
          <motion.div variants={itemVariant} className="relative hidden lg:block">
            <div className="absolute -inset-8 bg-primary-500/10 rounded-[48px] blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl p-1 shadow-2xl">
              <div className="bg-slate-900/80 rounded-[20px] p-7 space-y-6">
                {/* Mock dashboard header */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <div className="flex-1 h-6 bg-white/5 rounded-lg mx-4" />
                </div>

                {/* Live election card */}
                <div className="p-5 bg-white/[0.06] rounded-2xl border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Election Status</span>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">General Election 2024</h4>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-primary-500 to-primary-300 h-full rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">65% Participation</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                </div>
                
                {/* Mini stat cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white/[0.04] rounded-xl border border-white/[0.06] flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                      <Users size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">Voters</p>
                      <p className="text-base font-bold text-white">12.4k</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/[0.04] rounded-xl border border-white/[0.06] flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                      <Vote size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">Votes cast</p>
                      <p className="text-base font-bold text-white">8.2k</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto px-6 pb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="grid grid-cols-3 gap-8 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
            <StatCounter label="Elections Held" value="150+" icon={ShieldCheck} />
            <StatCounter label="Votes Recorded" value="2400000" icon={Vote} />
            <StatCounter label="Countries Served" value="12" icon={Globe} />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-28 bg-slate-50">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(at 40% 20%, rgba(26, 101, 245, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(217, 70, 239, 0.08) 0px, transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-20 space-y-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-widest">
              <Zap size={14} />
              Core Platform
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">Engineered for Trust</h2>
            <p className="text-slate-500 font-medium text-lg">Built with three core principles: security, accessibility, and transparency.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                className="card-hover p-8 group"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={24} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h4>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(at 30% 40%, rgba(26, 101, 245, 0.4) 0px, transparent 50%),
                              radial-gradient(at 70% 60%, rgba(139, 92, 246, 0.3) 0px, transparent 50%)`
          }}
        />
        <motion.div 
          className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Ready to modernize your elections?
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Join thousands of organizations worldwide who trust VoterSync for secure, transparent democratic processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button onClick={() => navigate('/login')} className="h-14 px-10 rounded-2xl text-base font-bold bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-2xl flex items-center justify-center gap-2 hover:-translate-y-0.5">
              Start Free Today <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <ShieldCheck size={18} />
            <span className="font-bold text-base">VoterSync</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">&copy; 2024 VoterSync Election Global. Secure Voting Protocol v4.0</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
