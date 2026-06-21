import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { ShieldAlert, Home, ArrowLeft, Lock, AlertTriangle, Mail, HelpCircle } from "lucide-react";

const Unauthorized = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const reason = location.state?.reason ?? "Bu sayfaya erişim yetkiniz bulunmuyor.";
  const requestedPath = location.state?.path ?? location.pathname;

  return (

    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-slate-950 bg-slate-50 dark:text-slate-100 text-slate-900 transition-colors duration-300 px-4 py-12">

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">

        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>

      </div>

      <div className="relative z-10 max-w-2xl w-full">

        <div className="flex justify-center mb-8">

          <div className="relative">

            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-2xl shadow-rose-500/40 animate-pulse"><ShieldAlert size={48} className="text-white" strokeWidth={2} /></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40 animate-bounce"><Lock size={16} className="text-white" /></div>

          </div>

        </div>

        <div className="text-center mb-6">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full dark:bg-rose-500/10 bg-rose-50 border dark:border-rose-500/20 border-rose-200 mb-4">

            <AlertTriangle size={16} className="from-blue-400 via-blue-500 to-indigo-500" />
            <span className="text-sm font-bold from-blue-400 via-blue-500 to-indigo-500 tracking-wider">HATA KODU: 403</span>

          </div>

          <h1 className="text-6xl md:text-7xl font-black dark:text-white text-slate-900 mb-2 tracking-tight">Erişim <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500">Reddedildi</span></h1>

        </div>

        <div className="dark:bg-slate-900 bg-white rounded-2xl border dark:border-slate-800 border-slate-200 p-8 mb-8 shadow-xl">

          <div className="flex items-start gap-4 mb-6">

            <div className="w-12 h-12 rounded-xl dark:bg-slate-800 bg-slate-100 flex items-center justify-center flex-shrink-0"><AlertTriangle size={24} className="text-rose-500" /></div>

            <div className="flex-1">

              <h2 className="text-lg font-bold dark:text-white text-slate-900 mb-2">Yetkilendirme Hatası</h2>
              <p className="dark:text-slate-400 text-slate-600 leading-relaxed">{reason}</p>

            </div>

          </div>

          <div className="dark:bg-slate-950 bg-slate-50 rounded-xl p-4 border dark:border-slate-800 border-slate-200">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

              <div>

                <span className="dark:text-slate-500 text-slate-400 font-medium block mb-1">İstek Yapılan Sayfa:</span>
                <code className="dark:text-slate-300 text-slate-700 font-mono text-xs bg-slate-800/50 dark:bg-slate-800 px-2 py-1 rounded">{requestedPath}</code>

              </div>

              <div>

                <span className="dark:text-slate-500 text-slate-400 font-medium block mb-1">Erişim Seviyesi:</span>
                <span className="text-rose-500 font-semibold">Yetkisiz</span>

              </div>

            </div>

          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">

          <button onClick={() => navigate(-1)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border dark:border-slate-700 border-slate-200 dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700 hover:bg-slate-50 transition-all font-semibold shadow-lg hover:shadow-xl active:scale-[0.98]">
            <ArrowLeft size={18} />
            Geri Dön
          </button>

          <button onClick={() => navigate("/")} className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white transition-all font-semibold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 active:scale-[0.98]">
            <Home size={18} />
            Anasayfaya Dön
          </button>

        </div>

        <div className="dark:bg-slate-900/50 bg-white/50 backdrop-blur-sm rounded-2xl border dark:border-slate-800 border-slate-200 p-6">

          <div className="flex items-start gap-3 mb-4">

            <HelpCircle size={20} className="dark:text-slate-400 text-slate-500 mt-0.5" />

            <div>

              <h3 className="font-bold dark:text-white text-slate-900 mb-1">Yardıma mı ihtiyacınız var?</h3>
              <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">Bu sayfaya erişim için gerekli yetkilere sahip olmadığınızı düşünüyorsanız, sistem yöneticinizle iletişime geçin.</p>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <a href="mailto:support@example.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700 hover:bg-slate-200 transition-all text-sm font-medium">
              <Mail size={16} />
              Destek Ekibi
            </a>

            <button onClick={() => navigate("/help")} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700 dark:hover:bg-slate-700 hover:bg-slate-200 transition-all text-sm font-medium">
              <HelpCircle size={16} />
              Yardım Merkezi
            </button>

          </div>

        </div>

        <div className="mt-8 text-center">

          <p className="text-xs dark:text-slate-600 text-slate-400 font-mono">ERR_ACCESS_DENIED • {new Date().toLocaleString('tr-TR')}</p>

        </div>

      </div>

    </div>
  );
};

export default Unauthorized;