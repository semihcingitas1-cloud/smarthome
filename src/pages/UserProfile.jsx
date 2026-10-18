import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, Lock, Shield, ShieldCheck, ShieldAlert, LogOut, Calendar, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

import { logoutUser } from '../../redux/userSlice';
import TwoFactorSettings from '../../components/security/TwoFactorSettings';

const initialsOf = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toLocaleUpperCase('tr-TR');
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const ROLE_LABELS = { superadmin: 'Süper Yönetici', admin: 'Sistem Yöneticisi', editor: 'Editör', user: 'Kullanıcı' };

const card = 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] shadow-sm dark:shadow-none';

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="space-y-2">
    <p className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest ml-2">{label}</p>
    <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 px-4">
      <Icon size={18} className="text-gray-400 dark:text-slate-600 flex-shrink-0" />
      <span className={`text-sm truncate ${value ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-600'}`}>{value || 'Belirtilmemiş'}</span>
    </div>
  </div>
);

const UserProfile = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: stateUser } = useSelector((state) => state.user);
  const u = stateUser?.user ?? {};

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const notify = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    if (!window.confirm('Oturumu kapatmak istediğine emin misin?')) return;
    dispatch(logoutUser());
    navigate('/auth');
  };

  const twoFactorOn = !!u.twoFactor?.enabled;
  const roleLabel = ROLE_LABELS[u.role] ?? 'Kullanıcı';

  return (

    <div className="flex-1 lg:ml-0 overflow-x-hidden">

      <div className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white min-h-screen p-6 lg:p-12 max-w-7xl mx-auto transition-colors duration-300">

        {toast && (
          <div role="status" className="fixed top-8 right-8 z-50 bg-green-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 size={20} />
            <p className="font-semibold text-sm">{toast}</p>
          </div>
        )}

        <div className="mb-10 space-y-2">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Profil Ayarları</h1>
          <p className="text-gray-600 dark:text-slate-400">Hesap bilgilerini ve güvenlik ayarlarını buradan yönet.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Sol sütun ── */}
          <div className="space-y-6">

            <div className={`${card} p-8 text-center relative overflow-hidden`}>

              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-15 dark:opacity-20" />

              <div className="relative mt-4 mb-5 inline-block">
                {u.avatar ? (
                  <img src={u.avatar} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-950" />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-950 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black">
                    {initialsOf(u.name)}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold truncate">{u.name || '—'}</h2>
              <p className="text-sm text-gray-500 dark:text-slate-500 font-medium">{roleLabel}</p>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800 space-y-2">

                <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-950/50">
                  <div className="flex items-center gap-3 text-sm font-bold">
                    {twoFactorOn ? <ShieldCheck size={18} className="text-green-500" /> : <ShieldAlert size={18} className="text-amber-500" />}
                    Güvenlik Durumu
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${twoFactorOn ? 'bg-green-500/10 text-green-600 dark:text-green-500' : 'bg-amber-500/10 text-amber-600 dark:text-amber-500'}`}>
                    {twoFactorOn ? 'Güçlü' : 'Geliştirilebilir'}
                  </span>
                </div>

                <button type="button" onClick={handleLogout} className="w-full flex items-center p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all">
                  <span className="flex items-center gap-3 text-sm font-bold"><LogOut size={18} />Oturumu Kapat</span>
                </button>

              </div>

            </div>

            <div className={`${card} p-6 space-y-3`}>
              <h3 className="text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest px-2">Hesap</h3>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-slate-950/50">
                <Calendar size={18} className="text-blue-500" />
                <div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-500">Üyelik tarihi</p>
                  <p className="text-sm font-semibold">{formatDate(u.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-slate-950/50">
                {u.isEmailVerified ? <CheckCircle2 size={18} className="text-green-500" /> : <AlertCircle size={18} className="text-amber-500" />}
                <div>
                  <p className="text-[11px] text-gray-500 dark:text-slate-500">E-posta</p>
                  <p className="text-sm font-semibold">{u.isEmailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Sağ sütun ── */}
          <div className="lg:col-span-2 space-y-8">

            <div className={`${card} p-8 md:p-10 space-y-6`}>

              <h3 className="text-xl font-bold flex items-center gap-3"><User className="text-blue-500" />Kişisel Bilgiler</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField icon={User} label="Ad Soyad" value={u.name} />
                <InfoField icon={Mail} label="E-Posta Adresi" value={u.email} />
                <InfoField icon={Phone} label="Telefon" value={u.phone} />
              </div>

            </div>

            <div className={`${card} p-8 md:p-10 space-y-6`}>

              <h3 className="text-xl font-bold flex items-center gap-3"><Shield className="text-green-500" />Güvenlik</h3>

              <TwoFactorSettings onNotify={notify} />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Lock size={20} className="text-gray-400 dark:text-slate-500 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Şifre</p>
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">Şifreni değiştirmek için e-postana bir sıfırlama bağlantısı gönderilir.</p>
                  </div>
                </div>
                <button type="button" onClick={() => navigate('/forgot')} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap">
                  Şifreni değiştir <ArrowRight size={15} />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserProfile;
