import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, Mail, KeyRound, Smartphone, AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

import { verifyLogin2FA, sendLogin2FAEmail, cancelTwoFactor } from '../../redux/userSlice';

const METHOD_INFO = {
  totp: { Icon: Smartphone, title: 'Doğrulayıcı uygulama', desc: () => 'Doğrulayıcı uygulamandaki 6 haneli kodu gir.' },
  email: { Icon: Mail, title: 'E-posta kodu', desc: (hint) => `${hint || 'E-posta adresine'} gönderilen 6 haneli kodu gir.` },
  backup: { Icon: KeyRound, title: 'Yedek kod', desc: () => 'Kurulumda kaydettiğin yedek kodlardan birini gir (ör. ABCD-EF23).' },
};

const formatBackup = (raw) => {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  return clean.length > 4 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : clean;
};

const TwoFactorLoginStep = () => {

  const dispatch = useDispatch();
  const challenge = useSelector((state) => state.user.twoFactorChallenge);

  const [method, setMethod] = useState('totp');
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [notice, setNotice] = useState(null);

  const inputRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => { inputRef.current?.focus(); }, [method]);

  if (!challenge) return null;

  const isBackup = method === 'backup';
  const cleanCode = isBackup ? code.replace(/[^A-Z0-9]/gi, '') : code;
  const ready = cleanCode.length === (isBackup ? 8 : 6);
  const { Icon, title, desc } = METHOD_INFO[method];

  const switchMethod = (next) => {
    setMethod(next);
    setCode('');
    setError(null);
    if (next !== 'email') setInfo(null);
  };

  const submit = async (value = cleanCode) => {

    if (verifying || value.length < (isBackup ? 8 : 6)) return;

    setVerifying(true);
    setError(null);

    try {

      const data = await dispatch(verifyLogin2FA({ challengeToken: challenge.challengeToken, code: value, method })).unwrap();

      if (data.backupCodesRemaining != null && data.backupCodesRemaining <= 2) {
        // Yönlendirmeden önce kısa bir uyarı (Auth sayfası 1.5 sn bekleyip yönlendiriyor)
        setNotice(`${data.backupCodesRemaining} yedek kodun kaldı. Hesap ayarlarından yenilerini oluştur.`);
      }
    } catch (e) {

      if (mountedRef.current && !['CHALLENGE_EXPIRED', 'TOO_MANY_ATTEMPTS'].includes(e?.code)) {
        setError(e?.message || 'Kod doğrulanamadı.');
        setCode('');
        inputRef.current?.focus();
      }
    } finally {

      if (mountedRef.current) setVerifying(false);
    }
  };

  const handleCodeChange = (e) => {

    setError(null);

    if (isBackup) {
      setCode(formatBackup(e.target.value));
      return;
    }

    const next = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(next);
    if (next.length === 6) submit(next);
  };

  const sendEmailCode = async () => {

    if (sending || cooldown > 0) return;

    setSending(true);
    setError(null);

    try {

      const data = await dispatch(sendLogin2FAEmail({ challengeToken: challenge.challengeToken })).unwrap();
      if (!mountedRef.current) return;

      setMethod('email');
      setCode('');
      setInfo(data.message);
      setCooldown(data.cooldown ?? 60);
    } catch (e) {

      if (!mountedRef.current) return;
      if (e?.retryAfter) setCooldown(e.retryAfter);
      setError(e?.message || 'Kod gönderilemedi.');
    } finally {

      if (mountedRef.current) setSending(false);
    }
  };

  const linkClass = 'w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (

    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="p-8 pt-4 space-y-5">

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <Icon size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{title}</p>
          <p className="text-sm text-gray-600 dark:text-slate-400">{desc(challenge.emailHint)}</p>
        </div>
      </div>

      {info && method === 'email' && (
        <div role="status" className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-3 py-2.5">
          <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-xs text-green-700 dark:text-green-400">{info}</p>
        </div>
      )}

      <input
        ref={inputRef}
        value={code}
        onChange={handleCodeChange}
        disabled={verifying}
        inputMode={isBackup ? 'text' : 'numeric'}
        autoComplete="one-time-code"
        autoCapitalize={isBackup ? 'characters' : 'off'}
        spellCheck={false}
        maxLength={isBackup ? 9 : 6}
        placeholder={isBackup ? 'ABCD-EF23' : '••••••'}
        aria-label={title}
        className={`w-full bg-white dark:bg-slate-800 border rounded-xl py-4 px-4 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 dark:text-white focus:outline-none transition-all ${error ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
      />

      {error && (
        <p role="alert" className="text-red-500 text-sm flex items-center gap-1.5"><AlertCircle size={14} />{error}</p>
      )}

      {notice && (
        <p role="status" className="text-amber-600 dark:text-amber-400 text-sm">{notice}</p>
      )}

      <button type="submit" disabled={!ready || verifying} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
        {verifying ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
        {verifying ? 'Doğrulanıyor...' : 'Doğrula'}
      </button>

      <div className="space-y-1 pt-1">

        <button type="button" onClick={sendEmailCode} disabled={sending || cooldown > 0} className={linkClass}>
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
          {cooldown > 0
            ? `${method === 'email' ? 'Tekrar gönder' : 'Kodu e-postama gönder'} (${cooldown} sn)`
            : method === 'email' ? 'Kodu tekrar gönder' : 'Kodu e-postama gönder'}
        </button>

        {method !== 'totp' && (
          <button type="button" onClick={() => switchMethod('totp')} className={linkClass}>
            <Smartphone size={15} /> Doğrulayıcı uygulamayı kullan
          </button>
        )}

        {method !== 'backup' && (
          <button type="button" onClick={() => switchMethod('backup')} className={linkClass}>
            <KeyRound size={15} /> Yedek kod kullan
          </button>
        )}

        <button type="button" onClick={() => dispatch(cancelTwoFactor())} className="w-full flex items-center justify-center gap-2 py-2 mt-2 text-sm text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors">
          <ArrowLeft size={15} /> Farklı bir hesapla giriş yap
        </button>

      </div>

    </form>
  );
};

export default TwoFactorLoginStep;
