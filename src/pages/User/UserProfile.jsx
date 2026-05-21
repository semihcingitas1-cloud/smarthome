import React, { use, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { logoutUser } from "../../redux/userSlice";

import { User, Mail, Lock, Bell, Shield, Palette, LogOut, Camera, Smartphone, Key, Save, Eye, EyeOff, ChevronRight, Globe, Clock, MapPin, Phone, Calendar, Award, Activity, Settings, Trash2, CheckCircle2, AlertCircle, Edit2, X, Laptop, Tablet, Languages, RefreshCw, Copy, Check } from 'lucide-react';

const UserProfile = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuth } = useSelector((state) => state.user);

  const [showPass, setShowPass] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [notifications, setNotifications] = useState({

    push: true,
    email: false,
    security: true,
    updates: true,
    marketing: false
  });

  const [userInfo, setUserInfo] = useState({

    name: user?.user?.name,
    email: user?.user?.email,
    phone: user?.user?.phone,
    timezone: user?.user?.timezone,
    language: 'tr',
    joinDate: user?.user?.joinDate
  });

  const [preferences, setPreferences] = useState({

    theme: 'dark',
    notifications: true,
    soundEffects: true,
    autoSave: true,
    dataSync: true
  });

  const devices = [
    {
      id: 1,
      name: 'MacBook Air',
      type: 'laptop',
      os: 'macOS Sonoma',
      browser: 'Chrome 120',
      location: 'İstanbul, TR',
      lastActive: 'Şu an aktif',
      icon: <Laptop />,
      isActive: true
    }
  ];

  const stats = [

    { label: 'Toplam Cihaz', value: '12', icon: <Activity />, color: 'blue' },
    { label: 'Aktif Otomasyon', value: '8', icon: <RefreshCw />, color: 'green' },
    { label: 'Enerji Tasarrufu', value: '₺234', icon: <Award />, color: 'purple' },
    { label: 'Üyelik Süresi', value: '6 Ay', icon: <Calendar />, color: 'orange' }
  ];

  const tabs = [

    { id: 'profile', label: 'Profil Bilgileri', icon: <User /> },
    { id: 'security', label: 'Güvenlik', icon: <Shield /> },
    { id: 'preferences', label: 'Tercihler', icon: <Settings /> },
    { id: 'devices', label: 'Cihazlar', icon: <Smartphone /> },
    { id: 'activity', label: 'Aktivite', icon: <Activity /> }
  ];

  const activityLog = [

    { action: 'Giriş Yapıldı', device: 'MacBook Air', time: '2 dakika önce', icon: <LogOut />, color: 'green' },
    { action: 'Şifre Değiştirildi', device: 'iPhone 15 Pro', time: '3 saat önce', icon: <Key />, color: 'blue' },
    { action: 'Profil Güncellendi', device: 'iPad Pro', time: '1 gün önce', icon: <Edit2 />, color: 'purple' },
    { action: '2FA Etkinleştirildi', device: 'MacBook Air', time: '3 gün önce', icon: <Shield />, color: 'orange' }
  ];

  const logout = () => {
  
    localStorage.removeItem("token");
    dispatch(logoutUser());
    navigate('/');
  };

  const handleSave = () => {

    setShowSuccessToast(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleCopyUserId = () => {

    navigator.clipboard.writeText(user?.user?._id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteAccount = () => {

    console.log('Account deletion requested');
    setShowDeleteModal(false);
  };

  return (

    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen">

      {showSuccessToast && ( <div className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in">

        <CheckCircle2 size={24} />

        <div>

          <p className="font-bold">Başarılı!</p>
          <p className="text-sm">Değişiklikler kaydedildi.</p>

        </div>

      </div> )}

      {showDeleteModal && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full">

          <div className="flex items-center gap-4 mb-6">

            <div className="p-3 bg-red-500/10 rounded-2xl"><AlertCircle className="text-red-500" size={32} /></div>

            <div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Hesabı Sil</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Bu işlem geri alınamaz</p>
            </div>

          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-6">Hesabınızı silmek istediğinizden emin misiniz? Tüm verileriniz ve ayarlarınız kalıcı olarak silinecektir.</p>

          <div className="flex gap-3">

            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold transition-colors">
              İptal
            </button>

            <button onClick={handleDeleteAccount} className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors">
              Hesabı Sil
            </button>

          </div>

        </div>

      </div> )}

      <main className="flex-1 lg:ml-0 overflow-x-hidden">

        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen p-6 lg:p-12 transition-colors">

          <div className="max-w-7xl mx-auto">

            <div className="mb-8">

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Profil Ayarları</h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Hesap bilgilerinizi ve sistem tercihlerini buradan yönetin.</p>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

              {stats.map((stat, i) => ( <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all">

                <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center mb-4`}>
                  <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.icon}</div>
                </div>

                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500">{stat.label}</div>

              </div> ))}

            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 mb-8 overflow-x-auto">

              <div className="flex gap-2 min-w-max">

                {tabs.map((tab) => ( <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>

                  {tab.icon}
                  {tab.label}

                </button> ))}

              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="space-y-6">

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden">

                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20" />

                  <div className="relative mt-4 mb-6 inline-block">

                    <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center overflow-hidden">
                      <User size={48} className="text-slate-400 dark:text-slate-500" />
                    </div>

                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-950 hover:bg-blue-700 transition-all">
                      <Camera size={14} className="text-white" />
                    </button>

                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{userInfo.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-500 font-medium mb-4">{user?.user?.role === "admin" ? "Sistem Yöneticisi (Admin)" : "Kullanıcı"}</p>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 mb-6">

                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">Kullanıcı ID</p>

                    <div className="flex items-center justify-between gap-2">

                      <p className="text-xs font-mono text-slate-900 dark:text-white">{user?.user?._id}</p>

                      <button onClick={handleCopyUserId} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        {copied ? ( <Check size={14} className="text-green-600 dark:text-green-400" /> ) : ( <Copy size={14} className="text-slate-400" /> )}
                      </button>

                    </div>

                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">

                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-green-50 dark:bg-slate-950/50 hover:bg-green-100 dark:hover:bg-slate-800 transition-all group border border-green-200 dark:border-slate-800">

                      <div className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white"><Shield size={18} className="text-green-600 dark:text-green-500" />Güvenlik Durumu</div>
                      <span className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-500 px-2 py-1 rounded-lg font-bold">Güçlü</span>

                    </button>

                    <button onClick={() => logout()} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group text-red-600 dark:text-red-500 border border-transparent hover:border-red-200 dark:hover:border-red-500/20">
                      <div className="flex items-center gap-3 text-sm font-bold"><LogOut size={18} />Oturumu Kapat</div>
                    </button>

                  </div>

                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">

                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest px-2">Hızlı Bilgi</h3>

                  <div className="space-y-3">

                    <div className="flex items-center gap-3 text-sm">

                      <Calendar size={16} className="text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">Üyelik:</span>
                      <span className="font-semibold text-slate-900 dark:text-white ml-auto">{userInfo.joinDate}</span>

                    </div>

                    <div className="flex items-center gap-3 text-sm">

                      <Globe size={16} className="text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">Saat Dilimi:</span>
                      <span className="font-semibold text-slate-900 dark:text-white ml-auto">GMT+3</span>

                    </div>

                    <div className="flex items-center gap-3 text-sm">

                      <Languages size={16} className="text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">Dil:</span>
                      <span className="font-semibold text-slate-900 dark:text-white ml-auto">Türkçe</span>

                    </div>

                  </div>

                </div>

              </div>

              <div className="lg:col-span-2 space-y-8">

                {activeTab === 'profile' && ( <>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10">

                    <div className="flex items-center justify-between mb-8">

                      <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white"><User className="text-blue-600 dark:text-blue-500" />Kişisel Bilgiler</h3>

                      {!isEditing && ( <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">

                        <Edit2 size={16} />
                        Düzenle

                      </button> )}

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="space-y-2">

                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-2">Ad Soyad</label>

                        <div className="relative">

                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" value={userInfo.name} onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} disabled={!isEditing} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"/>

                        </div>

                      </div>

                      <div className="space-y-2">

                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-2">E-Posta Adresi</label>

                        <div className="relative">

                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="email" value={userInfo.email} onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} disabled={!isEditing} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"/>

                        </div>

                      </div>

                      <div className="space-y-2">

                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-2">Telefon</label>

                        <div className="relative">

                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="tel" value={userInfo.phone} onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} disabled={!isEditing} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"/>

                        </div>

                      </div>

                      <div className="space-y-2">

                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-2">Konum</label>

                        <div className="relative">

                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" value={userInfo.location} onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })} disabled={!isEditing} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"/>

                        </div>

                      </div>

                    </div>

                    {isEditing && ( <div className="flex justify-end gap-3 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">

                      <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-semibold transition-colors">
                        İptal
                      </button>

                      <button onClick={handleSave} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all">
                        <Save size={18} />
                        Kaydet
                      </button>

                    </div> )}

                  </div>

                </> )}

                {activeTab === 'security' && ( <div className="space-y-8">

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10">

                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white"><Lock className="text-blue-600 dark:text-blue-500" />Şifre Değiştir</h3>

                    <div className="space-y-6">

                      <div className="space-y-2">

                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-2">Mevcut Şifre</label>

                        <div className="relative">

                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type={showCurrentPass ? 'text' : 'password'} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"/>

                          <button onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>

                        </div>

                      </div>

                      <div className="space-y-2">

                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-2">Yeni Şifre</label>

                        <div className="relative">

                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"/>

                          <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>

                        </div>

                      </div>

                      <div className="space-y-2">

                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-2">Şifre Tekrar</label>

                        <div className="relative">

                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type={showConfirmPass ? 'text' : 'password'} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"/>

                          <button onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>

                        </div>

                      </div>

                      <button onClick={handleSave} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all">
                        <Key size={18} />
                        Şifreyi Güncelle
                      </button>

                    </div>

                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white"><Shield className="text-green-600 dark:text-green-500" />İki Faktörlü Doğrulama</h3>

                    <div className="flex items-start justify-between gap-4 p-6 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl mb-6">

                      <div className="flex items-start gap-3">

                        <CheckCircle2 className="text-green-600 dark:text-green-500 flex-shrink-0 mt-1" size={20} />

                        <div>

                          <h4 className="font-bold text-green-900 dark:text-green-400 mb-1">2FA Aktif</h4>
                          <p className="text-sm text-green-700 dark:text-green-300">Hesabınız iki faktörlü doğrulama ile korunuyor</p>

                        </div>

                      </div>

                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors flex-shrink-0">
                        Yönet
                      </button>

                    </div>

                  </div>

                </div> )}

                {activeTab === 'preferences' && ( <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10">

                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white"><Palette className="text-purple-600 dark:text-purple-500" />Sistem Tercihleri</h3>

                  <div className="space-y-6">

                    {[
                      {
                        id: 'push',
                        title: 'Anlık Bildirimler',
                        desc: 'Sensör uyarılarını mobil cihazıma gönder.',
                        icon: <Bell />,
                        color: 'text-blue-600 dark:text-blue-500'
                      },
                      {
                        id: 'security',
                        title: 'İki Faktörlü Doğrulama',
                        desc: 'Girişlerde ek güvenlik katmanı kullan.',
                        icon: <Key />,
                        color: 'text-green-600 dark:text-green-500'
                      },
                      {
                        id: 'email',
                        title: 'Haftalık Enerji Raporu',
                        desc: 'E-posta ile tasarruf özeti al.',
                        icon: <Globe />,
                        color: 'text-purple-600 dark:text-purple-500'
                      },
                      {
                        id: 'updates',
                        title: 'Yazılım Güncellemeleri',
                        desc: 'Yeni özellikler hakkında bilgi al.',
                        icon: <RefreshCw />,
                        color: 'text-orange-600 dark:text-orange-500'
                      },
                      {
                        id: 'marketing',
                        title: 'Pazarlama E-postaları',
                        desc: 'Kampanya ve duyurular hakkında bilgilendirme.',
                        icon: <Mail />,
                        color: 'text-pink-600 dark:text-pink-500'
                      }

                    ].map((item) => ( <div key={item.id} className="flex items-center justify-between gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-950/30 rounded-2xl transition-all">

                      <div className="flex items-center gap-4">

                        <div className={`p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl ${item.color}`}>
                          {item.icon}
                        </div>

                        <div>

                          <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-500">{item.desc}</p>

                        </div>

                      </div>

                      <button onClick={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id] })} className={`w-14 h-7 rounded-full transition-colors relative ${notifications[item.id] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-800'}`}>

                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${notifications[item.id] ? 'right-1' : 'left-1'}`}/>

                      </button>

                    </div> ))}

                  </div>

                </div> )}

                {activeTab === 'devices' && ( <div className="space-y-6">

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                    <div className="flex items-center justify-between mb-6">

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bağlı Cihazlar</h3>
                      <span className="text-sm text-slate-500 dark:text-slate-500">{devices.length} cihaz</span>

                    </div>

                      <div className="space-y-4">

                        {devices.map((device) => ( <div key={device.id} className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-lg transition-all" >

                        <div className={`p-3 rounded-xl ${device.isActive ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          {device.icon}
                        </div>

                        <div className="flex-1">

                          <div className="flex items-start justify-between gap-2 mb-2">

                            <div>

                              <h4 className="font-bold text-slate-900 dark:text-white">{device.name}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-500">{device.os} • {device.browser}</p>

                            </div>

                            {device.isActive && ( <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-bold">Aktif</span> )}

                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">

                            <span className="flex items-center gap-1"><MapPin size={12} />{device.location}</span>
                            <span className="flex items-center gap-1"><Clock size={12} />{device.lastActive}</span>

                          </div>

                        </div>

                        {!device.isActive && ( <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition-colors">
                          <X size={18} />
                        </button> )}

                      </div> ))}

                    </div>

                  </div>

                </div> )}

                {activeTab === 'activity' && ( <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">

                  <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Son Aktiviteler</h3>

                  <div className="space-y-4">

                    {activityLog.map((activity, i) => ( <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">

                      <div className={`p-3 rounded-xl bg-${activity.color}-500/10 text-${activity.color}-600 dark:text-${activity.color}-400`}>{activity.icon}</div>

                      <div className="flex-1">

                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{activity.action}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{activity.device}</p>

                      </div>

                      <span className="text-xs text-slate-500 dark:text-slate-500">{activity.time}</span>

                    </div> ))}

                  </div>

                </div> )}

                {activeTab === 'security' && ( <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-8">

                  <div className="flex items-start gap-4 mb-6">

                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={24} />

                    <div>

                      <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-2">Tehlikeli Bölge</h3>
                      <p className="text-sm text-red-700 dark:text-red-300">Bu işlemler geri alınamaz. Lütfen dikkatli olun.</p>

                    </div>

                  </div>

                  <div className="space-y-3">

                    <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-500/20 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">

                      <div className="flex items-center gap-3">

                        <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                        <span className="font-semibold text-red-900 dark:text-red-400">Tüm Verileri Sil</span>

                      </div>

                      <ChevronRight size={18} className="text-red-400" />

                    </button>

                    <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-500/20 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">

                      <div className="flex items-center gap-3">

                        <X size={18} className="text-red-600 dark:text-red-400" />
                        <span className="font-semibold text-red-900 dark:text-red-400">Hesabı Kapat</span>

                      </div>

                      <ChevronRight size={18} className="text-red-400" />

                    </button>

                  </div>

                </div> )}

              </div>

            </div>

          </div>

        </div>

      </main>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;