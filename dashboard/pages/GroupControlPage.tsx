
import React, { useState } from 'react';
import { Users, Search, CheckCircle2, XCircle } from 'lucide-react';
import { MOCK_GROUPS } from '../constants';

const GroupControlPage: React.FC = () => {
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleGroup = (id: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, active: !g.active } : g));
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
            <Users size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Group Ecosystem</h1>
            <p className="text-slate-400 text-sm">Manage bot activity across indexed Messenger threads.</p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredGroups.map((group) => (
          <div 
            key={group.id}
            className={`p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between group
              ${group.active 
                ? 'bg-purple-500/5 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]' 
                : 'bg-slate-900/40 border-slate-800'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg
                ${group.active ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-800 text-slate-500'}`}>
                {group.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{group.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{group.memberCount.toLocaleString()} members</p>
              </div>
            </div>

            <button
              onClick={() => toggleGroup(group.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                ${group.active 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'}`}
            >
              {group.active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {group.active ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupControlPage;
