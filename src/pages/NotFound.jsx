import React from 'react';
import { Home, AlertTriangle, ChevronLeft, WifiOff, Cpu, RefreshCcw } from 'lucide-react';

const NotFound = () => {

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">

      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-red-600/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="max-w-2xl w-full text-center space-y-12 relative z-10">

        <div className="relative inline-block">

          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-ping opacity-20" />

          <div className="relative bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">

            <div className="relative">

              <Cpu size={80} className="text-slate-700" />
              <WifiOff size={32} className="text-red-500 absolute -top-2 -right-2 animate-bounce" />
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-4xl font-black text-red-500/80 mt-2">404</span></div>

            </div>

          </div>

        </div>

        <div className="space-y-4">

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">BAĞLANTI <span className="text-red-500">KOPTU!</span></h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto font-medium leading-relaxed">Aradığın sayfa sistem ağında bulunamadı. Belki taşındı, belki de ESP32'lerden biri kabloyu yedi.</p>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <button onClick={() => window.history.back()} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-800 transition-all active:scale-95">
            <ChevronLeft size={20} /> Geri Dön
          </button>

          <button onClick={() => window.location.href = '/'} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/30 transition-all active:scale-95">
            <Home size={20} /> Ana Dashboard
          </button>

        </div>

        <div className="pt-12">

          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900/40 border border-slate-800/50 rounded-full">

            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <code className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Error_Code: PAGE_NOT_RESPONDING // Gateway_Status: Online</code>

          </div>

        </div>

      </div>

      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

    </div>

  );
};

export default NotFound;