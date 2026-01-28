
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Download, Trash2, Search, PlayCircle } from 'lucide-react';
import { LogEntry } from '../types';

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulated log generator
    const messages = [
      "New message from Alihsan: 'Check status'",
      "Command recognized: /start",
      "Fetching API data from Graph API...",
      "Cache cleared for group ID: 104251",
      "Process optimized: Memory usage dropped by 12MB",
      "Admin command executed: /update_config",
      "Connection to database established: Postgres@v15"
    ];

    const interval = setInterval(() => {
      const entry: LogEntry = {
        timestamp: new Date().toLocaleTimeString(),
        level: Math.random() > 0.8 ? 'warn' : Math.random() > 0.9 ? 'error' : 'info',
        message: messages[Math.floor(Math.random() * messages.length)]
      };
      setLogs(prev => [...prev.slice(-49), entry]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAutoScroll) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAutoScroll]);

  const clearLogs = () => setLogs([]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="text-cyan-400" size={32} />
          <h1 className="text-3xl font-bold text-white">Live Console</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${isAutoScroll ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            {isAutoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
          </button>
          <button onClick={clearLogs} className="p-2 text-slate-400 hover:text-rose-400 transition-colors">
            <Trash2 size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        {/* Terminal Header */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               SOCKET CONNECTED
             </div>
          </div>
        </div>

        {/* Log Stream */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-2">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <PlayCircle size={48} className="mb-4 opacity-20" />
              <p>Waiting for process logs...</p>
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-4 group">
                <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                <span className={`uppercase font-bold shrink-0 ${
                  log.level === 'error' ? 'text-rose-500' : 
                  log.level === 'warn' ? 'text-amber-500' : 
                  'text-cyan-500'
                }`}>
                  {log.level}:
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search in logs..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-slate-300 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
