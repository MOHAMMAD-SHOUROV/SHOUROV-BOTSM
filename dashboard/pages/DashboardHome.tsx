
import React from 'react';
import { OWNER_INFO, REPO_URL } from '../constants';
import { BotStatus } from '../types';
import { 
  Play, 
  Square, 
  Github, 
  Fingerprint,
  Clock, 
  MessageSquare,
  Activity,
  Zap
} from 'lucide-react';
import StatCard from '../components/StatCard';

interface DashboardHomeProps {
  status: BotStatus;
  toggleBot: () => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ status, toggleBot }) => {
  const isRunning = status === BotStatus.RUNNING;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header / Hero Section */}
      <section className="relative h-80 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl group">
        <video 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-[10s]"
          src={OWNER_INFO.coverVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-10 flex items-end gap-8">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500 via-white to-purple-500 rounded-full blur-md opacity-60 animate-spin-slow"></div>
            <img 
              src={OWNER_INFO.profilePic} 
              alt={OWNER_INFO.name}
              className="relative w-32 h-32 rounded-full border-4 border-slate-900 object-cover shadow-2xl"
            />
            <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-slate-900 ${isRunning ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
          </div>
          <div className="mb-2">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{OWNER_INFO.name}</h1>
              <div className="bg-cyan-500/20 text-cyan-400 text-[10px] font-black px-2 py-0.5 rounded border border-cyan-500/30 uppercase tracking-widest">OWNER</div>
            </div>
            <p className="text-slate-400 font-medium flex items-center gap-2 tracking-wide">
              <Zap size={16} className="text-cyan-400" /> Exclusive SHOUROV-BOT Control Panel
            </p>
          </div>
        </div>

        <div className="absolute top-10 right-10 flex gap-3">
          <a 
            href={REPO_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl text-slate-200 hover:text-white hover:bg-slate-800 transition-all font-bold text-sm shadow-xl"
          >
            <Github size={20} />
            <span>GitHub Source</span>
          </a>
        </div>
      </section>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Bot Session" 
          value={status} 
          icon={Activity} 
          color={isRunning ? 'emerald' : 'rose'}
        />
        <StatCard 
          label="Engine Uptime" 
          value={isRunning ? "4d 12h 05m" : "00h 00m 00s"} 
          icon={Clock} 
          color="cyan"
        />
        <StatCard 
          label="Total Handled" 
          value="12,450" 
          icon={MessageSquare} 
          trend="+12% today"
          color="purple"
        />
        <StatCard 
          label="Active Auth" 
          value="Verified" 
          icon={Fingerprint} 
          color="emerald"
        />
      </div>

      {/* Master Toggle Area */}
      <div className="p-10 bg-slate-900/30 backdrop-blur-2xl border border-slate-800 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Main System Ignition</h2>
          <p className="text-slate-500 text-sm max-w-lg">Master override for the entire SHOUROV-BOT ecosystem. This toggle connects directly to the PM2 cluster instance.</p>
        </div>
        
        <button
          onClick={toggleBot}
          className={`
            relative z-10 flex items-center gap-4 px-12 py-5 rounded-[2rem] font-black text-lg transition-all duration-500 group overflow-hidden shadow-2xl active:scale-95
            ${isRunning 
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20 shadow-rose-500/10' 
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 shadow-emerald-500/10'}
          `}
        >
          {isRunning ? <Square size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          <span>{isRunning ? 'SHUTDOWN ENGINE' : 'START BOT ENGINE'}</span>
          <div className={`absolute -inset-1 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-500 ${isRunning ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
        </button>
      </div>
    </div>
  );
};

export default DashboardHome;
