
import React from 'react';
import { BotFeature } from '../types';
import { Settings2, Check, X } from 'lucide-react';

interface FeatureTogglesProps {
  features: BotFeature[];
  onToggle: (id: string) => void;
}

const FeatureToggles: React.FC<FeatureTogglesProps> = ({ features, onToggle }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Settings2 className="text-purple-400" size={32} />
        <h1 className="text-3xl font-bold text-white">Feature Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div 
            key={feature.id}
            className={`
              p-6 rounded-3xl border transition-all duration-500 flex items-center justify-between
              ${feature.enabled 
                ? 'bg-purple-500/5 border-purple-500/20' 
                : 'bg-slate-900/40 border-slate-800'}
            `}
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">{feature.name}</h3>
              <p className="text-slate-400 text-sm max-w-xs">{feature.description}</p>
            </div>

            <button
              onClick={() => onToggle(feature.id)}
              className={`
                relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none
                ${feature.enabled ? 'bg-purple-500' : 'bg-slate-700'}
              `}
            >
              <div className={`
                absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300
                ${feature.enabled ? 'translate-x-8' : 'translate-x-0'}
                flex items-center justify-center
              `}>
                {feature.enabled ? (
                  <Check size={12} className="text-purple-600 font-bold" />
                ) : (
                  <X size={12} className="text-slate-400 font-bold" />
                )}
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="p-8 bg-slate-900/40 rounded-3xl border border-slate-800">
        <h2 className="text-white font-semibold mb-4">Configuration Preview (Read-only)</h2>
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-sm overflow-hidden">
          <pre className="text-purple-300">
            {`{
  "owner": "Alihsan Shourov",
  "version": "4.2.0",
  "features": {
${features.map(f => `    "${f.id}": ${f.enabled}`).join(',\n')}
  },
  "debug": true,
  "cluster_mode": "pm2"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FeatureToggles;
