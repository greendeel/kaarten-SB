
import React, { useState } from 'react';
import { Lock, ChevronRight } from 'lucide-react';

interface LoginViewProps {
  onUnlock: (code: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUnlock(code);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-b-[10px] border-slate-950">
        <div className="bg-blue-700 p-8 text-center text-white">
          <div className="inline-flex p-5 bg-blue-600 rounded-full mb-6 shadow-inner">
            <Lock size={64} className="text-yellow-400" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">CLUB TOEGANG</h1>
          <p className="text-xl text-blue-100 font-bold mt-2 italic">Alleen voor leden van Senioren Boschweg</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-xl font-black text-slate-400 uppercase tracking-widest block text-center">VOER DE CLUBCODE IN:</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CODE..."
              className="w-full text-4xl p-6 border-4 border-slate-100 rounded-[1.5rem] font-black text-center text-slate-900 outline-none focus:border-blue-500 uppercase bg-slate-50 shadow-inner"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-8 rounded-[2rem] text-2xl font-black shadow-2xl border-b-[8px] border-green-800 transition-all active:translate-y-2 active:border-b-4 flex items-center justify-center gap-4"
          >
            TOEGANG <ChevronRight size={40} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
