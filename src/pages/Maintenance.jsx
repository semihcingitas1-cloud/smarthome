import React from 'react';
import { Settings, Wrench, HardDrive, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';

const Maintenance = () => {

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="max-w-xl w-full relative z-10">
        
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="flex justify-center mb-10">

            <div className="relative">

              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow-inner">

                <Settings size={48} className="text-blue-500 animate-[spin_8s_linear_infinite]" />
                <Wrench size={24} className="text-slate-400 absolute -bottom-2 -right-2 animate-bounce" />

              </div>

            </div>

          </div>

          <div className="text-center space-y-4 mb-10">

            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Sistem <span className="text-blue-500 text-glow">Güncelleniyor</span></h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              Gateway ve sensörler arasında bir senkronizasyon çalışması yapıyoruz. Kısa süre içinde eviniz tekrar akıllanacak.
            </p>

          </div>

          <div className="space-y-6">

            <div className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 space-y-4">
              
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">

                <span className="text-slate-500 flex items-center gap-2"><HardDrive size={14} /> Veritabanı Optimizasyonu</span>
                <span className="text-blue-400">%85</span>

              </div>
              
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">

                <div className="h-full bg-blue-600 shadow-[0_0_10px_#2563eb] rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '85%' }}></div>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 flex items-center gap-3">

                <div className="bg-green-500/10 p-2 rounded-lg"><ShieldCheck size={18} className="text-green-500" /></div>

                <div>

                  <p className="text-[10px] text-slate-500 font-bold uppercase">Güvenlik</p>
                  <p className="text-xs text-white font-bold">Aktif</p>

                </div>

              </div>
              
              <div className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 flex items-center gap-3">

                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><Cpu size={18} className="animate-pulse" /></div>

                <div>

                  <p className="text-[10px] text-slate-500 font-bold uppercase">OTA Update</p>
                  <p className="text-xs text-white font-bold">Beklemede</p>

                </div>

              </div>

            </div>

          </div>

          <div className="mt-10 flex flex-col items-center gap-6">

            <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-8 py-3 bg-white/[0.03] hover:bg-white/[0.08] text-white rounded-2xl border border-white/5 transition-all font-bold group">
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
              Bağlantıyı Kontrol Et
            </button>

            <p className="text-[10px] text-slate-600 font-mono tracking-[0.2em] uppercase">System Version v2.4.0-Maintenance</p>

          </div>

        </div>

        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-20"></div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-20"></div>

      </div>

      <style jsx>{`
        @keyframes progress {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .text-glow {
          text-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
        }
      `}</style>

    </div>

  );
};

export default Maintenance;