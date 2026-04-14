import React, { useState } from 'react';
import { User, Mail, Lock, Bell, Shield, Palette, LogOut, Camera, Smartphone, Key, Save, Eye, EyeOff, Globe } from 'lucide-react';

const UserProfile = () => {

  const [showPass, setShowPass] = useState(false);
  const [notifications, setNotifications] = useState({ push: true, email: false, security: true });

  return (

      <div className="flex-1 lg:ml-0 overflow-x-hidden">

        <div className="bg-slate-950 text-white min-h-screen p-6 lg:p-12 animate-in fade-in duration-700 max-w-7xl mx-auto">
          
          <div className="mb-12 space-y-2">

            <h1 className="text-4xl font-extrabold tracking-tight">Profil Ayarları</h1>
            <p className="text-slate-400">Hesap bilgilerinizi ve sistem tercihlerini buradan yönetin.</p>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="space-y-6">

              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-center relative overflow-hidden">

                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20"></div>
                
                <div className="relative mt-4 mb-6 inline-block">

                  <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-950 flex items-center justify-center overflow-hidden">
                    <User size={48} className="text-slate-500" />
                  </div>

                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full border-2 border-slate-950 hover:bg-blue-500 transition-all">
                    <Camera size={14} />
                  </button>

                </div>

                <h2 className="text-xl font-bold">Kullanıcı Adı</h2>
                <p className="text-sm text-slate-500 font-medium">Sistem Yöneticisi (Admin)</p>

                <div className="mt-8 pt-8 border-t border-slate-800 space-y-2">

                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 hover:bg-slate-800 transition-all group">

                    <div className="flex items-center gap-3 text-sm font-bold"><Shield size={18} className="text-green-500" /> Güvenlik Durumu</div>
                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded-lg">Güçlü</span>

                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-500/10 transition-all group text-red-500">

                    <div className="flex items-center gap-3 text-sm font-bold"><LogOut size={18} /> Oturumu Kapat</div>

                  </button>

                </div>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 space-y-4">

                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Bağlı Cihazlar</h3>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">

                  <Smartphone size={20} className="text-blue-500" />

                  <div className="flex-1">

                    <p className="text-xs font-bold">MacBook Air - macOS</p>
                    <p className="text-[10px] text-slate-500">Şu an aktif</p>

                  </div>

                </div>

              </div>

            </div>

            <div className="lg:col-span-2 space-y-8">

              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 space-y-8">

                <h3 className="text-xl font-bold flex items-center gap-3"><User className="text-blue-500" /> Kişisel Bilgiler</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-2">

                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Ad Soyad</label>

                    <div className="relative">

                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input type="text" defaultValue="Akıllı Ev Kullanıcısı" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all" />

                    </div>

                  </div>
                  

                  <div className="space-y-2">

                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">E-Posta Adresi</label>

                    <div className="relative">

                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input type="email" defaultValue="admin@smartnode.com" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all" />

                    </div>

                  </div>

                </div>

                <div className="space-y-2">

                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Yeni Şifre</label>

                  <div className="relative">

                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500 transition-all" />
                    <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>

                  </div>

                </div>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10">

                <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><Palette className="text-purple-500" /> Sistem Tercihleri</h3>

                <div className="space-y-6">

                  {[
                    { id: 'push', title: 'Anlık Bildirimler', desc: 'Sensör uyarılarını mobil cihazıma gönder.', icon: <Bell />, color: 'text-blue-500' },
                    { id: 'security', title: 'İki Faktörlü Doğrulama', desc: 'Girişlerde ek güvenlik katmanı kullan.', icon: <Key />, color: 'text-green-500' },
                    { id: 'email', title: 'Haftalık Enerji Raporu', desc: 'E-posta ile tasarruf özeti al.', icon: <Globe />, color: 'text-purple-500' }
                  ].map((item) => ( <div key={item.id} className="flex items-center justify-between gap-4 p-4 hover:bg-slate-950/30 rounded-2xl transition-all">

                    <div className="flex items-center gap-4">

                      <div className={`p-3 bg-slate-950 border border-slate-800 rounded-xl ${item.color}`}>{item.icon}</div>

                      <div>

                        <p className="text-sm font-bold text-white">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>

                      </div>

                    </div>

                    <button onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})} className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.id] ? 'bg-blue-600' : 'bg-slate-800'}`}>

                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.id] ? 'left-7' : 'left-1'}`} />

                    </button>

                  </div> ))}

                </div>

              </div>

              <div className="flex justify-end gap-4">

                <button className="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-900 transition-all">Vazgeç</button>
                <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-extrabold flex items-center gap-3 shadow-lg shadow-blue-900/20 transition-all active:scale-95"><Save size={20} /> Değişiklikleri Uygula</button>

              </div>

            </div>

          </div>

        </div>

    </div>

  );
};

export default UserProfile;
