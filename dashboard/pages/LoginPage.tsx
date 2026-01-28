
import React, { useState } from 'react';
import { Facebook, ShieldCheck, Lock, FileText, ChevronRight } from 'lucide-react';

import { API_BASE } from '../constants';

interface LoginPageProps {
  onLogin: (method: 'facebook' | 'cookie') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [cookie, setCookie] = useState('');
  const [showCookieInput, setShowCookieInput] = useState(false);

  const handleAuth = async (method: 'facebook' | 'cookie') => {
  setLoading(true);

  try {
    if (method === 'cookie') {
      const res = await fetch(`${API_BASE}/api/cookie/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookie })
      });

      if (!res.ok) {
        throw new Error("Cookie save failed");
      }
    }

    onLogin(method);
  } catch (err) {
    alert("Login failed. Check backend.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 mb-6 glow-cyan ring-4 ring-cyan-500/5">
            <ShieldCheck size={56} className="text-cyan-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">SHOUROV BOT</h1>
          <p className="text-slate-400 font-medium">Alihsan Shourov's Private Controller</p>
        </div>

        {!showCookieInput ? (
          <div className="space-y-4">
            <button
              onClick={() => handleAuth('facebook')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-70 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Facebook size={22} fill="currentColor" />
              )}
              {loading ? 'Validating Session...' : 'Connect Facebook'}
            </button>
            
            <button
              onClick={() => setShowCookieInput(true)}
              className="w-full flex items-center justify-center gap-3 bg-slate-800/50 hover:bg-slate-800 text-slate-200 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 border border-slate-700"
            >
              <FileText size={20} />
              Paste Manual Cookie
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="relative">
              <textarea
                value={cookie}
                onChange={(e) => setCookie(e.target.value)}
                placeholder="paste your facebook cookie here..."
                className="w-full h-32 bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCookieInput(false)}
                className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!cookie || loading}
                onClick={() => handleAuth('cookie')}
                className="flex-[2] py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Saving to Shourov.txt...' : 'Apply Cookie'}
                {!loading && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 justify-center text-[10px] text-slate-500 mt-8 uppercase tracking-[0.2em]">
          <Lock size={10} />
          <span>Encrypted Session • Shourov v4.5</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
