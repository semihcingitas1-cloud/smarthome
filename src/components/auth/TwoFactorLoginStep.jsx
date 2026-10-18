import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, Mail, KeyRound, Smartphone, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react-native';

import CodeInput from './CodeInput';
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

  const mountedRef = useRef(true);
  const codeRef = useRef(null);

  useEffect(() => () => { mountedRef.current = false; }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

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
    setTimeout(() => codeRef.current?.focus(), 50);
  };

  const submit = async (value = cleanCode) => {

    if (verifying || value.length < (isBackup ? 8 : 6)) return;

    setVerifying(true);
    setError(null);

    try {

      const data = await dispatch(verifyLogin2FA({ challengeToken: challenge.challengeToken, code: value, method })).unwrap();

      if (data.backupCodesRemaining != null && data.backupCodesRemaining <= 2) {
        Alert.alert('Yedek kodların azalıyor', `${data.backupCodesRemaining} yedek kodun kaldı. Profil > Güvenlik bölümünden yenilerini oluştur.`);
      }
    } catch (e) {

      // Süre dolduysa slice giriş formuna döndürüyor
      if (mountedRef.current && e?.code !== 'CHALLENGE_EXPIRED' && e?.code !== 'TOO_MANY_ATTEMPTS') {
        setError(e?.message || 'Kod doğrulanamadı.');
        setCode('');
        setTimeout(() => codeRef.current?.focus(), 50);
      }
    } finally {

      if (mountedRef.current) setVerifying(false);
    }
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
      setTimeout(() => codeRef.current?.focus(), 50);
    } catch (e) {

      if (!mountedRef.current) return;
      if (e?.retryAfter) setCooldown(e.retryAfter);
      setError(e?.message || 'Kod gönderilemedi.');
    } finally {

      if (mountedRef.current) setSending(false);
    }
  };

  return (

    <View>

      <View className="items-center mb-6">
        <View className="w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center mb-3">
          <ShieldCheck size={30} color="#2563eb" />
        </View>
        <Text className="text-xl font-black text-gray-900">İki aşamalı doğrulama</Text>
        <Text className="text-sm text-gray-500 text-center mt-1 px-4">Hesabını korumak için kimliğini bir kez daha doğrula.</Text>
      </View>

      <View className="flex-row items-center gap-2 mb-2">
        <Icon size={16} color="#2563eb" />
        <Text className="text-sm font-bold text-gray-900">{title}</Text>
      </View>
      <Text className="text-sm text-gray-500 mb-4">{desc(challenge.emailHint)}</Text>

      {info && method === 'email' && (
        <View className="flex-row items-center gap-2 bg-green-50 rounded-xl p-3 mb-4">
          <CheckCircle2 size={15} color="#16a34a" />
          <Text className="text-green-700 text-xs flex-1">{info}</Text>
        </View>
      )}

      {isBackup ? (
        <View className={`bg-gray-50 rounded-xl px-4 py-3 border-2 ${error ? 'border-red-300' : 'border-gray-200'}`}>
          <TextInput
            ref={codeRef}
            value={code}
            onChangeText={(t) => { setCode(formatBackup(t)); setError(null); }}
            placeholder="ABCD-EF23"
            placeholderTextColor="#9ca3af"
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
            maxLength={9}
            editable={!verifying}
            returnKeyType="done"
            onSubmitEditing={() => submit()}
            className="text-gray-900 text-xl font-bold text-center tracking-widest"
          />
        </View>
      ) : (
        <CodeInput ref={codeRef} value={code} onChange={(v) => { setCode(v); setError(null); }} onComplete={(v) => submit(v)} autoFocus disabled={verifying} error={!!error} light />
      )}

      {!!error && (
        <View className="flex-row items-center gap-2 mt-3">
          <AlertCircle size={14} color="#ef4444" />
          <Text className="text-red-500 text-sm flex-1">{error}</Text>
        </View>
      )}

      <TouchableOpacity onPress={() => submit()} disabled={!ready || verifying} activeOpacity={0.85} style={{ borderRadius: 14, overflow: 'hidden', marginTop: 20, opacity: !ready || verifying ? 0.6 : 1 }}>
        <LinearGradient colors={['#2563eb', '#7c3aed']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {verifying ? <ActivityIndicator color="#fff" /> : <ShieldCheck size={20} color="#fff" />}
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Doğrula</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Diğer yöntemler */}
      <View className="mt-5 gap-1">

        {method !== 'email' && (
          <TouchableOpacity onPress={sendEmailCode} disabled={sending || cooldown > 0} className="flex-row items-center justify-center gap-2 py-2.5" style={{ opacity: sending || cooldown > 0 ? 0.5 : 1 }}>
            {sending ? <ActivityIndicator size="small" color="#2563eb" /> : <Mail size={15} color="#2563eb" />}
            <Text className="text-blue-600 text-sm font-semibold">{cooldown > 0 ? `Kodu e-postama gönder (${cooldown} sn)` : 'Kodu e-postama gönder'}</Text>
          </TouchableOpacity>
        )}

        {method === 'email' && (
          <TouchableOpacity onPress={sendEmailCode} disabled={sending || cooldown > 0} className="flex-row items-center justify-center gap-2 py-2.5" style={{ opacity: sending || cooldown > 0 ? 0.5 : 1 }}>
            <Mail size={15} color="#2563eb" />
            <Text className="text-blue-600 text-sm font-semibold">{cooldown > 0 ? `Tekrar gönder (${cooldown} sn)` : 'Kodu tekrar gönder'}</Text>
          </TouchableOpacity>
        )}

        {method !== 'totp' && (
          <TouchableOpacity onPress={() => switchMethod('totp')} className="flex-row items-center justify-center gap-2 py-2.5">
            <Smartphone size={15} color="#2563eb" />
            <Text className="text-blue-600 text-sm font-semibold">Doğrulayıcı uygulamayı kullan</Text>
          </TouchableOpacity>
        )}

        {method !== 'backup' && (
          <TouchableOpacity onPress={() => switchMethod('backup')} className="flex-row items-center justify-center gap-2 py-2.5">
            <KeyRound size={15} color="#2563eb" />
            <Text className="text-blue-600 text-sm font-semibold">Yedek kod kullan</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => dispatch(cancelTwoFactor())} className="flex-row items-center justify-center gap-2 py-2.5 mt-2">
          <ArrowLeft size={15} color="#94a3b8" />
          <Text className="text-gray-400 text-sm">Farklı bir hesapla giriş yap</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

export default TwoFactorLoginStep;
