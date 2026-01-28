
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Terminal, 
  Settings2, 
  Users, 
  Key, 
  LogOut,
  Cpu,
  Facebook,
  MessageCircle,
  Mail
} from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Main' },
    { to: '/control', icon: Cpu, label: 'Bot Engine' },
    { to: '/features', icon: Settings2, label: 'Toggles' },
    { to: '/groups', icon: Users, label: 'Groups' },
    { to: '/apis', icon: Key, label: 'APIs' },
    { to: '/logs', icon: Terminal, label: 'Logs' },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800 flex flex-col z-50">
      <div className="p-8">
        <h1 className="text-2xl font-black bg-gradient-to-br from-cyan-400 via-white to-purple-500 bg-clip-text text-transparent tracking-tighter italic">
          SHOUROV-BOT
        </h1>
        <div className="h-1 w-12 bg-cyan-500 rounded-full mt-1"></div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
            `}
          >
            {/* Fix: Access isActive from NavLink's render prop function to ensure it is defined in the child scope */}
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                <span className="font-semibold text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 space-y-6">
        <div className="flex items-center justify-center gap-4">
          <a href={SOCIAL_LINKS.facebook} target="_blank" className="text-slate-500 hover:text-cyan-400 transition-colors"><Facebook size={18} /></a>
          <a href={SOCIAL_LINKS.whatsapp} target="_blank" className="text-slate-500 hover:text-emerald-400 transition-colors"><MessageCircle size={18} /></a>
          <a href={SOCIAL_LINKS.gmail} target="_blank" className="text-slate-500 hover:text-rose-400 transition-colors"><Mail size={18} /></a>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-rose-500/5 text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/15 border border-rose-500/10 rounded-2xl transition-all duration-300 text-sm font-bold"
        >
          <LogOut size={18} />
          <span>Log Out System</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
