
import React, { useState } from 'react';
import { BotStatus } from '../types';
import { Cpu, RefreshCw, Power, Terminal, AlertCircle } from 'lucide-react';

interface ControlPageProps {
  status: BotStatus;
  onStatusChange: (newStatus: BotStatus) => void;
}

const ControlPage: React.FC<ControlPageProps> = ({ status, onStatusChange }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = (action: string, newStatus: BotStatus) => {
    setLoadingAction(action);
    // Simulate PM2 action
    setTimeout(() => {
      onStatusChange(newStatus);
      setLoadingAction(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <Cpu className="text-cyan-400" size={32} />
        <h1 className="text-3xl font-bold text-white">Bot Engine (PM2)</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action Card: Start */}
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
          <div className="p-3 bg-emerald-500/10 rounded-xl w-fit mb-6 text-emerald-400">
            <Power size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Start Engine</h3>
          <p className="text-slate-400 text-sm mb-6">Initialize the bot processes using PM2 cluster mode for high availability.</p>
          <button
            onClick={() => handleAction('start', BotStatus.RUNNING)}
            disabled={status === BotStatus.RUNNING || !!loadingAction}
            className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAction === 'start' ? 'Processing...' : 'Deploy Process'}
          </button>
        </div>

        {/* Action Card: Stop */}
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
          <div className="p-3 bg-rose-500/10 rounded-xl w-fit mb-6 text-rose-400">
            <Power size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Kill Engine</h3>
          <p className="text-slate-400 text-sm mb-6">Gracefully terminate all active bot instances and clear PM2 cache.</p>
          <button
            onClick={() => handleAction('stop', BotStatus.STOPPED)}
            disabled={status === BotStatus.STOPPED || !!loadingAction}
            className="w-full py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingAction === 'stop' ? 'Processing...' : 'Terminate Process'}
          </button>
        </div>

        {/* Action Card: Restart */}
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
          <div className="p-3 bg-amber-500/10 rounded-xl w-fit mb-6 text-amber-400">
            <RefreshCw size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Rolling Restart</h3>
          <p className="text-slate-400 text-sm mb-6">Zero-downtime restart to apply configuration changes or clear memory leaks.</p>
          <button
            onClick={() => handleAction('restart', BotStatus.RUNNING)}
            disabled={!!loadingAction}
            className="w-full py-3 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white border border-amber-500/20 rounded-xl transition-all font-semibold disabled:opacity-50"
          >
            {loadingAction === 'restart' ? 'Rebooting...' : 'Restart Now'}
          </button>
        </div>
      </div>

      {/* System Status Table */}
      <div className="bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={20} className="text-slate-400" />
            <span className="font-semibold text-white">Process Monitor</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status === BotStatus.RUNNING ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {status}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">App Name</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">CPU</th>
                <th className="px-6 py-4">Memory</th>
                <th className="px-6 py-4">Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="text-slate-300">
                <td className="px-6 py-4">shourov-bot-main</td>
                <td className="px-6 py-4">0</td>
                <td className="px-6 py-4">cluster</td>
                <td className="px-6 py-4">{status === BotStatus.RUNNING ? '1.2%' : '0%'}</td>
                <td className="px-6 py-4">{status === BotStatus.RUNNING ? '84.2 MB' : '0 MB'}</td>
                <td className="px-6 py-4">{status === BotStatus.RUNNING ? '4d 12h' : 'offline'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl text-cyan-400 text-sm">
        <AlertCircle size={20} />
        <p>Warning: Stopping the bot engine will disconnect all active Messenger sessions immediately.</p>
      </div>
    </div>
  );
};

export default ControlPage;
