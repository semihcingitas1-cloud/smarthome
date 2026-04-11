import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, ShieldCheck, Home } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sıfırlama kodu gönderildi:", email);
    setIsSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-800">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        <div className="p-8 pb-0 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-900/20">
            <Home size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Şifrenizi mi Unuttunuz?</h2>
          <p className="text-slate-400 text-sm mt-2">
            Endişelenmeyin! Kayıtlı e-posta adresinizi yazın, size bir sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">E-Posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" 
                  placeholder="ornek@mail.com" 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] mt-4">
              <Send size={18} />
              Sıfırlama Bağlantısı Gönder
            </button>
          </form>
        ) : (
          <div className="p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6">
              <p className="text-green-400 text-sm">Talimatlar e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.</p>
            </div>
            <button onClick={() => setIsSent(false)} className="text-blue-500 text-sm font-bold hover:underline">
              Tekrar dene
            </button>
          </div>
        )}

        <div className="p-6 bg-slate-800/30 border-t border-slate-800 text-center">
          <button className="flex items-center justify-center gap-2 text-slate-400 text-sm font-bold hover:text-white transition-colors w-full">
            <ArrowLeft size={16} />
            Giriş Sayfasına Dön
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            <ShieldCheck size={12} />
            Güvenli İşlem
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;