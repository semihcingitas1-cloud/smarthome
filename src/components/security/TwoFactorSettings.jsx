import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ShieldCheck, ShieldOff, Smartphone, Copy, Check, KeyRound, X, AlertCircle, ExternalLink, Download, RefreshCw, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

import { get2FAStatus, setup2FA, enable2FA, disable2FA, regenerateBackupCodes } from '../../redux/userSlice';

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const errorText = (e, fallback) => (typeof e === 'string' ? e : e?.message || fallback);

const inputClass = 'w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm';
const primaryBtn = 'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
const ghostBtn = 'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors';

// ───────────────────────── MODAL ─────────────────────────

const ModalShell = ({ open, title, onClose, children }) => {

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Kapat" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
            <X size={18} className="text-gray-500 dark:text-slate-400" />
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
};

const ErrorLine = ({ text }) => (!text ? null : (
  <p role="alert" className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl px-3 py-2.5 mt-3">
    <AlertCircle size={15} className="flex-shrink-0" />{text}
  </p>
));

// ───────────────────────── YEDEK KODLAR ─────────────────────────

const BackupCodesView = ({ codes, onDone }) => {

  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const text = `TypusHOME yedek kodları\n\n${codes.join('\n')}\n\nHer kod yalnızca bir kez kullanılabilir.\n`;

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typushome-yedek-kodlar.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">

      <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3">
        <KeyRound size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300">Telefonunu kaybedersen bu kodlarla giriş yapabilirsin. Her kod bir kez kullanılır. Şimdi kaydet, bir daha gösterilmeyecek.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
        {codes.map((c) => (
          <code key={c} className="text-center font-mono font-bold text-gray-900 dark:text-white tracking-wider py-1.5">{c}</code>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={copyAll} className={ghostBtn}>{copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}{copied ? 'Kopyalandı' : 'Kopyala'}</button>
        <button type="button" onClick={download} className={ghostBtn}><Download size={16} />İndir (.txt)</button>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500" />
        <span className="text-sm text-gray-700 dark:text-slate-300">Kodları güvenli bir yere kaydettim</span>
      </label>

      <button type="button" onClick={onDone} disabled={!confirmed} className={primaryBtn}>Tamam</button>

    </div>
  );
};

// ───────────────────────── BİLEŞEN ─────────────────────────

const TwoFactorSettings = ({ onNotify }) => {

  const dispatch = useDispatch();

  const [status, setStatus] = useState({ loading: true, enabled: false, enabledAt: null, backupCodesRemaining: 0, error: null });
  const [setup, setSetup] = useState({ open: false, step: 'scan', data: null, code: '', error: null, busy: false, copied: false, codes: [] });
  const [confirm, setConfirm] = useState({ open: false, action: null, password: '', code: '', showPassword: false, error: null, busy: false });
  const [codesModal, setCodesModal] = useState({ open: false, codes: [] });

  const loadStatus = useCallback(async () => {
    setStatus((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await dispatch(get2FAStatus()).unwrap();
      setStatus({ loading: false, enabled: !!data.enabled, enabledAt: data.enabledAt, backupCodesRemaining: data.backupCodesRemaining ?? 0, error: null });
    } catch (e) {
      setStatus((s) => ({ ...s, loading: false, error: errorText(e, 'Durum alınamadı.') }));
    }
  }, [dispatch]);

  useEffect(() => { loadStatus(); }, [loadStatus]);

  // ── Kurulum ──

  const startSetup = async () => {

    setSetup({ open: true, step: 'scan', data: null, code: '', error: null, busy: true, copied: false, codes: [] });

    try {
      const data = await dispatch(setup2FA()).unwrap();
      setSetup((s) => ({ ...s, data, busy: false }));
    } catch (e) {
      setSetup((s) => ({ ...s, busy: false, error: errorText(e, 'Kurulum başlatılamadı.') }));
    }
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(setup.data.secret);
      setSetup((s) => ({ ...s, copied: true }));
      setTimeout(() => setSetup((s) => ({ ...s, copied: false })), 2000);
    } catch {}
  };

  const confirmSetup = async (code = setup.code) => {

    if (code.length !== 6 || setup.busy) return;

    setSetup((s) => ({ ...s, busy: true, error: null }));

    try {
      const data = await dispatch(enable2FA({ code })).unwrap();
      setSetup((s) => ({ ...s, busy: false, step: 'codes', codes: data.backupCodes ?? [] }));
    } catch (e) {
      const expiredSetup = e?.code === 'SETUP_EXPIRED';
      setSetup((s) => ({ ...s, busy: false, code: '', error: errorText(e, 'Kod doğrulanamadı.'), step: expiredSetup ? 'scan' : s.step, data: expiredSetup ? null : s.data }));
    }
  };

  const closeSetup = useCallback(() => {

    setSetup((s) => {
      if (s.step === 'codes' && !window.confirm('Yedek kodlarını kaydettin mi? Bu kodlar bir daha gösterilmeyecek.')) return s;
      if (s.step === 'codes') { loadStatus(); onNotify?.('İki aşamalı doğrulama açıldı'); }
      return { ...s, open: false };
    });
  }, [loadStatus, onNotify]);

  const finishSetup = () => {
    setSetup((s) => ({ ...s, open: false }));
    loadStatus();
    onNotify?.('İki aşamalı doğrulama açıldı');
  };

  // ── Kapatma / yenileme ──

  const openConfirm = (action) => setConfirm({ open: true, action, password: '', code: '', showPassword: false, error: null, busy: false });
  const closeConfirm = useCallback(() => setConfirm((s) => (s.busy ? s : { ...s, open: false })), []);

  const runConfirm = async (e) => {

    e.preventDefault();

    const { action, password, code } = confirm;
    if (!password || !code.trim()) return;

    setConfirm((s) => ({ ...s, busy: true, error: null }));

    try {

      if (action === 'disable') {
        await dispatch(disable2FA({ password, code: code.trim() })).unwrap();
        setConfirm((s) => ({ ...s, open: false, busy: false }));
        loadStatus();
        onNotify?.('İki aşamalı doğrulama kapatıldı');
      } else {
        const data = await dispatch(regenerateBackupCodes({ password, code: code.trim() })).unwrap();
        setConfirm((s) => ({ ...s, open: false, busy: false }));
        setCodesModal({ open: true, codes: data.backupCodes ?? [] });
      }
    } catch (err) {
      setConfirm((s) => ({ ...s, busy: false, error: errorText(err, 'İşlem başarısız.') }));
    }
  };

  const lowBackup = status.enabled && status.backupCodesRemaining <= 2;

  return (

    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">

      <div className="flex items-start gap-4">

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${status.enabled ? 'bg-green-500/10' : 'bg-gray-100 dark:bg-slate-800'}`}>
          {status.enabled ? <ShieldCheck size={22} className="text-green-600 dark:text-green-400" /> : <ShieldOff size={22} className="text-gray-400" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 dark:text-white">İki aşamalı doğrulama</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.enabled ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>{status.enabled ? 'Açık' : 'Kapalı'}</span>
            {status.loading && <Loader2 size={14} className="animate-spin text-blue-500" />}
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            {status.enabled
              ? `${formatDate(status.enabledAt)} tarihinden beri açık. Girişlerde doğrulayıcı uygulamadaki kod istenir.`
              : 'Şifren ele geçirilse bile hesabına girilemesin. Girişte telefonundaki doğrulayıcı uygulamadan bir kod istenir.'}
          </p>
        </div>

      </div>

      <ErrorLine text={status.error} />

      {status.enabled ? (

        <div className="mt-5 space-y-3">

          <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${lowBackup ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-gray-50 dark:bg-slate-800'}`}>
            <span className={`flex items-center gap-2 text-sm ${lowBackup ? 'text-amber-700 dark:text-amber-300 font-semibold' : 'text-gray-600 dark:text-slate-300'}`}>
              <KeyRound size={15} />{status.backupCodesRemaining} yedek kod kaldı
            </span>
            <button type="button" onClick={() => openConfirm('regenerate')} className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              <RefreshCw size={13} />Yenile
            </button>
          </div>

          <button type="button" onClick={() => openConfirm('disable')} className="w-full py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
            Kapat
          </button>

        </div>

      ) : (

        <button type="button" onClick={startSetup} disabled={status.loading} className={`${primaryBtn} mt-5`}>
          <ShieldCheck size={16} />Aç
        </button>
      )}

      {/* ── Kurulum ── */}
      <ModalShell open={setup.open} title={setup.step === 'codes' ? 'Yedek kodların' : 'İki aşamalı doğrulamayı aç'} onClose={closeSetup}>

        {setup.step === 'scan' && (

          setup.busy && !setup.data ? (
            <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : !setup.data ? (
            <>
              <ErrorLine text={setup.error} />
              <button type="button" onClick={startSetup} className={`${primaryBtn} mt-4`}>Tekrar dene</button>
            </>
          ) : (
            <div className="space-y-4">

              <ol className="text-sm text-gray-600 dark:text-slate-400 space-y-1 list-decimal list-inside">
                <li>Telefonuna Google Authenticator ya da Microsoft Authenticator gibi bir doğrulayıcı uygulama kur.</li>
                <li>Uygulamada yeni hesap ekle ve aşağıdaki QR kodu okut.</li>
              </ol>

              <div className="flex justify-center">
                <div className="bg-white rounded-2xl p-3 border border-gray-200 dark:border-slate-700">
                  <img src={setup.data.qrDataUrl} alt="Doğrulayıcı uygulama için QR kod" width={200} height={200} />
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-slate-500 mb-1.5">QR okutamıyorsan anahtarı elle gir</p>
                <button type="button" onClick={copySecret} className="w-full flex items-center gap-2 bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <code className="flex-1 font-mono font-bold text-sm text-gray-900 dark:text-white tracking-wider break-all">{setup.data.secret.match(/.{1,4}/g)?.join(' ')}</code>
                  {setup.copied ? <Check size={16} className="text-green-600 flex-shrink-0" /> : <Copy size={16} className="text-gray-400 flex-shrink-0" />}
                </button>
              </div>

              <a href={setup.data.otpauthUrl} className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline md:hidden">
                <ExternalLink size={14} />Bu telefondaki uygulamada aç
              </a>

              <ErrorLine text={setup.error} />

              <button type="button" onClick={() => setSetup((s) => ({ ...s, step: 'verify', error: null }))} className={primaryBtn}>Ekledim, devam et</button>

            </div>
          )
        )}

        {setup.step === 'verify' && (
          <form onSubmit={(e) => { e.preventDefault(); confirmSetup(); }} className="space-y-4">

            <div className="flex items-start gap-3">
              <Smartphone size={18} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-slate-400">Doğrulayıcı uygulamada TypusHOME için görünen 6 haneli kodu gir.</p>
            </div>

            <input
              autoFocus
              value={setup.code}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                setSetup((s) => ({ ...s, code: v, error: null }));
                if (v.length === 6) confirmSetup(v);
              }}
              disabled={setup.busy}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="••••••"
              aria-label="Doğrulama kodu"
              className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl py-4 px-4 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <ErrorLine text={setup.error} />

            <button type="submit" disabled={setup.code.length !== 6 || setup.busy} className={primaryBtn}>
              {setup.busy && <Loader2 size={16} className="animate-spin" />}Doğrula ve aç
            </button>

            <button type="button" onClick={() => setSetup((s) => ({ ...s, step: 'scan', code: '', error: null }))} className="w-full text-sm text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 py-1">Geri</button>

          </form>
        )}

        {setup.step === 'codes' && <BackupCodesView codes={setup.codes} onDone={finishSetup} />}

      </ModalShell>

      {/* ── Kapatma / yenileme ── */}
      <ModalShell open={confirm.open} title={confirm.action === 'disable' ? 'İki aşamalı doğrulamayı kapat' : 'Yedek kodları yenile'} onClose={closeConfirm}>

        <form onSubmit={runConfirm} className="space-y-4">

          <p className="text-sm text-gray-600 dark:text-slate-400">
            {confirm.action === 'disable'
              ? 'Kapatınca girişlerde sadece şifren istenir. Diğer cihazlardaki oturumların kapanır.'
              : 'Yeni kodlar oluşturulunca eski yedek kodların hepsi geçersiz olur.'}
          </p>

          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase flex items-center gap-2 mb-1.5"><Lock size={12} />Şifre</label>
            <div className="relative">
              <input type={confirm.showPassword ? 'text' : 'password'} value={confirm.password} onChange={(e) => setConfirm((s) => ({ ...s, password: e.target.value, error: null }))} autoComplete="current-password" className={`${inputClass} pr-11`} placeholder="••••••••" />
              <button type="button" onClick={() => setConfirm((s) => ({ ...s, showPassword: !s.showPassword }))} aria-label="Şifreyi göster" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                {confirm.showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase flex items-center gap-2 mb-1.5"><KeyRound size={12} />Doğrulayıcı kodu ya da yedek kod</label>
            <input value={confirm.code} onChange={(e) => setConfirm((s) => ({ ...s, code: e.target.value, error: null }))} autoComplete="one-time-code" maxLength={9} className={`${inputClass} font-mono tracking-wider`} placeholder="123456 ya da ABCD-EF23" />
          </div>

          <ErrorLine text={confirm.error} />

          <button type="submit" disabled={!confirm.password || !confirm.code.trim() || confirm.busy} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${confirm.action === 'disable' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {confirm.busy && <Loader2 size={16} className="animate-spin" />}
            {confirm.action === 'disable' ? 'Kapat' : 'Yeni kodlar oluştur'}
          </button>

        </form>

      </ModalShell>

      {/* ── Yenilenen yedek kodlar ── */}
      <ModalShell open={codesModal.open} title="Yeni yedek kodların" onClose={() => setCodesModal({ open: false, codes: [] })}>
        <BackupCodesView codes={codesModal.codes} onDone={() => { setCodesModal({ open: false, codes: [] }); loadStatus(); onNotify?.('Yedek kodlar yenilendi'); }} />
      </ModalShell>

    </div>
  );
};

export default TwoFactorSettings;
