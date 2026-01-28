
import React from 'react';
import { Key, Activity, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import { MOCK_APIS } from '../constants';

const ApiManagementPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20">
          <Key size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">API Command Center</h1>
          <p className="text-slate-400 text-sm">Monitor and secure external service integrations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_APIS.map((api) => (
          <div key={api.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${api.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{api.name}</h3>
                  <span className={`text-[10px] uppercase font-black tracking-widest ${api.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    • {api.status}
                  </span>
                </div>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                <ExternalLink size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 font-mono text-sm relative overflow-hidden">
                <div className="text-slate-500 mb-1 flex items-center gap-2">
                  <ShieldCheck size={14} /> Secret Key
                </div>
                <div className="text-cyan-400 blur-[3px] hover:blur-none transition-all cursor-pointer">
                  {api.key}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors">
                  Refresh
                </button>
                <button className="flex-1 py-2.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white border border-cyan-500/20 rounded-xl text-xs font-bold transition-all">
                  Test Sync
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/10 rounded-3xl">
        <h2 className="text-white font-bold mb-2 flex items-center gap-2">
          <Activity size={18} className="text-cyan-400" /> API Latency Dashboard
        </h2>
        <p className="text-slate-400 text-sm mb-6">Real-time response tracking for Shourov-Bot modules.</p>
        <div className="grid grid-cols-4 gap-4 h-24 items-end">
          {[40, 65, 30, 85, 45, 90, 20, 55].map((h, i) => (
            <div key={i} className="bg-cyan-500/20 rounded-t-lg w-full" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiManagementPage;
