import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, Home } from 'lucide-react';

const ResetPassword = () => {

  const [showPass, setShowPass] = useState(false);
  const [showRetPass, setShowRetPass] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

  const handleSubmit = (e) => {

    e.preventDefault();

    if(formData.password !== formData.confirmPassword) {

      alert("Şifreler eşleşmiyor!");
      return;
    }
  };

  return (

    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-800">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        <div className="p-8 pb-0 text-center">

          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-900/20"><Lock size={32} className="text-white" /></div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Yeni Şifre Belirle</h2>
          <p className="text-slate-400 text-sm mt-2">Lütfen hesabınız için yeni ve güçlü bir şifre oluşturun.</p>

        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">

          <div className="space-y-2">

            <label className="text-xs font-bold text-slate-500 uppercase px-1">Yeni Şifre</label>

            <div className="relative">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type={showPass ? "text" : "password"} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

          </div>

          <div className="space-y-2">

            <label className="text-xs font-bold text-slate-500 uppercase px-1">Şifre Tekrar</label>

            <div className="relative">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type={showRetPass ? "text" : "password"} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowRetPass(!showRetPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showRetPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] mt-4">

            <CheckCircle2 size={18} />
            Şifreyi Güncelle

          </button>

        </form>

        <div className="p-6 bg-slate-800/30 border-t border-slate-800">

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold">

            <ShieldCheck size={12} />
            Güvenli Şifreleme Aktif

          </div>

        </div>

      </div>

    </div>

  );
};

export default ResetPassword;