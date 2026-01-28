
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: 'cyan' | 'purple' | 'emerald' | 'rose';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, color }) => {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400',
  };

  return (
    <div className={`p-6 rounded-2xl border bg-gradient-to-br ${colorMap[color]} backdrop-blur-sm group hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg bg-slate-900/50 border border-white/5`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-900/50 text-slate-300 border border-white/5">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
};

export default StatCard;
